import React from 'react';
import SingleUser from '../singleUser/singleUser';

const Users = ({users}) => {
    return (
        <ul>
            <SingleUser users={users} />
        </ul>
    )
};

export default Users;