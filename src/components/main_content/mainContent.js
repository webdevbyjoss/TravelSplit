import React from 'react';
import Header from 'components/header/header';
import UsersBalance from 'components/userBalance/userBalance';
import Payments from 'components/payments/payments';
import './mainContent.css';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import * as actions from "actions";

const MainContent = ({users}) => {
    return (
        <div className='main_content'>
            <Header/>
            <UsersBalance
            />
            {users.length > 1 && <Payments
            />}
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

export default connect(mapStateToProps, mapDispatchToProps)(MainContent);