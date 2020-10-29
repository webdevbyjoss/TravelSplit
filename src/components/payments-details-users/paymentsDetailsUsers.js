import React from 'react';


const PaymentsDetailsUsers = ({users}) => {

    function checked() {
        const div = document.querySelectorAll('.w-100');
        div.forEach((elem) => {
            const checkbox = elem.querySelector('.checkbox');
            const text = elem.querySelector('.textarea');
           if (checkbox.checked) {
               text.disabled = true;
               text.value = 0;
           } else
               text.disabled = false;
        })
    }
    return (
        users.map((item) => (
            <div className='payments_try' key={item.name} >
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
                        type="number"
                        name="sameadr"
                        min='1'
                    />
                </div>
            </div>
        ))
    )
};

export default PaymentsDetailsUsers;