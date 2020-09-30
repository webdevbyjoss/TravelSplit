import React from 'react';


export default class Header extends React.Component {
    constructor () {
        super()

        this.state = {
            text : ' '
        };

        this.pressEnter = this.pressEnter.bind(this);
        this.onChangeValue = this.onChangeValue.bind(this);
    }

    onChangeValue(e) {
        this.setState({
            text: e.target.value
        })}


   pressEnter (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.state.text === '') {
                return;
            }
            console.log(this.state.text);
            e.target.value = '';

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
                        onChange={this.onChangeValue}
                    />
                    </form>
                </div>
            </div>
        )
    }
}
