import React from 'react';
import './paymentsList.css';

const PaymentsList = ({onRemoveItems, spendings}) => {

    return spendings.map((item) => (
        <li className="row" key={item.title} onClick={(e)=>onRemoveItems(item.title, item.id)}>
            <div><i className="far fa-times-circle close_item"></i></div>
            <div className='col'>
                <div className='row'>
                    <div className='spendings_title'>{item.title}</div>
                    <div className='spendings_user'>
                        <span>{item.users.map(user => <span key={user.id}>{user.name} {user.amount}$ </span>)}</span>
                    </div>
                </div>
            </div>
            <div className='col'>
                <div className='float-right'>{item.amount} $</div>
            </div>
        </li>
    ))
    };

export default PaymentsList;




