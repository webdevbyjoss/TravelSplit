export const inc = () => ({ type: "INC" });
export const dec = () => ({type:"DEC"});
export const rnd = () => {
    return {type : "RND",
            value: Math.floor(Math.random() * 10)}
};

//users
export const ON_ADD = (text) => ({type: "ON_ADD", text});
export const ON_REMOVE = (id, user) => ({type: "ON_REMOVE", id, user});
export const UPDATE_STATE_OF_USERS = (arr) => ({type: "UPDATE_STATE_OF_USERS", arr});
export const UPDATE_USAGE_LS = () => ({type: 'UPDATE_USAGE_LS'});
export const USERS_WILL_MOUNT = () => ({type: "USERS_WILL_MOUNT"});

//listOfspendings
export const ON_ADD_SPENDINGS = (text) => ({type: "ON_ADD_SPENDINGS", text});
export const ON_REMOVE_SPENDINGS = (title, id) => ({type: "ON_REMOVE_SPENDINGS", title, id});
export const UPDATE_SPENDING_LS = () => ({type: "UPDATE_SPENDING_LS"});
export const SPENDINGS_WILL_MOUNT = () => ({type: "SPENDINGS_WILL_MOUNT"});


//spendings
export const GET_ARR_OF_USERS_SPENDS =(arr, amount) => ({type: "GET_ARR_OF_USERS_SPENDS", arr, amount});
export const ON_CANCEL = () => ({type: "ON_CANCEL"});
export const COUNT_TOTAL_SPENDINGS = () => ({type: "COUNT_TOTAL_SPENDINGS"});