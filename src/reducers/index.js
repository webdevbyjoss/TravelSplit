import { combineReducers } from 'redux'
import { usersReducer } from './users'
import { spendingsReducer } from './spendings'
import {persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ["users", "spendings"]
}

const rootReducer = combineReducers({
    users: usersReducer,
    spendings: spendingsReducer,
});

export default persistReducer(persistConfig, rootReducer);


