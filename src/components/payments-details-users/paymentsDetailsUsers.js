import React from 'react';


export default class PaymentsDetailsUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked : {},
            value:{}
        };
    }

    checked = (item)=>()=>{
        this.setState({
            checked : {...this.state.checked,[item.name]:!this.state.checked[item.name]}
        });
    };

    changeValue = (item)=>(event)=>{
        this.setState({
            value : {...this.state.value,[item.name]:event.target.value}
        });
    };

    render() {
        return (
            this.props.users.map((item) => (
                <div className='payments_try' key={item.name} onClick={()=>{console.log(this.props.props)}}>
                    <div className='w-100'>

                        <input
                            className='checkbox'
                            type="checkbox"
                            name={item.name}
                            value={!!this.state.checked[item.name]}
                            onChange={this.checked(item)}
                        />
                        {item.name}
                        <input
                            className='textarea'
                            type="number"
                            min='1'
                            disabled={this.state.checked[item.name]}
                            value={this.state.checked[item.name]?0:
                                this.state.value[item.name]?this.state.value[item.name]: ''}
                            onChange={this.changeValue(item)}
                            onClick={()=>console.log(this.state)}
                        />

                    </div>
                </div>
            ))
        )}
};