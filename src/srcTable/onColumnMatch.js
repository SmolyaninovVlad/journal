
export function onColumnMatch({
    searchText,
    value,
    column,
    row
  }) {
    if (!searchText.trim()) return true
    if (column.dataField === "id") return false
    if (typeof(value)==='string' && !value.trim()) return false
    
    let result = false;
        
    if (column.dataField === "SubdivisionsID") { 
        if (value)
            {
                //Отбор по наименованиям подразделений
                row.Subdivisions.forEach(subname => { 
                    if (subname.Name){
                        if (subname.Name.toLowerCase().indexOf(searchText)>=0) {
                            result = true
                            return
                        }
                    }
                });
            }
    } else {
        if (typeof(value)==='string') {
            if (value.toLowerCase().indexOf(searchText)>=0) result = true
        } else
        if (typeof(value)==='number') {
            if (value==searchText) result = true
        }
    }
    return result;
  }