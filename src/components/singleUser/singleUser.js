import React from 'react';


const SingleUser = ({users}) => {

    return users.map((item) => (
        <li key={item.name} className='flex-row'>
                <div style={{float: 'left'}}> {item.name} </div>
                <div style={{float: 'right'}}> {item.finalSpendings} $</div>
        </li>
    ));
};

export default SingleUser;