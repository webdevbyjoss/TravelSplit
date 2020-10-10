import React from 'react';
import PaymentsDetailsUsers from '../payments-details-users/paymentsDetailsUsers'
import {Link} from 'react-router-dom';


const PaymentsDetails = ({users, getObjOfSpendings, countTotalSpendings, onCancel, getArrOfUsersSpends, spendings}) => {

        function  onSubmit() {
        let spentSum = 0;
        let arr = [];
        let arrOfUsersSpends = [];
        let inputs = document.querySelectorAll('.textarea');
        let div = document.querySelectorAll('.payments_try');
        let userDiv = document.querySelectorAll('.w-100');
        div.forEach((item)=>{
            let newObj = {};
             users.forEach((user) => {
                if (user.name === item.innerText) {
                    newObj.name = user.name;
                    newObj.id = user.id;
                    newObj.lastSpendingsAmount = +item.querySelector('.textarea').value;
                    newObj.totalSpendings = user.totalSpendings + +item.querySelector('.textarea').value;
                    newObj.finalSpendings = users.finalSpendings;
                    arr.push(newObj);
                }
            })
        });

        inputs.forEach((item) => {
            spentSum += +item.value;
        });

            function getRandomBetween(min, max) {
                return Math.random() * (max - min) + min;
            }

        userDiv.forEach((item)=>{
            let objOfSpends = {};
            objOfSpends.name = item.innerText;
            objOfSpends.id = getRandomBetween(1, 500)
            objOfSpends.amount = item.lastChild.value;
            arrOfUsersSpends.push(objOfSpends)
        });
        getArrOfUsersSpends(arrOfUsersSpends, spentSum);

    /*    userDiv.forEach((item)=>{
                let objOfSpends = {};
                objOfSpends.name = item.innerText;
                objOfSpends.amount = item.lastChild.value;
                arrOfUsersSpends.push(objOfSpends)
        });*/

        getObjOfSpendings(arr);

        countTotalSpendings();
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