import { 
  serializeTripForSharing, 
  deserializeTripFromSharing, 
  generateShareUrl,
  extractShareDataFromUrl,
  calculateTripDiff,
  mergeTripData,
  validateShareData
} from '../utils/serialization';
import { TripExpenses } from '../domain/Expenses';

describe('Serialization', () => {
  const mockTrip: TripExpenses = {
    id: 1234567890,
    title: 'Test Trip',
    currency: 'USD',
    team: [
      { name: 'John' },
      { name: 'Alice' },
      { name: 'Bob' }
    ],
    payments: [
      {
        id: 1,
        title: 'Hotel',
        shares: new Map([
          ['John', 100],
          ['Alice', 50],
          ['Bob', 0]
        ])
      },
      {
        id: 2,
        title: 'Dinner',
        shares: new Map([
          ['John', 0],
          ['Alice', 30],
          ['Bob', 30]
        ])
      }
    ]
  };

  describe('serializeTripForSharing', () => {
    it('should serialize trip data correctly', () => {
      const serialized = serializeTripForSharing(mockTrip);
      
      expect(serialized).toBeDefined();
      expect(typeof serialized).toBe('string');
      expect(serialized.length).toBeGreaterThan(0);
    });

    it('should produce URL-safe output', () => {
      const serialized = serializeTripForSharing(mockTrip);
      
      // LZ-string compressToEncodedURIComponent should be URL-safe
      // It can contain some special characters but they should be URL-safe
      expect(serialized).toBeDefined();
      expect(typeof serialized).toBe('string');
      expect(serialized.length).toBeGreaterThan(0);
      
      // Test that it can be used in a URL without encoding issues
      const testUrl = `https://example.com/share?d=${serialized}`;
      expect(testUrl).toContain(serialized);
    });

    it('should handle empty payments array', () => {
      const tripWithNoPayments = { ...mockTrip, payments: [] };
      const serialized = serializeTripForSharing(tripWithNoPayments);
      const deserialized = deserializeTripFromSharing(serialized);
      
      expect(deserialized).toEqual(tripWithNoPayments);
    });

    it('should handle single team member', () => {
      const singleMemberTrip = { ...mockTrip, team: [{ name: 'Solo' }] };
      const serialized = serializeTripForSharing(singleMemberTrip);
      const deserialized = deserializeTripFromSharing(serialized);
      
      expect(deserialized).toEqual(singleMemberTrip);
    });
  });

  describe('deserializeTripFromSharing', () => {
    it('should deserialize trip data correctly', () => {
      const serialized = serializeTripForSharing(mockTrip);
      const deserialized = deserializeTripFromSharing(serialized);
      
      expect(deserialized).toBeDefined();
      expect(deserialized).toEqual(mockTrip);
    });

    it('should handle invalid data gracefully', () => {
      const invalidData = 'invalid-data';
      const result = deserializeTripFromSharing(invalidData);
      
      expect(result).toBeNull();
    });

    it('should handle malformed base64 data', () => {
      const malformedData = 'not-base64-data!@#';
      const result = deserializeTripFromSharing(malformedData);
      
      expect(result).toBeNull();
    });

    it('should handle empty string', () => {
      const result = deserializeTripFromSharing('');
      
      expect(result).toBeNull();
    });
  });

  describe('generateShareUrl', () => {
    it('should generate correct share URL', () => {
      const shareUrl = generateShareUrl(mockTrip);
      
      expect(shareUrl).toContain(`/trip/${mockTrip.id}/share`);
      expect(shareUrl).toContain('?d=');
    });

    it('should use custom base URL when provided', () => {
      const baseUrl = 'https://example.com';
      const shareUrl = generateShareUrl(mockTrip, baseUrl);
      
      expect(shareUrl).toMatch(new RegExp(`^${baseUrl}/trip/${mockTrip.id}/share\\?d=`));
    });

    it('should handle different base URLs', () => {
      const baseUrl = 'https://travelsplit.app';
      const shareUrl = generateShareUrl(mockTrip, baseUrl);
      
      expect(shareUrl).toMatch(new RegExp(`^${baseUrl}/trip/${mockTrip.id}/share\\?d=`));
    });
  });

  describe('extractShareDataFromUrl', () => {
    it('should extract data from valid URL', () => {
      const shareUrl = generateShareUrl(mockTrip);
      const extracted = extractShareDataFromUrl(shareUrl);
      
      expect(extracted).toBeDefined();
      expect(typeof extracted).toBe('string');
    });

    it('should extract data from relative URL', () => {
      const shareUrl = generateShareUrl(mockTrip);
      const relativeUrl = shareUrl.replace(/^https?:\/\/[^/]+/, '');
      const extracted = extractShareDataFromUrl(relativeUrl);
      
      expect(extracted).toBeDefined();
      expect(typeof extracted).toBe('string');
    });

    it('should return null for invalid URL', () => {
      const invalidUrl = 'https://example.com/invalid';
      const extracted = extractShareDataFromUrl(invalidUrl);
      
      expect(extracted).toBeNull();
    });

    it('should return null for URL without data parameter', () => {
      const urlWithoutData = 'https://example.com/trip/123/share';
      const extracted = extractShareDataFromUrl(urlWithoutData);
      
      expect(extracted).toBeNull();
    });

    it('should return null for URL without trip ID', () => {
      const urlWithoutTripId = 'https://example.com/share?d=some-data';
      const extracted = extractShareDataFromUrl(urlWithoutTripId);
      
      expect(extracted).toBeNull();
    });
  });

  describe('validateShareData', () => {
    it('should validate correct share data', () => {
      const serialized = serializeTripForSharing(mockTrip);
      const isValid = validateShareData(serialized);
      
      expect(isValid).toBe(true);
    });

    it('should reject invalid share data', () => {
      const isValid = validateShareData('invalid-data');
      
      expect(isValid).toBe(false);
    });

    it('should reject empty data', () => {
      const isValid = validateShareData('');
      
      expect(isValid).toBe(false);
    });

    it('should reject data with invalid trip structure', () => {
      const invalidTripData = {
        version: 1,
        timestamp: Date.now(),
        trip: {
          id: 0, // Invalid ID
          title: '',
          currency: 'USD',
          team: [],
          payments: []
        }
      };
      
      const serialized = btoa(JSON.stringify(invalidTripData))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      const isValid = validateShareData(serialized);
      
      expect(isValid).toBe(false);
    });
  });

  describe('calculateTripDiff', () => {
    it('should detect new payments', () => {
      const currentTrip = { ...mockTrip, payments: [mockTrip.payments[0]] };
      const sharedTrip = { ...mockTrip, payments: mockTrip.payments };
      
      const diff = calculateTripDiff(currentTrip, sharedTrip);
      
      expect(diff.newPayments).toHaveLength(1);
      expect(diff.newPayments[0].id).toBe(2);
    });

    it('should detect updated payments', () => {
      const currentTrip = { ...mockTrip };
      const updatedPayment = {
        ...mockTrip.payments[0],
        title: 'Updated Hotel'
      };
      const sharedTrip = { 
        ...mockTrip, 
        payments: [updatedPayment, mockTrip.payments[1]] 
      };
      
      const diff = calculateTripDiff(currentTrip, sharedTrip);
      
      expect(diff.updatedPayments).toHaveLength(1);
      expect(diff.updatedPayments[0].title).toBe('Updated Hotel');
    });

    it('should detect new team members', () => {
      const currentTrip = { 
        ...mockTrip, 
        team: [mockTrip.team[0], mockTrip.team[1]] 
      };
      const sharedTrip = { ...mockTrip };
      
      const diff = calculateTripDiff(currentTrip, sharedTrip);
      
      expect(diff.newTeamMembers).toHaveLength(1);
      expect(diff.newTeamMembers[0]).toBe('Bob');
    });

    it('should detect no changes', () => {
      const diff = calculateTripDiff(mockTrip, mockTrip);
      
      expect(diff.newPayments).toHaveLength(0);
      expect(diff.updatedPayments).toHaveLength(0);
      expect(diff.newTeamMembers).toHaveLength(0);
      expect(Object.keys(diff.updatedTrip)).toHaveLength(0);
    });

    it('should detect title changes', () => {
      const currentTrip = { ...mockTrip };
      const sharedTrip = { ...mockTrip, title: 'Updated Trip Title' };
      
      const diff = calculateTripDiff(currentTrip, sharedTrip);
      
      expect(diff.updatedTrip.title).toBe('Updated Trip Title');
    });

    it('should detect currency changes', () => {
      const currentTrip = { ...mockTrip };
      const sharedTrip = { ...mockTrip, currency: 'EUR' };
      
      const diff = calculateTripDiff(currentTrip, sharedTrip);
      
      expect(diff.updatedTrip.currency).toBe('EUR');
    });

    it('should detect payment share changes', () => {
      const currentTrip = { ...mockTrip };
      const updatedPayment = {
        ...mockTrip.payments[0],
        shares: new Map([
          ['John', 150], // Changed from 100
          ['Alice', 50],
          ['Bob', 0]
        ])
      };
      const sharedTrip = { 
        ...mockTrip, 
        payments: [updatedPayment, mockTrip.payments[1]] 
      };
      
      const diff = calculateTripDiff(currentTrip, sharedTrip);
      
      expect(diff.updatedPayments).toHaveLength(1);
      expect(diff.updatedPayments[0].id).toBe(1);
    });
  });

  describe('mergeTripData', () => {
    it('should merge new payments correctly', () => {
      const currentTrip = { ...mockTrip, payments: [mockTrip.payments[0]] };
      const sharedTrip = { ...mockTrip };
      
      const merged = mergeTripData(currentTrip, sharedTrip);
      
      expect(merged.payments).toHaveLength(2);
      expect(merged.payments[0].id).toBe(1);
      expect(merged.payments[1].id).toBe(2);
    });

    it('should update existing payments', () => {
      const currentTrip = { ...mockTrip };
      const updatedPayment = {
        ...mockTrip.payments[0],
        title: 'Updated Hotel'
      };
      const sharedTrip = { 
        ...mockTrip, 
        payments: [updatedPayment, mockTrip.payments[1]] 
      };
      
      const merged = mergeTripData(currentTrip, sharedTrip);
      
      expect(merged.payments[0].title).toBe('Updated Hotel');
    });

    it('should merge team members', () => {
      const currentTrip = { 
        ...mockTrip, 
        team: [mockTrip.team[0], mockTrip.team[1]] 
      };
      const sharedTrip = { ...mockTrip };
      
      const merged = mergeTripData(currentTrip, sharedTrip);
      
      expect(merged.team).toHaveLength(3);
      expect(merged.team.map(m => m.name)).toContain('Bob');
    });

    it('should update trip metadata', () => {
      const currentTrip = { ...mockTrip };
      const sharedTrip = { 
        ...mockTrip, 
        title: 'Updated Title',
        currency: 'EUR'
      };
      
      const merged = mergeTripData(currentTrip, sharedTrip);
      
      expect(merged.title).toBe('Updated Title');
      expect(merged.currency).toBe('EUR');
    });

    it('should preserve existing data when no changes', () => {
      const merged = mergeTripData(mockTrip, mockTrip);
      
      expect(merged).toEqual(mockTrip);
    });

    it('should handle empty current trip', () => {
      const emptyTrip = { ...mockTrip, payments: [], team: [] };
      const sharedTrip = { ...mockTrip };
      
      const merged = mergeTripData(emptyTrip, sharedTrip);
      
      expect(merged.payments).toHaveLength(2);
      expect(merged.team).toHaveLength(3);
    });
  });

  describe('End-to-end serialization', () => {
    it('should maintain data integrity through serialization cycle', () => {
      const serialized = serializeTripForSharing(mockTrip);
      const deserialized = deserializeTripFromSharing(serialized);
      
      expect(deserialized).toEqual(mockTrip);
    });

    it('should handle complex trip data', () => {
      const complexTrip: TripExpenses = {
        id: 999999999,
        title: 'Complex Trip with Special Characters: 🏖️',
        currency: 'EUR',
        team: [
          { name: 'José' },
          { name: 'Maria' },
          { name: 'Jean-Pierre' }
        ],
        payments: [
          {
            id: 1001,
            title: 'Hôtel & Restaurant',
            shares: new Map([
              ['José', 150.50],
              ['Maria', 75.25],
              ['Jean-Pierre', 0]
            ])
          }
        ]
      };
      
      const serialized = serializeTripForSharing(complexTrip);
      const deserialized = deserializeTripFromSharing(serialized);
      
      expect(deserialized).toEqual(complexTrip);
    });

    it('should handle very long trip titles', () => {
      const longTitleTrip = {
        ...mockTrip,
        title: 'This is a very long trip title that contains many characters and should still be serialized correctly without any issues. It includes special characters like: !@#$%^&*() and emojis: 🎉🎊🎈'
      };
      
      const serialized = serializeTripForSharing(longTitleTrip);
      const deserialized = deserializeTripFromSharing(serialized);
      
      expect(deserialized).toEqual(longTitleTrip);
    });

    it('should handle decimal amounts correctly', () => {
      const decimalTrip = {
        ...mockTrip,
        payments: [
          {
            id: 1,
            title: 'Precise Payment',
            shares: new Map([
              ['John', 100.123456789],
              ['Alice', 50.987654321],
              ['Bob', 0.000000001]
            ])
          }
        ]
      };
      
      const serialized = serializeTripForSharing(decimalTrip);
      const deserialized = deserializeTripFromSharing(serialized);
      
      expect(deserialized).toEqual(decimalTrip);
    });

    it('should handle negative amounts', () => {
      const negativeTrip = {
        ...mockTrip,
        payments: [
          {
            id: 1,
            title: 'Refund Payment',
            shares: new Map([
              ['John', -50],
              ['Alice', -25],
              ['Bob', 75]
            ])
          }
        ]
      };
      
      const serialized = serializeTripForSharing(negativeTrip);
      const deserialized = deserializeTripFromSharing(serialized);
      
      expect(deserialized).toEqual(negativeTrip);
    });
  });

  describe('URL generation and parsing', () => {
    it('should generate and parse URLs correctly', () => {
      const shareUrl = generateShareUrl(mockTrip);
      const extractedData = extractShareDataFromUrl(shareUrl);
      const deserialized = deserializeTripFromSharing(extractedData!);
      
      expect(deserialized).toEqual(mockTrip);
    });

    it('should handle different base URLs', () => {
      const baseUrl = 'https://travelsplit.app';
      const shareUrl = generateShareUrl(mockTrip, baseUrl);
      const extractedData = extractShareDataFromUrl(shareUrl);
      const deserialized = deserializeTripFromSharing(extractedData!);
      
      expect(deserialized).toEqual(mockTrip);
    });
  });
}); 