import React from 'react';
import {connect} from "react-redux";
import * as actions from "../../actions";
import {bindActionCreators} from "redux";

const UsersBalance = ({users, ON_REMOVE}) => {

    let sumOfGroupSpent = 0;
    users.forEach((item =>{
        sumOfGroupSpent += +item.totalSpendings
    }));

    function countDebt(a, b) {
        if (a === 0)
            return a;
        else
            return a - b;
    }

    function Render () {
        return users.map((item) => (

            <li className='row' key={item.id} onClick={()=>ON_REMOVE(item.id, item.name)}>
                <i className="far fa-times-circle"></i>
                <div className='col' onClick={()=>console.log(users)}> {item.name} </div>
                <div className='col'>
                    <div className='float-right'>{countDebt(+item.totalSpendings, +sumOfGroupSpent/users.length)} $</div>
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
        users: state.users
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersBalance);