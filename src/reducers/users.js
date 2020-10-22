const users = [
    {name: "fsdfasf", id: 0, totalSpendings: 0, groupSpengings: 0, userDebt: 0},
];

export function usersReducer(state = [], action) {
    switch (action.type) {
        case "ON_ADD":
            let newUser;
            if (state.length === 0) {
                newUser = {
                    name: action.text,
                    id: 0,
                    totalSpendings: 0,
                    groupSpengings: 0,
                    userDebt: 0
                };
            } else {
                newUser = {
                    name: action.text,
                    id: state[state.length-1].id + 1,
                    totalSpendings: 0,
                    groupSpengings: 0,
                    userDebt: 0
                };
            }
            return [
                ...state,
                newUser
            ];
        case "ON_REMOVE" :
            let confirm = window.confirm(`Do you really want to remove ${action.user}?`);
            if (confirm) {
                const index = state.findIndex(elem => elem.id === action.id);
                const before = state.slice(0, index);
                const after = state.slice(index+1);
                const newArr = [...before, ...after];
                return [...newArr]
            } return state;

        case "UPDATE_STATE_OF_USERS":
            return [...action.arr];

        case "UPDATE_USAGE_LS":
            localStorage.setItem('users', JSON.stringify(state))
            return state;

        case "USERS_WILL_MOUNT":
            let users = localStorage.getItem('users');
            if (users) {
                return JSON.parse(localStorage.getItem('users'));
            }

        default: return state;
    }
}



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