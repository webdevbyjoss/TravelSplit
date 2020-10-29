import React from 'react';
import {connect} from "react-redux";
import * as actions from "../../actions";
import {bindActionCreators} from "redux";

import {countDebt} from '../../functions'

const UsersBalance = ({users, removeUser, spendings}) => {

    function Render () {
        return users.map((item) => (

            <li className='row' key={item.name} onClick={()=>removeUser(item.name)}>
                <i className="far fa-times-circle"></i>
                <div className='col' onClick={()=>console.log(users)}> {item.name} </div>
                <div className='col'>
                    <div className='float-right'>{countDebt(spendings, users, item.name)} $</div>
                </div>
            </li>
        ));
    }

    return (
        <ul>
            <Render />
        </ul>
    )
};

const mapStateToProps = (state) => {
    return {
        users: state.users,
        spendings: state.spendings
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersBalance);