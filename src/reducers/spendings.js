const spendings = [
    {title: "fsa", amount: 525, id: 0, users: Array(2)},
    {title: "vodka", amount: 100, id: 0, users: Array(2)}
];


export function spendingsReducer(state = [], action) {
    switch (action.type) {

        case "ON_ADD_SPENDINGS":
            let newSpendings;
            if (state.length === 0) {
                newSpendings = {
                    title: action.text,
                    amount: 0,
                    id: 0
                }
            } else {
                newSpendings = {
                    title: action.text,
                    amount: 0,
                    id: state[state.length - 1].id + 1
                }
            }
            console.log(state, newSpendings);
            return [
                ...state,
                newSpendings
            ];

        case "ON_REMOVE_SPENDINGS":
            let confirm = window.confirm(`Do you really want to remove ${action.title}?`);
            if (confirm) {
                let newArr = state.slice(0, action.id).concat(state.slice(action.id + 1));
                localStorage.setItem('spendings', JSON.stringify(newArr));
                    return [...newArr];
            }
            return state;

        case "GET_ARR_OF_USERS_SPENDS":
            let newArr = [];
            let lastSpendItem = state.pop();
            lastSpendItem.users = action.arr;
            lastSpendItem.amount = action.amount;
            newArr = [...state];
            newArr.push(lastSpendItem);
            return [...newArr];

        case "ON_CANCEL":
            return state.slice(0, state.length - 1);

        case "UPDATE_SPENDING_LS":
            localStorage.setItem('spendings', JSON.stringify(state));
            return state;

        case "SPENDINGS_WILL_MOUNT":
            let users = localStorage.getItem('users');
            if (users) {
                return JSON.parse(localStorage.getItem('spendings'));
            }
        default: return state;
    }
};