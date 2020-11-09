import React from 'react';
import {connect} from "react-redux";
import * as actions from "actions";
import {bindActionCreators} from "redux";

import {countDebt} from 'functions'

const UsersBalance = ({users, removeUser, spendings}) => {

        const renderUser = item => <li className='row' key={item.name} onClick={()=>{if (window.confirm(`Do you really want to remove ${item.name}?`)) {
            removeUser(item.name);
        }}}>
            <i className="far fa-times-circle"></i>
            <div className='col'> {item.name} </div>
            <div className='col'>
                <div className='float-right'>{countDebt(spendings, users, item.name)} $</div>
            </div>
        </li>

        return <ul>{users.map(renderUser)}</ul>
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