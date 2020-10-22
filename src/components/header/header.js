import React from 'react';
import {connect} from "react-redux";
import * as actions from '../../actions';
import { bindActionCreators} from 'redux';


class Header extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            text : ' '
        };
    }

    onChange = e => {
        this.setState({
            text: e.target.value
        })}


    pressEnter = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.state.text === '') {
                return;
            }

            this.props.ON_ADD(this.state.text);

            e.target.value = '';
            this.setState({
                text: ''
            })

        } else
            return
    }

    render () {
        return (
            <div className='header'>
                <h2>People</h2>
                <div className="form-group">
                    <form onKeyPress={this.pressEnter} >
                        <input
                            className="form-control input-lg"
                            type="text"
                            placeholder='John, Lisa or any other name...'
                            onChange={this.onChange}
                        />
                    </form>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(null, mapDispatchToProps)(Header);