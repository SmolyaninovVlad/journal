import { userService } from '../_services';
import { alertActions } from './alert.actions';

export const userActions = {
    getActs,
    getSubdivisions,
    deleteAllActs,
    deleteAllSubdivisions
};

function deleteAllActs(XLS=null){
    if (XLS){
        return (dispatch) => {                        
            userService.deleteAllActs().then((response) => {
                userService.createAllActs(XLS).then((response) => {
                    dispatch(userActions.getActs());
                })
                .catch((err) => {                     
                    console.log(err);
                    dispatch(alertActions.error(err))
                    // dispatch(fetchOffersError(err))
                });
            })
            .catch((err) => {                     
                console.log(err);
                dispatch(alertActions.error(err))
                // dispatch(fetchOffersError(err))
            });
        }
    } else {
        return (dispatch, acts) => {
                        
            userService.deleteAllActs().then((response) => {
                console.log(response);
                // dispatch(fetchOffersSuccess(response));
            })
            .catch((err) => {                     
                console.log(err);
                dispatch(alertActions.error(err))
                // dispatch(fetchOffersError(err))
            });

        }
    }

}

function deleteAllSubdivisions(XLS){

    return (dispatch) => {    

        userService.createAllSubdivisions(XLS).then((response) => {
            dispatch(alertActions.success("Список подразделений обновлён")); 
            dispatch(userActions.getSubdivisions());
        })
        .catch((err) => {     
            dispatch(alertActions.error(err))
            // dispatch(fetchOffersError(err))
        });

    }

}

function getSubdivisions(alert = false){

    return dispatch => {
        userService.Fetch_Subdivisions().then((response) => {
            dispatch(fetchOffersSuccess(response));   
            if (alert) dispatch(alertActions.success("данные получены"));               
        })
        .catch((err) => {    
            dispatch(alertActions.error(err))
            dispatch(fetchOffersError([]))
        });
    }

    function fetchOffersSuccess(subdivisions) {
        //Построение необходимого массива
        let subdivisionsData=[]   

        Object.keys(subdivisions).reduce(function(object, cur) {            
            subdivisionsData.push({"selected": false, "value": subdivisions[cur]["id"], "label" : subdivisions[cur]["Name"], "HeadName" : subdivisions[cur]["HeadName"], "id" : subdivisions[cur]["id"], "Email" : subdivisions[cur]["Email"], })     
            return null
        }, {});  
        subdivisionsData.sort(dynamicSort("label"));

        return {
            type: "SUBS_GOT_IT",
            subdivisions: subdivisionsData
        };
    }
    
    function fetchOffersError(error) {
        return {
            type: "SUBS_DID_NOT_GET_IT",
            subdivisions: error
        };
    }

}

function getActs(){
    return dispatch => {
        userService.Fetch_Acts().then((response) => {
            dispatch(fetchOffersSuccess(response));
            dispatch(alertActions.success("данные получены")); 
        })
        .catch((err) => {                      
            dispatch(alertActions.error(err))
            dispatch(fetchOffersError([]))
        });
    }

    function fetchOffersSuccess(acts) {
        if (!acts) acts=[]
        return {
            type: "GOT_IT",
            acts: acts
        };
    }
    
    function fetchOffersError(error) {
        return {
            type: "DID_NOT_GET_IT",
            acts: error
        };
    }

}



function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}