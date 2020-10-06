import React from 'react';
import PaymentsDetailsUsers from '../payments-details-users/paymentsDetailsUsers'
import {Link} from 'react-router-dom';

const PaymentsDetails = ({users, getAmount, getObjOfSpendings, countTotalSpendings, onCancel}) => {

    async function  onSubmit() {
        let spentSum = 0;
        let arr = [];
        let inputs = document.querySelectorAll('.textarea');
        let div = document.querySelectorAll('.payments_try');
        await div.forEach((item)=>{
            let newObj = {};
            users.forEach((user) => {
                if (user.name === item.innerText) {
                    newObj.name = user.name;
                    newObj.id = user.id;
                    newObj.totalSpendings = +user.totalSpendings + +item.querySelector('.textarea').value;
                    newObj.finalSpendings = users.finalSpendings;
                    arr.push(newObj);
                }
            })
        });

        await inputs.forEach((item) => {
            spentSum += +item.value;
        });

        await getObjOfSpendings(arr);
        await getAmount(spentSum);
        await countTotalSpendings();
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
                    <Link to='/'><button type='button' onClick={onCancel}>Close</button></Link>
                </form>
            </div>
        </div>
    )
};

export default PaymentsDetails;