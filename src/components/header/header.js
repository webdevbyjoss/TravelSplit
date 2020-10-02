import React from 'react';


export default class Header extends React.Component {
    constructor () {
        super()

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
            this.props.onAdd(this.state.text);
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
