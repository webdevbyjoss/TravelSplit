import React, { useState, useEffect } from 'react';

type PaymentDetailsScreenProps = {
  team: { name: string }[];
  onSave: (paymentTitle: string, paymentShares: Map<string, number>) => void;
  initialTitle?: string; // Optional initial payment title
  initialShares?: Map<string, number>; // Optional initial shares
};
const PaymentDetailsScreen: React.FC<PaymentDetailsScreenProps> = ({
                                                                     team,
                                                                     onSave,
                                                                     initialTitle = '',
                                                                     initialShares = new Map(),
                                                                   }) => {
  const [paymentTitle, setPaymentTitle] = useState(initialTitle);
  const [paymentShares, setPaymentShares] = useState<Map<string, string>>(() =>
    new Map(Array.from(initialShares).map(([key, value]) => [key, value.toString()]))
  );
  const [includedMembers, setIncludedMembers] = useState<Set<string>>(() => {
    // Initialize with all team members if editing, or just those with non-zero amounts
    if (initialShares.size > 0) {
      return new Set(Array.from(initialShares.keys()));
    } else {
      return new Set(team.map(member => member.name));
    }
  });
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    // Populate form when initial values change (e.g., when editing)
    setPaymentTitle(initialTitle);
    setPaymentShares(
      new Map(Array.from(initialShares).map(([key, value]) => [key, value.toString()]))
    );
    if (initialShares.size > 0) {
      setIncludedMembers(new Set(Array.from(initialShares.keys())));
    } else {
      setIncludedMembers(new Set(team.map(member => member.name)));
    }
  }, [initialTitle, initialShares, team]);

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

    // Include all team members in shares, with 0 for those not included or with empty values
    team.forEach(member => {
      const isIncluded = includedMembers.has(member.name);
      const value = paymentShares.get(member.name) || '';
      const parsedValue = isIncluded ? Number.parseFloat(value) || 0 : 0;
      parsedShares.set(member.name, parsedValue);
      totalAmount += parsedValue;
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
    <div>
      <div className="field">
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
      <h2 className="subtitle is-6-mobile has-text-weight-normal has-text-grey-dark">Who participated in this payment?</h2>
      {team.map((member) => (
        <div key={member.name} className="field">
          <div className="columns is-mobile is-vcentered">
            <div className="column">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={includedMembers.has(member.name)}
                  onChange={() => handleMemberToggle(member.name)}
                />
                <span className="ml-2">{member.name}</span>
              </label>
            </div>
            <div className="column is-narrow">
              <div className="field has-addons">
                <p className="control">
                  <span className="button is-static is-small">$</span>
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
                    style={{width: "120px"}}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="field mt-4 has-background-primary-light p-3">
        <div className="columns is-mobile is-vcentered">
          <div className="column">
            <label className="label is-6-mobile has-text-weight-normal has-text-grey-dark">Total</label>
          </div>
          <div className="column is-narrow">
            <div className="field has-addons">
              <p className="control">
                <span className="has-text-weight-bold">$</span>
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
      <div className="buttons mt-4">
        <button
          className="button is-success is-small-mobile"
          type="button"
          onClick={handleSave}
        >
          Save Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentDetailsScreen;
