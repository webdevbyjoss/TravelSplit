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
               {title: "Taxi", amount: 100, id: 1},
                {title: "Bar", amount: 110, id: 2},
                {title: "Sport", amount: 10, id: 3}
            ],

            sumOfGroupSpent : 0

        };

        this.onAdd = this.onAdd.bind(this);
        this.addItem = this.addItem.bind(this);
        this.getAmount = this.getAmount.bind(this);
        this.getObjOfSpendings = this.getObjOfSpendings.bind(this);
        this.countTotalSpendings = this.countTotalSpendings.bind(this);
        this.onRemoveUsers = this.onRemoveUsers.bind(this);
        this.onRemoveItems = this.onRemoveItems.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    async onAdd(text) {
        let id = 1;
        let newUser;
        if (this.state.users.length === 0) {
                newUser = {
                name: text,
                id: id,
                totalSpendings: 0,
                groupSpengings: 0,
                finalSpendings: 0
            };
        } else {
                newUser = {
                name: text,
                id: this.state.users[this.state.users.length-1].id + 1,
                totalSpendings: 0,
                groupSpengings: 0,
                finalSpendings: 0
            };
        }

        await this.setState({
            users: [...this.state.users, newUser]
        })

        await console.log(this.state.users);
    }

    getAmount (amount) {
        let newItem = {
            title: this.state.spendings[this.state.spendings.length-1].title,
            amount: amount
        };
        let cleanedItem = this.state.spendings.slice(0, this.state.spendings.length-1);
        this.setState(({spendings}) => {
            let updatedSpendings = [...cleanedItem, newItem];
            return {
                spendings: updatedSpendings
            }
        })
    };


    addItem(title) {
        let id = 1;
        let newSpendings;
        if (this.state.spendings.length === 0) {
            newSpendings = {
                title: title,
                amount: 0,
                id: id
            }
        } else {
                newSpendings = {
                    title: title,
                    amount: 0,
                    id: this.state.spendings[this.state.spendings.length - 1].id + 1
            }
        }
        this.setState(({spendings}) => {
            let newArr = [...this.state.spendings, newSpendings];
            return {
                spendings: newArr
            }
        })

    }

    getObjOfSpendings(arr){
        this.setState(({users}) => {
            return {
                users: arr
            }
        })
    }

    countTotalSpendings() {
        let totalGroupSpent = 0;
        this.state.users.forEach((item) => {
            totalGroupSpent += item.totalSpendings
        });
        this.setState(({sumOfGroupSpent})=> {
            return {
                sumOfGroupSpent: totalGroupSpent
            };
        });
        console.log(this.state.sumOfGroupSpent);
    }

    onRemoveUsers(name, id) {
        let confirm = window.confirm(`Do you really want to remove ${name}?`);
        if (confirm) {
            this.setState(({users})=> {
                const index = users.findIndex(elem => elem.id === id);
                const before = users.slice(0, index);
                const after = users.slice(index+1);
                const newArr = [...before, ...after];

                return {
                    users : newArr
                }
            });
        }
    }

    onRemoveItems(title, id) {
        let confirm = window.confirm(`Do you really want to remove ${title}?`);
        if (confirm) {
            this.setState(({spendings})=> {
                const index = spendings.findIndex(elem => elem.id === id);
                const before = spendings.slice(0, index);
                const after = spendings.slice(index+1);
                const newArr = [...before, ...after];

                return {
                    spendings : newArr
                }
            });
        }
    }

    onCancel () {
        this.setState(({spendings})=> {
            return {
                spendings: this.state.spendings.slice(0, this.state.spendings.length - 1)
            }
        });
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
                                                sumOfGroupSpent={this.state.sumOfGroupSpent}
                                                onRemoveUsers = {this.onRemoveUsers}
                                                onRemoveItems={this.onRemoveItems}
                                   />}
                        />
                        <Route
                            path='/payments'
                        >
                            <PaymentsDetails
                                users={this.state.users}
                                getAmount={this.getAmount}
                                getObjOfSpendings={this.getObjOfSpendings}
                                countTotalSpendings={this.countTotalSpendings}
                                onCancel={this.onCancel}
                            />
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
};