import React from 'react';

const PaymentsList = ({spendings, onRemoveItems}) => {
    return spendings.map((item) => (
        <li className="row" key={item.title} onClick={(e)=>onRemoveItems(item.title, item.id)}>
            <i className="far fa-times-circle"></i>
            <div className='col'> {item.title} </div>
            <div className='col'>
                <div className='float-right'>{item.amount} $</div>
            </div>
        </li>
    ))
    };

export default PaymentsList;




