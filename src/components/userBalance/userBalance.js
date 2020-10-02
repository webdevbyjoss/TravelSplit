import React from 'react';


const UsersBalance = ({users}) => {

    return users.map((item) => (
        <ul>
        <li key={item.id} className='flex-row'>
                <div style={{float: 'left'}}> {item.name} </div>
                <div style={{float: 'right'}}> {item.finalSpendings} $</div>
        </li>
        </ul>
    ));
};

export default UsersBalance;