export function spendingsReducer(state = [], action) {
    switch (action.type) {

        case "ADD_SPENDINGS":
                return [
                ...state, {title: action.text}
            ];

        case "REMOVE_SPENDINGS":
            return [...state.filter(item => item.title !== action.title)];

        case "ADD_USERS_TO_SPENDS":
            let newArr = [];
            let lastSpendItem = state.pop();
            lastSpendItem.users = action.arr;
            newArr = [...state];
            newArr.push(lastSpendItem);
            return [...newArr];

        case "UNDO_SPEND":

            console.log(state);
            return [...state.slice(0, state.length - 1)];

        default: return state;
    }
};