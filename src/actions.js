export const ADD_USER = "ADD_USER";
export const REMOVE_USER = "REMOVE_USER";

export const ADD_SPENDINGS = "ADD_SPENDINGS";
export const REMOVE_SPENDINGS = "REMOVE_SPENDINGS";

export const ADD_USERS_TO_SPENDS = "ADD_USERS_TO_SPENDS";
export const UNDO_SPEND = "UNDO_SPEND";



export const addUser = text => ({ type: ADD_USER, text});
export const removeUser = name => ({ type: REMOVE_USER, name });
export const addSpendings = text => ({ type: ADD_SPENDINGS, text });
export const removeSpendings = title => ({ type: REMOVE_SPENDINGS, title });
export const addUsersToSpends = arr => ({type: ADD_USERS_TO_SPENDS, arr});
export const undoSpend = ({type: UNDO_SPEND});

