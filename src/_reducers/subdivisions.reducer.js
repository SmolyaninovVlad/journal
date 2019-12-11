
export function subdivisions(state = {}, action) {
    switch (action.type) {
        case "SUBS_GOT_IT":
            return action.subdivisions
        case "SUBS_DID_NOT_GET_IT":
            return action.subdivisions
        default:
            return state
        }
}