import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router';
import { RootState } from '../app/store';
import { getCurrencySymbol } from '../utils/validation';
import { addPayment, updateTrip } from '../features/expenses/expensesSlice';
import { DEFAULT_CURRENCY } from '../constants';

const PaymentDetailsScreen: React.FC = () => {
  const { tripId, paymentId } = useParams<{ tripId: string; paymentId?: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const trip = useSelector((state: RootState) => 
    state.tripExpenses.find(t => t.id === Number(tripId))
  );
  
  const paymentToEdit = trip?.payments.find(p => p.id === Number(paymentId));
  const isEditing = !!paymentId && !!paymentToEdit;
  
  const [paymentTitle, setPaymentTitle] = useState(paymentToEdit?.title || '');
  const [paymentShares, setPaymentShares] = useState<Map<string, string>>(new Map());
  const [includedMembers, setIncludedMembers] = useState<Set<string>>(new Set());
  const [formError, setFormError] = useState<string>('');

  // Initialize form data
  useEffect(() => {
    if (!trip) {
      navigate('/');
      return;
    }

    // Initialize included members
    setIncludedMembers(new Set(trip.team.map(member => member.name)));

    if (isEditing && paymentToEdit) {
      setPaymentTitle(paymentToEdit.title);
      
      // Convert payment shares to string map for form
      const sharesMap = new Map<string, string>();
      paymentToEdit.shares.forEach((value, key) => {
        sharesMap.set(key, value.toString());
      });
      setPaymentShares(sharesMap);
      
      // Set included members based on who has shares
      const included = new Set<string>();
      paymentToEdit.shares.forEach((value, key) => {
        if (value > 0 || trip.team.some(member => member.name === key)) {
          included.add(key);
        }
      });
      setIncludedMembers(included);
    }
  }, [trip, paymentToEdit, isEditing, navigate]);

  const handleSave = () => {
    // Clear previous error
    setFormError('');

    // Validate title
    if (!paymentTitle.trim()) {
      setFormError('Please enter a payment title');
      return;
    }

    if (!trip) {
      setFormError('Trip not found');
      return;
    }

    const parsedShares = new Map<string, number>();
    let totalAmount = 0;

    // Only include checked team members in shares
    trip.team.forEach(member => {
      const isIncluded = includedMembers.has(member.name);
      if (isIncluded) {
        const value = paymentShares.get(member.name) || '';
        const parsedValue = Number.parseFloat(value) || 0;
        parsedShares.set(member.name, parsedValue);
        totalAmount += parsedValue;
      }
    });

    // Validate total amount
    if (totalAmount === 0) {
      setFormError('Total payment amount cannot be zero');
      return;
    }

    if (isEditing && paymentToEdit) {
      // Update existing payment
      const updatedPayments = trip.payments.map((payment) =>
        payment.id === paymentToEdit.id
          ? { ...payment, title: paymentTitle, shares: parsedShares }
          : payment
      );
      dispatch(updateTrip({ ...trip, payments: updatedPayments }));
    } else {
      // Add new payment
      const newPayment = {
        id: Date.now(),
        title: paymentTitle,
        shares: parsedShares,
      };
      dispatch(addPayment({ tripId: trip.id, payment: newPayment }));
    }

    // Navigate back to trip details
    navigate(`/trip/${tripId}`);
  };

  const handleCancel = () => {
    navigate(`/trip/${tripId}`);
  };

  const validateAndFormatInput = (input: string): string => {
    let sanitizedInput = input.replace(/[^0-9.]/g, '');
    const parts = sanitizedInput.split('.');
    if (parts.length > 2) {
      sanitizedInput = `${parts[0]}.${parts.slice(1).join('')}`;
    }
    return sanitizedInput;
  };

  const handleInputChange = (name: string, value: string) => {
    const sanitizedValue = validateAndFormatInput(value);
    setPaymentShares((prevShares) => {
      const updatedShares = new Map(prevShares);
      updatedShares.set(name, sanitizedValue);
      return updatedShares;
    });
  };

  const handleMemberToggle = (memberName: string) => {
    setIncludedMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberName)) {
        newSet.delete(memberName);
        // Clear the amount when removing member
        setPaymentShares(prevShares => {
          const updatedShares = new Map(prevShares);
          updatedShares.set(memberName, '');
          return updatedShares;
        });
      } else {
        newSet.add(memberName);
      }
      return newSet;
    });
  };

  const calculateTotal = (): number => {
    let total = 0;
    for (const [memberName, value] of paymentShares) {
      if (includedMembers.has(memberName)) {
        const amount = Number.parseFloat(value);
        if (!Number.isNaN(amount)) {
          total += amount;
        }
      }
    }
    return total;
  };

  return (
    <div className="container payment-details-screen">
      <div className="section">

        {/* Payment Title Input */}
        <div className="field">
          <div className="control">
            <input
              className={`input is-medium ${formError && !paymentTitle.trim() ? 'is-danger' : ''}`}
              type="text"
              placeholder="Taxi, Hotel, Grocery, etc."
              value={paymentTitle}
              onChange={(e) => setPaymentTitle(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Team Members */}
        <div className="field">
          <p className="has-text-grey-dark mb-3 mt-4">Who participated in this payment?</p>
          {trip?.team.map((member) => (
            <div key={member.name} className="field mb-3">
              <div className="columns is-mobile is-vcentered">
                <div className="column">
                  <label className="checkbox is-flex is-align-items-center pl-0">
                    <input
                      type="checkbox"
                      checked={includedMembers.has(member.name)}
                      onChange={() => handleMemberToggle(member.name)}
                      className="mr-2 ml-0"
                      style={{ 
                        transform: 'scale(1.2)', 
                        cursor: 'pointer'
                      }}
                    />
                    <span 
                      className={`ml-2 ${includedMembers.has(member.name) ? '' : 'has-text-decoration-line-through has-text-grey-light'}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {member.name}
                    </span>
                  </label>
                </div>
                <div className="column is-narrow">
                  <div className="field has-addons">
                    <p className="control">
                      <span className="button is-static is-small">{getCurrencySymbol(trip?.currency || DEFAULT_CURRENCY)}</span>
                    </p>
                    <p className="control">
                      <input
                        className={`input is-small ${formError?.includes('amount') ? 'is-danger' : ''}`}
                        type="text"
                        placeholder="0.00"
                        min={0}
                        max={1000000}
                        value={paymentShares.get(member.name) || ''}
                        onChange={(e) => handleInputChange(member.name, e.target.value)}
                        disabled={!includedMembers.has(member.name)}
                        style={{
                          width: "120px"
                        }}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {formError && (
          <div className="notification is-danger is-light">
            {formError}
          </div>
        )}
      </div>

      {/* Footer with Total and buttons */}
      <div className="section pt-0">
        {/* Total Section */}
        <div className="field p-3 has-radius mb-4">
          <div className="columns is-mobile is-vcentered">
            <div className="column">
              <label className="label is-6-mobile has-text-weight-normal has-text-grey-dark">Total</label>
            </div>
            <div className="column is-narrow">
              <div className="field has-addons">
                <p className="control">
                  <span className="has-text-weight-bold has-text-grey-dark">{getCurrencySymbol(trip?.currency || DEFAULT_CURRENCY)}</span>
                  <span className="has-text-weight-bold is-size-5-mobile is-size-4 has-text-primary">
                    {calculateTotal().toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="columns is-mobile">
          <div className="column">
            <button
              className="button is-light is-fullwidth"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
          <div className="column">
            <button
              className="button is-success is-fullwidth"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsScreen;
