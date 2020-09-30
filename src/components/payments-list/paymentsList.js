import React from 'react';

const PaymentsList = ({spendings}) => {
    return spendings.map((item) => (
        <li key={item.title} className='flex-row'>
            <div style={{float: 'left'}}> {item.title} </div>
            <div style={{float: 'right'}}> {item.amount} $</div>
        </li>
    ))
    };

export default PaymentsList;