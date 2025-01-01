import { calculateExpenses, TripExpenses, Payment } from '../domain/Expenses';

describe('calculateExpenses', () => {
  it('should return correct shares when payments are evenly distributed', () => {
    const expenses = {
      id: 1,
      title: 'Trip',
      team: [
        { name: 'John' },
        { name: 'Alex' },
        { name: 'Ann' },
        { name: 'Mark' },
      ],
      payments: [
        {
          id: 1,
          title: 'Hotel',
          shares: new Map([
            ['John', 100],
            ['Alex', 100],
            ['Ann', 100],
            ['Mark', 100],
          ]),
        },
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['John', 0],
      ['Alex', 0],
      ['Ann', 0],
      ['Mark', 0],
    ]);

    expect(result).toEqual(expected);
  });

  it('should return correct shares when some people did not pay', () => {
    const expenses = {
      id: 1,
      title: 'Dinner',
      team: [
        { name: 'John' },
        { name: 'Alex' },
        { name: 'Ann' },
        { name: 'Mark' },
      ],
      payments: [
        {
          id: 1,
          title: 'Dinner Payment',
          shares: new Map([
            ['John', 100],
            ['Alex', 20],
            ['Ann', 0],
            ['Mark', 0],
          ]),
        },
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['John', 70],  // John should receive 70 as he already paid 100 for the whole group
      ['Alex', -10],   // Alex should give 10 as he already paid 20
      ['Ann', -30],    // Ann should give 30
      ['Mark', -30],   // Mark should give 30
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle multiple payments correctly', () => {
    const expenses = {
      id: 1,
      title: 'Vacation',
      team: [
        { name: 'John' },
        { name: 'Alex' },
        { name: 'Ann' },
        { name: 'Mark' },
      ],
      payments: [
        {
          id: 1,
          title: 'Hotel',
          shares: new Map([
            ['John', 120],
            ['Alex', 80],
            ['Ann', 0],
            ['Mark', 0],
          ]), // 50 each
        },
        {
          id: 2,
          title: 'Food',
          shares: new Map([
            ['John', 0],
            ['Alex', 40],
            ['Ann', 40],
            ['Mark', 0],
          ]), // 20 each
        },
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['John', 50],   // John should receive 50
      ['Alex', 50],  // Alex should receive 50
      ['Ann', -30],   // Ann owes 30
      ['Mark', -70],  // Mark owes 70
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle no payments gracefully', () => {
    const expenses = {
      id: 1,
      title: 'No Payments',
      team: [
        { name: 'John' },
        { name: 'Alex' },
        { name: 'Ann' },
        { name: 'Mark' },
      ],
      payments: [],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['John', 0],
      ['Alex', 0],
      ['Ann', 0],
      ['Mark', 0],
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle multiple payments with uneven contributions', () => {
    const expenses: TripExpenses = {
      id: 1,
      title: 'Group Event',
      team: [
        { name: 'Ann' },
        { name: 'John' },
        { name: 'Mark' },
        { name: 'Alex' },
      ],
      payments: [
        { id: 1, title: 'Payment 1', shares: new Map([['Ann', 40], ['John', 0], ['Mark', 0], ['Alex', 0]]) },
        { id: 2, title: 'Payment 2', shares: new Map([['John', 700]]) },
        { id: 3, title: 'Payment 3', shares: new Map([['Mark', 0], ['Ann', 100]]) },
        { id: 4, title: 'Payment 4', shares: new Map([['Alex', 450]]) },
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['Ann', 80],
      ['John', -10],
      ['Mark', -60],
      ['Alex', -10],
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle uneven splits with a small group', () => {
    const expenses: TripExpenses = {
      id: 1,
      title: 'Small Group',
      team: [
        { name: 'Mark' },
        { name: 'John' },
        { name: 'Ann' },
      ],
      payments: [
        { id: 1, title: 'Dinner', shares: new Map([['Mark', 20], ['John', 50], ['Ann', 0]]) },
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['Mark', -3.333333333333332],
      ['John', 26.666666666666668],
      ['Ann', -23.333333333333332],
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle single payment with zero contributions', () => {
    const expenses: TripExpenses = {
      id: 1,
      title: 'Single Payment',
      team: [
        { name: 'John' },
        { name: 'Ann' },
        { name: 'Mark' },
      ],
      payments: [
        { id: 1, title: 'Lunch', shares: new Map([['John', 30], ['Ann', 0], ['Mark', 0]]) },
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['John', 20],
      ['Ann', -10],
      ['Mark', -10],
    ]);

    expect(result).toEqual(expected);
  });

  it('should recognize zero-value payments and calculate totals correctly', () => {
    const expenses: TripExpenses = {
      id: 1,
      title: 'Zero-Value Test',
      team: [
        { name: 'Ann' },
        { name: 'John' },
        { name: 'Mark' },
        { name: 'Alex' },
      ],
      payments: [
        { id: 1, title: 'Payment 1', shares: new Map([['Ann', 40], ['John', 0], ['Mark', 0], ['Alex', 0]]) },
        { id: 2, title: 'Payment 2', shares: new Map([['John', 700], ['Ann', 0], ['Mark', 0], ['Alex', 0]]) },
        { id: 3, title: 'Payment 3', shares: new Map([['Mark', 50], ['Ann', 50], ['John', 0], ['Alex', 0]]) },
        { id: 4, title: 'Payment 4', shares: new Map([['Alex', 450], ['Ann', 0], ['Mark', 0], ['John', 0]]) },
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['Alex', 127.5],
      ['Ann', -232.5],
      ['John', 377.5],
      ['Mark', -272.5],
    ]);

    expect(result).toEqual(expected);
  });

  it('should calculate aggregated totals across groups', () => {
    const expenses: TripExpenses = {
      id: 1,
      title: 'Mixed Groups',
      team: [
        { name: 'Ann' },
        { name: 'John' },
        { name: 'Mark' },
        { name: 'Alex' },
      ],
      payments: [
        { id: 1, title: 'Group 1 - Payment 1', shares: new Map([['Ann', 40], ['John', 0], ['Mark', 0], ['Alex', 0]]) }, // 10 each
        { id: 2, title: 'Group 1 - Payment 2', shares: new Map([['John', 800], ['Ann', 0], ['Mark', 0], ['Alex', 0]]) }, // 200 each
        { id: 3, title: 'Group 1 - Payment 3', shares: new Map([['Mark', 50], ['Ann', 50], ['John', 0], ['Alex', 0]]) }, // 25 each
        { id: 4, title: 'Group 1 - Payment 4', shares: new Map([['Alex', 400], ['Ann', 0], ['Mark', 0], ['John', 0]]) }, // 100 each
        { id: 5, title: 'Group 2 - Payment 1', shares: new Map([['Mark', 10], ['John', 50], ['Ann', 0]]) }, // 20 each
        { id: 6, title: 'Group 2 - Payment 2', shares: new Map([['Mark', 0], ['John', 30], ['Ann', 0]]) }, // 10 each
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['Ann', -275], // Ann has 30 - 200 + 25 - 100 - 20 - 10
      ['John', 515], // John has -10 + 600 - 25 - 100 + 30 + 20
      ['Mark', -305], // Mark has -10 - 200 + 25 - 100 - 10 - 10
      ['Alex', 65], // paid 400 and takes back 65
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle a single member team', () => {
    const expenses: TripExpenses = {
      id: 1,
      title: 'Solo Trip',
      team: [{ name: 'John' }],
      payments: [{ id: 1, title: 'Solo Payment', shares: new Map([['John', 100]]) }],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([['John', 0]]); // No one to share with

    expect(result).toEqual(expected);
  });

  it('should handle negative payment values gracefully', () => {
    const expenses: TripExpenses = {
      id: 1,
      title: 'Refund Event',
      team: [
        { name: 'John' },
        { name: 'Ann' },
        { name: 'Mark' },
        { name: 'Joseph' },
      ],
      payments: [
        { id: 1, title: 'Adjustment', shares: new Map([['John', -40], ['Ann', 0], ['Mark', 0], ['Joseph', 0]]) },
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['John', -30],  // John to give back 10 to each person
      ['Ann', 10],
      ['Mark', 10],
      ['Joseph', 10],
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle equal payments by all members', () => {
    const expenses: TripExpenses = {
      id: 1,
      title: 'Even Contribution',
      team: [
        { name: 'John' },
        { name: 'Ann' },
        { name: 'Mark' },
      ],
      payments: [
        { id: 1, title: 'Shared Payment', shares: new Map([['John', 100], ['Ann', 100], ['Mark', 100]]) },
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['John', 0],
      ['Ann', 0],
      ['Mark', 0],
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle a large group with multiple payments', () => {
    const team = Array.from({ length: 20 }, (_, i) => ({ name: `Person${i + 1}` }));
    const payments: Payment[] = [
      { id: 1, title: 'Payment 1', shares: new Map(team.map(person => [person.name, 10])) }, // Everyone pays equally
      { id: 2, title: 'Payment 2', shares: new Map(team.map(person => [person.name, (person.name === 'Person1') ? 200 : 0])) }, // One person pays a lot
    ];

    const expenses: TripExpenses = { id: 1, title: 'Large Group', team, payments };

    const result = calculateExpenses(expenses);

    const expected = new Map(
      team.map(person => {
        const sharePerPerson = 200 / 20; // Total 200 divided by 20 people
        return person.name === 'Person1'
          ? [person.name, 200 - sharePerPerson]
          : [person.name, -sharePerPerson];
      })
    );

    expect(result).toEqual(expected);
  });

  it('should handle multiple zero payments', () => {
    const expenses: TripExpenses = {
      id: 1,
      title: 'No Contributions',
      team: [
        { name: 'John' },
        { name: 'Ann' },
        { name: 'Mark' },
      ],
      payments: [
        { id: 1, title: 'No Payment 1', shares: new Map([['John', 0], ['Ann', 0], ['Mark', 0]]) },
        { id: 1, title: 'No Payment 2', shares: new Map([['John', 0], ['Ann', 0], ['Mark', 0]]) },
      ],
    };

    const result = calculateExpenses(expenses);

    const expected = new Map([
      ['John', 0],
      ['Ann', 0],
      ['Mark', 0],
    ]);

    expect(result).toEqual(expected);
  });

  it('should handle floating-point precision correctly', () => {
    const expenses: TripExpenses = {
      id: 1,
      title: 'Precision Test',
      team: [
        { name: 'John' },
        { name: 'Ann' },
        { name: 'Mark' },
      ],
      payments: [
        { id: 1, title: 'Shared Cost', shares: new Map([['John', 10.123], ['Ann', 20.456], ['Mark', 30.789]]) },
      ],
    };

    const result = calculateExpenses(expenses);

    const totalCost = 10.123 + 20.456 + 30.789;
    const sharePerPerson = totalCost / 3;

    const expected = new Map([
      ['John', 10.123 - sharePerPerson],
      ['Ann', 20.456 - sharePerPerson],
      ['Mark', 30.789 - sharePerPerson],
    ]);

    expect(result).toEqual(expected);
  });
});
