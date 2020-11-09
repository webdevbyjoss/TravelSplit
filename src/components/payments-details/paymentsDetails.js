import React from 'react';
import PaymentsDetailsUsers from 'components/payments-details-users/paymentsDetailsUsers'
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import * as actions from "actions";


const PaymentsDetails = ({users, undoSpend, addUsersToSpends}) => {

    function onSubmit() {
        let arrOfUsersSpends = [];
        let userDiv = document.querySelectorAll('.w-100');
        userDiv.forEach((item)=>{
            let objOfSpends = {};
            objOfSpends.name = item.innerText;
            objOfSpends.amount = item.lastChild.value;
            arrOfUsersSpends.push(objOfSpends)
        });

        console.log(arrOfUsersSpends);
        addUsersToSpends(arrOfUsersSpends);
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
                    <Link to='/'><button type='button' onClick={undoSpend}>Close</button></Link>
                </form>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsDetails);