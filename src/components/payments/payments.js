import React from 'react';
import PaymentsList from '../payments-list/paymentsList';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as actions from "../../actions";


class PaymentsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title : '',
        };
    }

    pressEnter = (e) => {
        const { history } = this.props;
        if (e.key === 'Enter') {

            if (this.state.title === '') {
                return;
            }
            e.preventDefault();

            this.props.addSpendings(this.state.title);

            history.push('/payments');
            this.setState({
                title: ''
            });
            e.target.value = '';
        } else
            return
    };

    onChangeValue =(e)=> {
        this.setState({
            title: e.target.value
        })
    };

    render() {
        return (
            <div>
                <h2 style={{fontWeight: 'bold'}}>Group Payments</h2>
                <form onKeyPress={this.pressEnter}>
                    <input
                        className="form-control input-lg"
                        type="text"
                        placeholder='Pizza, taxi, beer...'
                        onChange={this.onChangeValue}
                    />
                </form>

                <div>
                    <ul>
                        <PaymentsList
                            spendings={this.props.spendings}
                        />
                    </ul>
                </div>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PaymentsPage));