/**
 * Payment shares object
 * Contains information about how much each person contributed to the payment
 *
 * note that all team members participating in this spending should be mentioned
 *
 * For example, if John paid 100, Alex paid 20, Ann and Mark didn't pay anything but participated in the spending and
 * will return money to John and Alex, the payment shares object will look like this:
 *
 * {'John': 100, 'Alex': 20, 'Ann':0, 'Mark': 0}
 */
export type PaymentShares = Map<string, number>;

export type Payment = {
  title: string,
  shares: PaymentShares
}

export type Person = {
  name: string
  amount?: number
}

export type Expenses = {
  title: string,
  team: Person[],
  payments: Payment[]
}

/**
 * Calculate the total amount paid by each person in the team
 * @param payments
 */
export function calculateExpenses(payments: Expenses): PaymentShares {
  const total: PaymentShares = new Map();
  payments.team.forEach(person => total.set(person.name, person.amount || 0));

  // Calculate the total amount paid and adjust individual balances
  payments.payments.map(payment => paymentToShares(payment)).forEach(shares => {
    Array.from(shares.keys()).forEach(personName => {
      const totalAmount = shares.get(personName) || 0;
      const currentAmount = total.get(personName) || 0;
      total.set(personName, totalAmount + currentAmount);
    })
  });

  return total;
}

/**
 * Calculate the balance for each person in the payment
 * The balance is calculated as the amount they paid minus their share of the total payment
 * @param payment
 */
export function paymentToShares(payment: Payment): PaymentShares {
  const shares: PaymentShares = new Map();
  const totalPayment = Array.from(payment.shares.values()).reduce((a, b) => a + b, 0);
  const sharePerPerson = totalPayment / payment.shares.size;

  Array.from(payment.shares.keys()).forEach(personName => {
    const paidAmount = payment.shares.get(personName) || 0;
    // Update balance: add what they paid and subtract their share
    shares.set(personName,  paidAmount - sharePerPerson);
  });

  return shares
}
