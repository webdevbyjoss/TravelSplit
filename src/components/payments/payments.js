import React from 'react';
import PaymentsList from '../payments-list/paymentsList'

const PaymentsPage = ({users, spendings}) => {
    let style = '';

    if (users.length <= 1) {
        style += 'none'
    } else {
        style += 'block'
    }

    return (
        <div style={{display: `${style}`}}>
            <h2 style={{fontWeight: 'bold'}}>Group Payments</h2>
                <input
                className="form-control input-lg"
                type="text"
                placeholder='Piza, taxi, beer...'
            />
            <div>
                <ul>
                    <PaymentsList
                        spendings={spendings}
                        />
                </ul>
            </div>
        </div>
    )
};

export default PaymentsPage;