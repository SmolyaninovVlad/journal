
import {fetch_headers} from '../_constants/fetch_headers';
import {configs} from '../config';

export const userService = {
    Fetch_Acts,
    Fetch_Subdivisions,
    deleteAct,
    deleteAllActs,
    createAllActs,
    saveAct,
    createAllSubdivisions,
    createAct
};


function createAct(act){
    const requestOptions = {
        method: 'POST',
        headers: fetch_headers,
        body: JSON.stringify(act)
    }
    return new Promise(function(resolve, reject) {
        fetch(`${configs.apiUrl}/createAct`, requestOptions)
            .then(handleResponse)
            .then(function (response){
                if (response.MatchedCount === 0) reject("ошибка запроса к бд")
                
                resolve(response);
            })
            .catch(function(error) {
                if (typeof(error) === "object") error=error+""
                reject(error); 
            });
    });
};

function saveAct(act){
    const requestOptions = {
        method: 'POST',
        headers: fetch_headers,
        body: JSON.stringify(act)
    }
    return new Promise(function(resolve, reject) {
        fetch(`${configs.apiUrl}/updateAct`, requestOptions)
            .then(handleResponse)
            .then(function (response){
                if (response.MatchedCount === 0) reject("объект не найден в базе данных")
                resolve(response);
            })
            .catch(function(error) {
                if (typeof(error) === "object") error=error+""
                reject(error); 
            });
    });
};

function createAllActs(acts){
    const requestOptions = {
        method: 'POST',
        headers: fetch_headers,
        body: JSON.stringify(acts)
    }
    return new Promise(function(resolve, reject) {
        fetch(`${configs.apiUrl}/createAllActs`, requestOptions)
            .then(handleResponse)
            .then(function (response){
                resolve(response);
            })
            .catch(function(error) {
                if (typeof(error) === "object") error=error+""
                reject(error); 
            });
    });
};

function createAllSubdivisions(Subdivisions){
    const requestOptions = {
        method: 'POST',
        headers: fetch_headers,
        body: JSON.stringify(Subdivisions)
    }
    return new Promise(function(resolve, reject) {
        fetch(`${configs.apiUrl}/createUpdateSubdivisions`, requestOptions)
            .then(handleResponse)
            .then(function (response){
                resolve(response);
            })
            .catch(function(error) {
                if (typeof(error) === "object") error=error+""
                reject(error); 
            });
    });
};

function deleteAllActs(){
    const requestOptions = {
        method: 'POST',
        headers: fetch_headers
    }
    return new Promise(function(resolve, reject) {
        fetch(`${configs.apiUrl}/deleteAllActs`, requestOptions)
            .then(handleResponse)
            .then(function (response){
                resolve(response);
            })
            .catch(function(error) {
                if (typeof(error) === "object") error=error+""
                reject(error); 
            });
    });
};

function Fetch_Acts(){
    const requestOptions = {
        method: 'GET',
        headers: fetch_headers
    }
    return new Promise(function(resolve, reject) {
        fetch(`${configs.apiUrl}/getActs`, requestOptions)
            .then(handleResponse)
            .then(function (response){
                resolve(response);
            })
            .catch(function(error) {
                if (typeof(error) === "object") error=error+""
                reject(error); 
            });
    });
};

function Fetch_Subdivisions(){
    const requestOptions = {
        method: 'GET',
        headers: fetch_headers
    }
    return new Promise(function(resolve, reject) {
        fetch(`${configs.apiUrl}/getSubdivisions`, requestOptions)
            .then(handleResponse)
            .then(function (response){
                resolve(response);
            })
            .catch(function(error) {
                if (typeof(error) === "object") error=error+""                
                reject(error); 
            });
    });
};

function deleteAct(id){
    const requestOptions = {
        method: 'POST',
        headers: fetch_headers,
        body: JSON.stringify({ "IDExcel": id })
    }
    
    return new Promise(function(resolve, reject) {
        fetch(`${configs.apiUrl}/deleteAct`, requestOptions)
            .then(handleResponse)
            .then(function (response){
                if (response.DeletedCount === 0) reject('unknown field - id')
                resolve(response);
            })
            .catch(function(error) {
                reject(error); 
            });
    });
};



function handleResponse(response) { 
    return response.text().then(text => {
        let data = JSON.parse(text);
        if (!response.ok) {            
            return Promise.reject(data);
        }
           
        return data;
    });
}
