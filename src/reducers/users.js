import {confirm} from '../functions';


export function usersReducer(state = [], action) {
    switch (action.type) {
        case "ADD_USER":
            let newUser = { name: action.text };

            return [
                ...state,
                newUser
            ];

        case "REMOVE_USER" :
            if (confirm(action.user)) {
                const index = state.findIndex(elem => elem.name === action.user);
                const before = state.slice(0, index);
                const after = state.slice(index+1);
                const newArr = [...before, ...after];
                return [...newArr]
            } return state;

        case "UPDATE_STATE_OF_USERS":
            return [...action.arr];


        default: return state;
    }}




