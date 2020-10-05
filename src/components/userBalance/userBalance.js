import React from 'react';
import './userBalance.css';


const UsersBalance = ({users, sumOfGroupSpent}) => {
    function f(a, b) {
        if (a === 0)
            return a;
        else
        return a - b;
    }
    return users.map((item) => (
        <ul>
        <li key={item.id} className='flex-row'>
                <div className='users_names'> {item.name} </div>
                <div className='users_spends'> {f(+item.totalSpendings, +sumOfGroupSpent/users.length)} $</div>
        </li>
        </ul>
    ));
};

export default UsersBalance;