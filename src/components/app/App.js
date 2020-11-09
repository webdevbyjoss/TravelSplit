import React from 'react';
import PaymentsDetails from 'components/payments-details/paymentsDetails';
import {BrowserRouter, Switch} from 'react-router-dom';
import MainContent from 'components/main_content/mainContent'
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';
import './app.css';

function App () {
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
};

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
};

export default connect(mapStateToProps)(App)