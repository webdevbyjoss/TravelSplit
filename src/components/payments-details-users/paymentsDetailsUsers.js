import React from 'react';


const PaymentsDetailsUsers = ({users}) => {

    function checked() {
        const div = document.querySelectorAll('.w-100');
        div.forEach((elem) => {
            const checkbox = elem.querySelector('.checkbox');
            const text = elem.querySelector('.textarea');
           if (checkbox.checked) {
               text.disabled = true;
           } else
               text.disabled = false;
        })
    }

    function Render () {
        return (
            users.map((item) => (
                <div className='payments_try' key={item.id} >
                    <div className='w-100'>
                        <input
                            className='checkbox'
                            type="checkbox"
                            name="sameadr"
                            onChange={checked}
                        />
                        {item.name}
                        <input
                            className='textarea'
                            type="text"
                            name="sameadr"
                        />
                </div>
                </div>
        ))
        )
    }

    return (
        <Render />
    );
};

export default PaymentsDetailsUsers;