import React from 'react';
import Header from '../header/header';
import Users from '../users/users';
import Payments from '../payments/payments'


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [
          {name: 'Bohdan', totalSpendings: 0, groupSpengings: 0, finalSpendings: 0},
          {name: 'Kate', totalSpendings: 0, groupSpengings: 0, finalSpendings: 0},
          {name: 'Victor', totalSpendings: 0, groupSpengings: 0, finalSpendings: 0},
          {name: 'Lara', totalSpendings: 0, groupSpengings: 0, finalSpendings: 0},
      ],
        spendings: [
            {title: "Taxi", amount: 100},
            {title: "Bar", amount: 110},
            {title: "Sport", amount: 10}
            ]
    };

    this.onAdd = this.onAdd.bind(this);
  }

  onAdd(text) {
      const newUser = {
          name: text,
          totalSpendings: 0,
          groupSpengings: 0,
          finalSpendings: 0
      };

      this.setState(({users}) => {
          let newArr = [...users, newUser];
          return {
              users: newArr
          }
      })
  }

  render() {
    return (
        <div className="App">
          <Header />
          <Users users={this.state.users} />
          <Payments
              users={this.state.users}
              spendings={this.state.spendings}
              onAdd={this.onAdd}
          />
        </div>
    )
  }
};
