
export function usersReducer(state = [], action) {
    switch (action.type) {
        case "ADD_USER":
            let newUser = { name: action.text };

            return [
                ...state,
                newUser
            ];

        case "REMOVE_USER" :
            return [...state.filter(item => item.name !== action.name)];

            default: return state;
    }}




