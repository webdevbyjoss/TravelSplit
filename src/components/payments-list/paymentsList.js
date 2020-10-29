import React from 'react';
import './paymentsList.css';

import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import * as actions from "../../actions";

import {countAmountSpent} from '../../functions';

class PaymentsList extends React.Component {

    render() {
        return this.props.spendings.map((item) => (
            <li className="row" key={item.title} onClick={(e)=>this.props.removeSpendings(item.title)}>
                <div><i className="far fa-times-circle close_item"></i></div>
                <div className='col'>
                    <div className='row'>
                        <div className='spendings_title'>{item.title}</div>
                        <div className='spendings_user'>
                            <span>{item.users.map(user => <span key={user.name}>{user.amount>0 ? user.name : ''} {`${user.amount>0 ? user.amount + `$` : ``}`} </span>)}</span>
                        </div>
                    </div>
                </div>
                <div className='col'>
                    <div className='float-right'>{countAmountSpent(item.users)} $</div>
                </div>
            </li>
        ))
    }
};

const mapStateToProps = (state) => {
    return {
        spendings: state.spendings
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsList)




