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

  useEffect(() => {
    // Populate form when initial values change (e.g., when editing)
    setPaymentTitle(initialTitle);
    setPaymentShares(
      new Map(Array.from(initialShares).map(([key, value]) => [key, value.toString()]))
    );
  }, [initialTitle, initialShares]);

  const handleSave = () => {
    const parsedShares = new Map<string, number>();
    for (const [key, value] of paymentShares) {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        parsedShares.set(key, parsedValue);
      }
    }

    onSave(paymentTitle, parsedShares);
    setPaymentTitle('');
    setPaymentShares(new Map());
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

  return (
    <div>
      <div className="field">
        <label className="label">Payment Title</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Payment title"
            value={paymentTitle}
            onChange={(e) => setPaymentTitle(e.target.value)}
          />
        </div>
      </div>
      <h2 className="subtitle">Shares</h2>
      {team.map((member) => (
        <div key={member.name} className="field">
          <label className="label">{member.name}</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Amount"
              value={paymentShares.get(member.name) || ''}
              onChange={(e) => handleInputChange(member.name, e.target.value)}
            />
          </div>
        </div>
      ))}
      <div className="buttons mt-4">
        <button className="button is-primary" onClick={handleSave}>
          Save Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentDetailsScreen;
