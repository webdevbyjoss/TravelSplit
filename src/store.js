import {createStore} from 'redux';
import rootReducer from 'reducers/index';
import {persistStore} from "redux-persist";


export const store = createStore(rootReducer);
export const persistor = persistStore(store);




/*{
    spendings: [
        {
            title: "Taxi",
            users: [
                {
                    name: "John",
                    amount: "15"
                },
                {
                    name: "Marta",
                    amount: "50"
                }
            ]
        }
    ],

        users: [
    "John",
    "Marta"
]
}*/