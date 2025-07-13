import { TripExpenses, Payment } from '../domain/Expenses';
import { SerializedTripExpenses } from '../app/transform';
import * as LZString from 'lz-string';

// Version for data format compatibility
const SHARE_DATA_VERSION = 1;

export interface ShareData {
  version: number;
  timestamp: number;
  trip: SerializedTripExpenses;
}

export interface ShareDiff {
  newPayments: Payment[];
  updatedPayments: Payment[];
  newTeamMembers: string[];
  updatedTrip: Partial<TripExpenses>;
}

/**
 * Serialize TripExpenses to a compressed string for URL sharing
 * Uses LZ-string compression for compact, URL-safe links
 */
export function serializeTripForSharing(trip: TripExpenses): string {
  // Convert to serialized format (same as Redux persist)
  const serializedTrip: SerializedTripExpenses = {
    ...trip,
    payments: trip.payments.map(payment => ({
      ...payment,
      shares: Object.fromEntries(payment.shares),
    })),
  };

  const shareData: ShareData = {
    version: SHARE_DATA_VERSION,
    timestamp: Date.now(),
    trip: serializedTrip,
  };

  // Convert to JSON and compress with LZ-string
  const jsonString = JSON.stringify(shareData);
  return LZString.compressToEncodedURIComponent(jsonString);
}

/**
 * Deserialize TripExpenses from a compressed string
 */
export function deserializeTripFromSharing(compressedData: string): TripExpenses | null {
  try {
    const jsonString = LZString.decompressFromEncodedURIComponent(compressedData);
    if (!jsonString) {
      throw new Error('Failed to decompress data');
    }
    
    const shareData: ShareData = JSON.parse(jsonString);
    
    // Version check for future compatibility
    if (shareData.version > SHARE_DATA_VERSION) {
      throw new Error(`Unsupported data version: ${shareData.version}`);
    }
    
    // Convert back to TripExpenses format
    const trip: TripExpenses = {
      ...shareData.trip,
      payments: shareData.trip.payments.map(payment => ({
        ...payment,
        shares: new Map(Object.entries(payment.shares)),
      })),
    };
    
    return trip;
  } catch (error) {
    console.error('Failed to deserialize trip data:', error);
    return null;
  }
}

/**
 * Generate a share URL for a trip
 */
export function generateShareUrl(trip: TripExpenses, baseUrl: string = window.location.origin): string {
  const compressedData = serializeTripForSharing(trip);
  return `${baseUrl}/trip/${trip.id}/share?d=${compressedData}`;
}

/**
 * Extract share data from URL
 */
export function extractShareDataFromUrl(url: string): string | null {
  try {
    // Handle relative URLs by adding a base URL
    const fullUrl = url.startsWith('http') ? url : `http://localhost${url}`;
    const urlObj = new URL(fullUrl);
    const tripId = urlObj.pathname.split('/')[2]; // /trip/{id}/share
    const data = urlObj.searchParams.get('d');
    
    if (!data || !tripId) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to extract share data from URL:', error);
    return null;
  }
}

/**
 * Calculate differences between two trips for merging
 */
export function calculateTripDiff(
  currentTrip: TripExpenses,
  sharedTrip: TripExpenses
): ShareDiff {
  const diff: ShareDiff = {
    newPayments: [],
    updatedPayments: [],
    newTeamMembers: [],
    updatedTrip: {},
  };

  // Check for trip metadata changes
  if (currentTrip.title !== sharedTrip.title) {
    diff.updatedTrip.title = sharedTrip.title;
  }
  if (currentTrip.currency !== sharedTrip.currency) {
    diff.updatedTrip.currency = sharedTrip.currency;
  }

  // Find new team members
  const currentTeamNames = new Set(currentTrip.team.map(m => m.name));
  const newTeamMembers = sharedTrip.team.filter(m => !currentTeamNames.has(m.name));
  diff.newTeamMembers = newTeamMembers.map(m => m.name);

  // Find new and updated payments
  sharedTrip.payments.forEach(sharedPayment => {
    const currentPayment = currentTrip.payments.find(p => p.id === sharedPayment.id);
    
    if (!currentPayment) {
      // New payment
      diff.newPayments.push(sharedPayment);
    } else {
      // Check if payment was updated
      if (hasPaymentChanged(currentPayment, sharedPayment)) {
        diff.updatedPayments.push(sharedPayment);
      }
    }
  });

  return diff;
}

/**
 * Check if a payment has changed
 */
function hasPaymentChanged(current: Payment, updated: Payment): boolean {
  if (current.title !== updated.title) return true;
  
  // Check if shares have changed
  if (current.shares.size !== updated.shares.size) return true;
  
  for (const [person, amount] of current.shares) {
    if (updated.shares.get(person) !== amount) return true;
  }
  
  return false;
}

/**
 * Merge shared trip data into current trip
 */
