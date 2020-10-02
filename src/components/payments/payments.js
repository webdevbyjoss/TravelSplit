import React from 'react';
import PaymentsList from '../payments-list/paymentsList'
import { withRouter } from 'react-router-dom'

class PaymentsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title : '',
            amount: 0,
            isClicked: true
        }
        this.pressEnter = this.pressEnter.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    pressEnter (e) {
        const { history } = this.props;
        if (e.key === 'Enter') {

            if (this.state.title === '') {
                return;
            }
            e.preventDefault();
            this.props.addItem(this.state.title, this.state.amount);
            history.push('/payments')
            this.setState({
                title: ''
            })
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
                        />
                    </ul>
                </div>
            </div>
            )
    }
}

export default withRouter(PaymentsPage);