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
            users: [],
            spendings: [],
            sumOfGroupSpent : 0,
        }
    }

    onAdd =(text) => {
        let newUser;
        if (this.state.users.length === 0) {
            newUser = {
                name: text,
                id: 0,
                totalSpendings: 0,
                groupSpengings: 0,
                userDebt: 0
            };
        } else {
            newUser = {
                name: text,
                id: this.state.users[this.state.users.length-1].id + 1,
                totalSpendings: 0,
                groupSpengings: 0,
                userDebt: 0
            };
        }
        this.setState({
            users: [...this.state.users, newUser]
        });
    };

    addItem =(title) => {
        let newSpendings;
        if (this.state.spendings.length === 0) {
            newSpendings = {
                title: title,
                amount: 0,
                id: 0
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

    };

    updateStateOfUsers = (arr) => {
        this.setState(({users}) => {
            return {
                users: arr
            }
        });
    };

    onRemoveUser = (name, id) => {
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

    onRemoveItem =(title, id) => {
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

    onCancel = () => {
        this.setState(({spendings})=> {
            return {
                spendings: this.state.spendings.slice(0, this.state.spendings.length - 1)
            }
        });
    }

    getArrOfUsersSpends = (arr, amount) => {
        let newArr = [];
        let lastSpendItem = this.state.spendings.pop();
        lastSpendItem.users = arr;
        lastSpendItem.amount = amount;
        newArr = [...this.state.spendings];
        newArr.push(lastSpendItem);
        this.setState(({spendings})=>{
            return {spendings: newArr}
        });
    };

    countTotalSpendings = () => {
        let totalGroupSpent = 0;
        this.state.spendings.forEach((item) => {
            totalGroupSpent += item.amount
        });
        this.setState({
            sumOfGroupSpent: totalGroupSpent
        });
    }

    componentWillMount() {
        let users = localStorage.getItem('users');
        if (users) {
            this.setState({
                users: JSON.parse(localStorage.getItem('users')),
                spendings: JSON.parse(localStorage.getItem('spendings'))
            });
        }
    }

    componentDidUpdate() {
        localStorage.setItem('users', JSON.stringify(this.state.users));
        localStorage.setItem('spendings', JSON.stringify(this.state.spendings));
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
                                                onRemoveUser = {this.onRemoveUser}
                                                onRemoveItem={this.onRemoveItem}
                                   />}
                        />
                        <Route
                            path='/payments'
                        >
                            <PaymentsDetails
                                users={this.state.users}
                                updateStateOfUsers={this.updateStateOfUsers}
                                countTotalSpendings={this.countTotalSpendings}
                                onCancel={this.onCancel}
                                spendings={this.state.spendings}
                                getArrOfUsersSpends={this.getArrOfUsersSpends}
                                countUserDebt={this.countUserDebt}
                                sumOfGroupSpent={this.state.sumOfGroupSpent}
                            />
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
};