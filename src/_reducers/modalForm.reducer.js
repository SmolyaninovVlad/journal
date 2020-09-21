

export function modalIsOpen(state = {}, action) {
    switch (action.type) {
        case "SHOW_MODAL":
            return { isOpen : true, row : action.row, rowIndex: action.rowIndex}
        case "CREATE_MODAL":
            return { isOpen : true, row : action.row? action.row : {}, newRow: true}
        case "CREATED_MODAL":
            return { isOpen : false, row : action.row, created: true}
        case "HIDE_MODAL":
            return { isOpen : false, row : {}}
        case "DELETE_MODAL":
            return { isOpen : false, row : action.row, deleted: true}   
        case "UPDATE_MODAL":
            return { isOpen : false, row : action.row, updated: true}            
        default:
            return { isOpen : false, row : {}}
        }
}