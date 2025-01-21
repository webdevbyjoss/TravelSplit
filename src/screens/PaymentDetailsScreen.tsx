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
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    // Populate form when initial values change (e.g., when editing)
    setPaymentTitle(initialTitle);
    setPaymentShares(
      new Map(Array.from(initialShares).map(([key, value]) => [key, value.toString()]))
    );
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

    for (const [key, value] of paymentShares) {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        parsedShares.set(key, parsedValue);
        totalAmount += parsedValue;
      }
    }

    // Validate total amount
    if (totalAmount === 0) {
      setFormError('Total payment amount cannot be zero');
      return;
    }

    onSave(paymentTitle, parsedShares);
    setPaymentTitle('');
    setPaymentShares(new Map());
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

  const calculateTotal = (): number => {
    let total = 0;
    for (const value of paymentShares.values()) {
      const amount = parseFloat(value);
      if (!isNaN(amount)) {
        total += amount;
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
      <h2 className="subtitle">Who paid for this?</h2>
      {team.map((member) => (
        <div key={member.name} className="field is-horizontal">
          <div className="field-label is-normal is-expanded">
            <label className="label is-size-5">{member.name}</label>
          </div>
          <div className="field-body is-narrow">
            <div className="field has-addons">
              <p className="control">
                <span className="button is-static is-small">$</span>
              </p>
              <p className="control" style={{width: "120px"}}>
                <input
                  className={`input is-small ${formError && formError.includes('amount') ? 'is-danger' : ''}`}
                  type="text"
                  placeholder="0.00"
                  min={0}
                  max={1000000}
                  value={paymentShares.get(member.name) || ''}
                  onChange={(e) => handleInputChange(member.name, e.target.value)}
                />
              </p>
            </div>
          </div>
        </div>
      ))}
      <div className="field is-horizontal mt-4 has-background-primary-light p-3">
        <div className="field-label is-normal is-expanded">
          <label className="label is-size-5 has-text-weight-bold">Total</label>
        </div>
        <div className="field-body is-narrow">
          <div className="field has-addons">
            <p className="control">
              <span className="has-text-weight-bold is-size-5">$</span>
              <span className="has-text-weight-bold is-size-4 has-text-primary">
                {calculateTotal().toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>
      {formError && (
        <p className="help is-danger mb-2">{formError}</p>
      )}
      <div className="buttons mt-4">
        <button className="button is-primary" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default PaymentDetailsScreen;
