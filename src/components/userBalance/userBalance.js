import React from 'react';

const UsersBalance = ({users, sumOfGroupSpent, onRemoveUsers}) => {
    function f(a, b) {
        if (a === 0)
            return a;
        else
            return a - b;
    }

    function Render () {
        return users.map((item) => (
                <li className='row' key={item.id} onClick={(e)=>onRemoveUsers(item.name, item.id)}>
                    <i className="far fa-times-circle"></i>
                    <div className='col'> {item.name} </div>
                    <div className='col'>
                        <div className='float-right'>{f(+item.totalSpendings, +sumOfGroupSpent/users.length)} $</div>
                    </div>
                </li>
        ));
    }


    return (
        <ul>
        <Render />
        </ul>
    )
};

export default UsersBalance;