export function mergeTripData(
  currentTrip: TripExpenses,
  sharedTrip: TripExpenses
): TripExpenses {
  // Start with current trip
  const mergedTrip: TripExpenses = { ...currentTrip };
  
  // Update metadata if different
  if (sharedTrip.title !== currentTrip.title) {
    mergedTrip.title = sharedTrip.title;
  }
  if (sharedTrip.currency !== currentTrip.currency) {
    mergedTrip.currency = sharedTrip.currency;
  }
  
  // Merge team members
  const currentTeamNames = new Set(currentTrip.team.map(m => m.name));
  const newTeamMembers = sharedTrip.team.filter(m => !currentTeamNames.has(m.name));
  mergedTrip.team = [...currentTrip.team, ...newTeamMembers];
  
  // Merge payments using upsert logic
  const paymentMap = new Map(currentTrip.payments.map(p => [p.id, p]));
  
  sharedTrip.payments.forEach(sharedPayment => {
    const existingPayment = paymentMap.get(sharedPayment.id);
    
    if (existingPayment) {
      // Update existing payment
      paymentMap.set(sharedPayment.id, {
        ...existingPayment,
        title: sharedPayment.title,
        shares: new Map(sharedPayment.shares),
      });
    } else {
      // Add new payment
      paymentMap.set(sharedPayment.id, {
        ...sharedPayment,
        shares: new Map(sharedPayment.shares),
      });
    }
  });
  
  mergedTrip.payments = Array.from(paymentMap.values());
  
  return mergedTrip;
}

/**
 * Validate share data integrity
 */
export function validateShareData(data: string): boolean {
  try {
    const trip = deserializeTripFromSharing(data);
    return trip !== null && 
           trip.id > 0 && 
           trip.title.length > 0 && 
           trip.team.length > 0;
  } catch {
    return false;
  }
} 

// --- LZ-string compact format ---
function compactTrip(trip: TripExpenses) {
  return {
    i: trip.id,
    t: trip.title,
    c: trip.currency,
    m: trip.team.map(p => p.name),
    p: trip.payments.map(pay => ({
      i: pay.id,
      t: pay.title,
      s: Object.fromEntries(pay.shares)
    }))
  };
}

export function serializeTripLZ(trip: TripExpenses): string {
  const compact = compactTrip(trip);
  const json = JSON.stringify(compact);
  return LZString.compressToEncodedURIComponent(json);
}

export function deserializeTripLZ(data: string): TripExpenses | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(data);
    if (!json) return null;
    
    const c = JSON.parse(json);
    return {
      id: c.i,
      title: c.t,
      currency: c.c,
      team: c.m.map((name: string) => ({ name })),
      payments: c.p.map((p: { i: number; t: string; s: Record<string, number> }) => ({
        id: p.i,
        title: p.t,
        shares: new Map(Object.entries(p.s))
      }))
    };
  } catch {
    return null;
  }
}

// --- Helper for size comparison ---
export function getByteLength(str: string): number {
  // Returns the number of bytes in a string
  // Handle test environment where TextEncoder might not be available
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str).length;
  }
  // Fallback for test environment - approximate byte length
  return str.length;
}

/**
 * Analyze URL length and compression for trip data
 * Returns information about URL length, compression ratio, and recommendations
 */
export function analyzeUrlLength(trip: TripExpenses, maxUrlLength: number = 32000): {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  urlLength: number;
  maxUrlLength: number;
  isWithinLimits: boolean;
  recommendedMaxPayments: number;
} {
  const serialized = serializeTripForSharing(trip);
  const originalJson = JSON.stringify({
    version: SHARE_DATA_VERSION,
    timestamp: Date.now(),
    trip: {
      ...trip,
      payments: trip.payments.map(payment => ({
        ...payment,
        shares: Object.fromEntries(payment.shares),
      })),
    }
  });
  
  const originalSize = getByteLength(originalJson);
  const compressedSize = getByteLength(serialized);
  const compressionRatio = compressedSize / originalSize;
  
  // Calculate full URL length
  const baseUrl = 'https://travelsplit.app';
  const fullUrl = `${baseUrl}/trip/${trip.id}/share?d=${serialized}`;
  const urlLength = fullUrl.length;
  
  // Browser URL length limits:
  // - Chrome: ~32,000 characters
  // - Firefox: ~65,000 characters
  // - Safari: ~80,000 characters
  // - Edge (Chromium): ~32,000+ characters
  // We use 32,000 for modern browser compatibility (IE not supported)
  const isWithinLimits = urlLength <= maxUrlLength;
  
  // Estimate how many payments we can fit based on current compression
  const avgPaymentSize = trip.payments.length > 0 ? compressedSize / trip.payments.length : 0;
  const recommendedMaxPayments = avgPaymentSize > 0 ? Math.floor((maxUrlLength - 200) / avgPaymentSize) : 500; // 200 chars for base URL
  
  return {
    originalSize,
    compressedSize,
    compressionRatio,
    urlLength,
    maxUrlLength,
    isWithinLimits,
    recommendedMaxPayments
  };
}

/**
 * Create a trip with limited payments to fit within URL length constraints
 * Removes oldest payments first to maintain the most recent data
 * Uses 32,000 as the default for modern browsers (IE not supported)
 */
export function createUrlSafeTrip(trip: TripExpenses, maxUrlLength: number = 32000): TripExpenses {
  const analysis = analyzeUrlLength(trip, maxUrlLength);
  
  if (analysis.isWithinLimits) {
    return trip; // Already within limits
  }
  
  // Sort payments by ID (assuming newer payments have higher IDs)
  const sortedPayments = [...trip.payments].sort((a, b) => a.id - b.id);
  
  // Try with fewer payments, starting from the most recent
  for (let i = sortedPayments.length - 1; i >= 0; i--) {
    const testTrip = { ...trip, payments: sortedPayments.slice(i) };
    const testAnalysis = analyzeUrlLength(testTrip, maxUrlLength);
    
    if (testAnalysis.isWithinLimits) {
      return testTrip;
    }
  }
  
  // If we still can't fit, return a minimal trip with just metadata
  return {
    ...trip,
    payments: []
  };
} 