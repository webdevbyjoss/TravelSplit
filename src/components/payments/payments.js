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
        this.pressEnter  = this.pressEnter.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    pressEnter (e) {
        const { history } = this.props;
        if (e.key === 'Enter') {

            if (this.state.title === '') {
                return;
            }
            e.preventDefault();

            this.props.ON_ADD_SPENDINGS(this.state.title);

            history.push('/payments');
            this.setState({
                title: ''
            });
            e.target.value = '';
        } else
            return
    }

    onChangeValue(e) {
        this.setState({
            title: e.target.value
        })
    }

    render() {
        return (
            <div>
                <h2 style={{fontWeight: 'bold'}}>Group Payments</h2>
                <form onKeyPress={this.pressEnter}>
                    <input
                        className="form-control input-lg"
                        type="text"
                        placeholder='Piza, taxi, beer...'
                        onChange={this.onChangeValue}
                    />
                </form>

                <div>
                    <ul>
                        <PaymentsList
                            spendings={this.props.spendings}
                            onRemoveItem={this.props.onRemoveItem}
                            getArrOfUsersSpends={this.props.getArrOfUsersSpends}
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