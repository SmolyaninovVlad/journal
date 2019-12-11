
export function acts(state = {}, action) {

    switch (action.type) {
        case "GOT_IT":
            return action.acts
        case "DID_NOT_GET_IT":
            return action.acts
        default:
            return state
        }
}