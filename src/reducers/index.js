import { combineReducers } from 'redux'
import { usersReducer } from './users'
import { spendingsReducer } from './spendings'
import { sumOfGroupSpentReducer } from './sumOfGroupSpent'


const rootReducer = combineReducers({
    users: usersReducer,
    spendings: spendingsReducer,
    sumOfGroup: sumOfGroupSpentReducer
});

export default rootReducer;






/*const index = (state = initialState, action) => {
    switch (action.type) {
        case "INC" :
            return state + 1;
        case "DEC":
            return state - 1;
        case "RND":
            return state + action.value;
        default:
            return 0;
    }
};

export default index;*/