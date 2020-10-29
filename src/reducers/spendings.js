import {confirm} from '../functions';


export function spendingsReducer(state = [], action) {
    switch (action.type) {

        case "ADD_SPENDINGS":
            let newSpendings = {
                    title: action.text
                };
                return [
                ...state,
                newSpendings
            ];

        case "REMOVE_SPENDINGS":
            if (confirm(action.title)) {
                let newArr = state.filter(item => item.title !== action.title);
                    return [...newArr];
            }
            return state;

        case "ADD_USERS_TO_SPENDS":
            let newArr = [];
            let lastSpendItem = state.pop();
            lastSpendItem.users = action.arr;
            newArr = [...state];
            newArr.push(lastSpendItem);
            return [...newArr];

        case "UNDO_SPEND":
            return state.slice(0, state.length - 1);

        default: return state;
    }
};