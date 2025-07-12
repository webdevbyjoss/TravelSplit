import React, { useState, useEffect } from 'react';
import { getCurrencySymbol } from '../utils/validation';

type PaymentDetailsScreenProps = {
  team: { name: string }[];
  // eslint-disable-next-line no-unused-vars
  onSave: (paymentTitle: string, paymentShares: Map<string, number>) => void;
  onCancel?: () => void; // Add cancel handler
  initialTitle?: string; // Optional initial payment title
  initialShares?: Map<string, number>; // Optional initial shares
  currency: string; // required
};

const PaymentDetailsScreen: React.FC<PaymentDetailsScreenProps> = ({
  team,
  onSave,
  onCancel,
  initialTitle = '',
  initialShares = new Map(),
  currency, // required, no default
}) => {
  const [paymentTitle, setPaymentTitle] = useState(initialTitle);
  const [paymentShares, setPaymentShares] = useState<Map<string, string>>(new Map());
  const [includedMembers, setIncludedMembers] = useState<Set<string>>(new Set(team.map(member => member.name)));
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    if (initialTitle) {
      setPaymentTitle(initialTitle);
    }
    if (initialShares.size > 0) {
      const sharesMap = new Map<string, string>();
      initialShares.forEach((value, key) => {
        sharesMap.set(key, value.toString());
      });
      setPaymentShares(sharesMap);
    }
  }, [initialTitle, initialShares]);

  const handleSave = () => {
    // Clear previous error
    setFormError('');

    // Validate title
    if (!paymentTitle.trim()) {
      setFormError('Please enter a payment title');
      return;
    }

    const parsedShares = new Map<string, number>();
    let totalAmount = 0;

    // Only include checked team members in shares
    team.forEach(member => {
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

    onSave(paymentTitle, parsedShares);
    setPaymentTitle('');
    setPaymentShares(new Map());
    setIncludedMembers(new Set(team.map(member => member.name)));
    setFormError('');
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
    <div className="payment-details-container">
      <div className="payment-details-content">
        <div className="field mb-2">
          <div className="control">
            <input
              className={`input ${formError && !paymentTitle.trim() ? 'is-danger' : ''}`}
              type="text"
              placeholder="Taxi, Hotel, Grocery, etc."
              value={paymentTitle}
              onChange={(e) => setPaymentTitle(e.target.value)}
            />
          </div>
        </div>
        <h2 className="subtitle is-6-mobile has-text-weight-normal has-text-grey-dark mb-4">Who participated in this payment?</h2>
        {team.map((member) => (
          <div key={member.name} className="field mb-3">
            <div className="columns is-mobile is-vcentered">
              <div className="column">
                <label className="checkbox" style={{ display: 'flex', alignItems: 'center', paddingLeft: '0' }}>
                  <input
                    type="checkbox"
                    checked={includedMembers.has(member.name)}
                    onChange={() => handleMemberToggle(member.name)}
                    style={{ 
                      transform: 'scale(1.2)', 
                      marginRight: '8px',
                      cursor: 'pointer',
                      marginLeft: '0'
                    }}
                  />
                  <span 
                    className="ml-2" 
                    style={{ 
                      textDecoration: includedMembers.has(member.name) ? 'none' : 'line-through',
                      opacity: includedMembers.has(member.name) ? '1' : '0.6',
                      cursor: 'pointer'
                    }}
                  >
                    {member.name}
                  </span>
                </label>
              </div>
              <div className="column is-narrow">
                <div className="field has-addons">
                  <p className="control">
                    <span className="button is-static is-small">{getCurrencySymbol(currency)}</span>
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
      
      <div className="payment-details-footer">
        <div className="field has-background-light p-3" style={{ borderRadius: '8px', border: '1px solid var(--payment-total-border)' }}>
          <div className="columns is-mobile is-vcentered">
            <div className="column">
              <label className="label is-6-mobile has-text-weight-normal has-text-grey-dark">Total</label>
            </div>
            <div className="column is-narrow">
              <div className="field has-addons">
                <p className="control">
                  <span className="has-text-weight-bold has-text-grey-dark">{getCurrencySymbol(currency)}</span>
                  <span className="has-text-weight-bold is-size-5-mobile is-size-4 has-text-primary">
                    {calculateTotal().toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {formError && (
          <p className="help is-danger mb-2">{formError}</p>
        )}
        <div className="buttons">
          {onCancel && (
            <button
              className="button is-light is-small-mobile mr-2"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button
            className="button is-success is-small-mobile"
            type="button"
            onClick={handleSave}
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsScreen;
