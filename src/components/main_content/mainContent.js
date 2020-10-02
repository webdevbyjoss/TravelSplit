import React from 'react';
import Header from '../header/header';
import UsersBalance from '../userBalance/userBalance';
import Payments from '../payments/payments';

const MainContent = ({onAdd, users, spendings, addItem}) => {
    return (
        <div className='main_content'>
            <Header onAdd={onAdd}/>
            <UsersBalance users={users}/>
            {users.length > 1 && <Payments users={users} spendings={spendings} addItem={addItem}/>}
        </div>
    )
};

export default MainContent;