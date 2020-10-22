import React from 'react';
import PaymentsDetails from '../payments-details/paymentsDetails';
import {BrowserRouter, Switch} from 'react-router-dom';
import MainContent from '../main_content/mainContent'
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';
import './app.css';
import {bindActionCreators} from "redux";
import * as actions from "../../actions";



class App extends React.Component {
    constructor(props) {
        super(props);
    };

    componentDidUpdate() {
        this.props.UPDATE_USAGE_LS();
        this.props.UPDATE_SPENDING_LS();
    }

    componentWillMount() {
        this.props.USERS_WILL_MOUNT();
        this.props.SPENDINGS_WILL_MOUNT();
    }

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Switch>
                        <Route exact path="/"
                               render={(props) =>
                                   <MainContent {...props}
                                   />}
                        />
                        <Route
                            path='/payments'
                        >
                            <PaymentsDetails
                            />
                        </Route>
                    </Switch>
                </div>
            </BrowserRouter>
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

export default connect(mapStateToProps, mapDispatchToProps)(App)