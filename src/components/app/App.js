import React from 'react';
import PaymentsDetails from '../payments-details/paymentsDetails';
import {BrowserRouter, Switch} from 'react-router-dom';
import MainContent from '../main_content/mainContent'


import {Route} from 'react-router-dom';

import './app.css';


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [
          {name: 'Bohdan', id: 1, totalSpendings: 0, finalSpendings: 0},
          {name: 'Kate', id: 2, totalSpendings: 0, finalSpendings: 0},
          {name: 'Victor', id: 3, totalSpendings: 0, finalSpendings: 0},
          {name: 'Lara', id:4, totalSpendings: 0, finalSpendings: 0}
      ],
        spendings: [
            {title: "Taxi", amount: 100},
            {title: "Bar", amount: 110},
            {title: "Sport", amount: 10}
            ],

        sumOfGroupSpent : 0

    };

    this.onAdd = this.onAdd.bind(this);
    this.addItem = this.addItem.bind(this);
    this.getAmount = this.getAmount.bind(this);

  }

  onAdd(text) {
      const newUser = {
          name: text,
          totalSpendings: 0,
          groupSpengings: 0,
          finalSpendings: 0
      };

      this.setState({
          users: [...this.state.users, newUser]
      })
  }

  getAmount (amount) {
      let newItem = {
          title: this.state.spendings[this.state.spendings.length-1].title,
          amount: amount
      };
      let cleanedItem = this.state.spendings.slice(0, this.state.spendings.length-2);
      this.setState(({spendings}) => {
         let updatedSpendings = [...cleanedItem, newItem];
         return {
             spendings: updatedSpendings
         }
      })
  };


  addItem(title) {
      this.setState(({spendings}) => {
          let newSpendings = {
              title: title,
              amount: 0
          };
          let newArr = [...this.state.spendings, newSpendings];
          return {
              spendings: newArr
          }
      })

  }

  render() {
       return (
           <BrowserRouter>
               <div className="App">
                   <Switch>
                       <Route exact path="/"
                              render={(props) =>
                                  <MainContent {...props}
                                               onAdd={this.onAdd}
                                               users={this.state.users}
                                               spendings={this.state.spendings}
                                               addItem={this.addItem}
                                  />} />
                       <Route
                           path='/payments'
                       >
                           <PaymentsDetails
                               users={this.state.users}
                               getAmount={this.getAmount}
                           />
                       </Route>
                   </Switch>
               </div>
           </BrowserRouter>
       )
  }
};
