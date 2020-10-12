import React from 'react';
import Header from '../header/header';
import UsersBalance from '../userBalance/userBalance';
import Payments from '../payments/payments';
import './mainContent.css';

const MainContent = ({onAdd, users, spendings, addItem, sumOfGroupSpent,onRemoveUsers, onRemoveItems}) => {
    return (
        <div className='main_content'>
            <Header onAdd={onAdd} />
            <UsersBalance users={users}
                          sumOfGroupSpent={sumOfGroupSpent}
                          onRemoveUsers={onRemoveUsers}
            />
            {users.length > 1 && <Payments
                users={users}
                spendings={spendings}
                addItem={addItem}
                onRemoveItems={onRemoveItems}
            />}
        </div>
    )
};

export default MainContent;