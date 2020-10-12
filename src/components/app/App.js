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
        ;

        this.onAdd = this.onAdd.bind(this);
        this.addItem = this.addItem.bind(this);
        this.getObjOfSpendings = this.getObjOfSpendings.bind(this);
        this.countTotalSpendings = this.countTotalSpendings.bind(this);
        this.onRemoveUsers = this.onRemoveUsers.bind(this);
        this.onRemoveItems = this.onRemoveItems.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.getArrOfUsersSpends = this.getArrOfUsersSpends.bind(this);
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
        });
    }

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
        });
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

    getArrOfUsersSpends(arr, amount) {
        let newArr = [];
        let lastSpendItem = this.state.spendings.pop();
        lastSpendItem.users = arr;
        lastSpendItem.amount = amount;
        newArr = [...this.state.spendings];
        newArr.push(lastSpendItem);
        this.setState(({spendings})=>{
            return {spendings: newArr}
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
                                                onRemoveUsers = {this.onRemoveUsers}
                                                onRemoveItems={this.onRemoveItems}
                                   />}
                        />
                        <Route
                            path='/payments'
                        >
                            <PaymentsDetails
                                users={this.state.users}
                                getObjOfSpendings={this.getObjOfSpendings}
                                countTotalSpendings={this.countTotalSpendings}
                                onCancel={this.onCancel}
                                spendings={this.state.spendings}
                                getArrOfUsersSpends={this.getArrOfUsersSpends}
                            />
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
};