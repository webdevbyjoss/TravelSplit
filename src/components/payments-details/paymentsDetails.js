import React from 'react';
import PaymentsDetailsUsers from '../payments-details-users/paymentsDetailsUsers'
import {Link} from 'react-router-dom';

const PaymentsDetails = ({users, getAmount}) => {

    function  onSubmit() {
        let spentSum = 0;
        let inputs = document.querySelectorAll('.amount_spent');
        inputs.forEach((item) => {
            spentSum += +item.value;
        });
        /*users.map((item)=>{
            obj.id = item.id
        });*/
        getAmount(spentSum);
    }

    return (
        <div className='payments_details'>
            <header className='navbar bg-dark text-center'>
                <h3 className=''> Who paid the bill? </h3>
            </header>
            <div className='payments_details_content'>
                <p>Enter amount of money that were spend on this bill in appropriate field to the right</p>
                <form>

                    <PaymentsDetailsUsers users={users}/>

                    <Link to='/'><button type='button' onClick={onSubmit}>Ok</button></Link>
                    <button type='button'>Close</button>
                </form>
            </div>
        </div>
    )
};

export default PaymentsDetails;