import React from 'react';

export const columns =  (acts, subs) => { 
     return [
        {
            dataField: 'id',
            text: 'id',
            hidden: true
        },
        {
            dataField: 'IDExcel',
            text: '№ п/п',
            sort: true,
            style:{
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            } ,
            headerStyle: (colum, colIndex) => {
                return { width: '50px'};
            }
        },
        {
            dataField: 'Date',
            text: 'Дата внесения информации',
            sort: true, 
            sortFunc: (a, b, order) => sortDateCustom(a, b, order),
            searchable: false,   
            headerStyle: (colum, colIndex) => {
                return { width: '100px', overflow: 'hidden'};
            }
        },
        {
            dataField: 'Name',
            text: 'Нормативно-правовые акты',
            sort: true,
            style:{
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            },
            headerStyle: (colum, colIndex) => {
                return { width: '300px'};
            }
        },
        {
            dataField: 'InnerDate',
            text: 'Дата вступления в силу',
            sort: true,
            sortFunc: (a, b, order) => sortDateCustom(a, b, order),
            searchable: false,  
            headerStyle: (colum, colIndex) => {
                return { width: '80px',  overflow: "hidden"};
            }
        },
        {
            dataField: 'InnerDescription',
            text: 'Краткое описание',
            sort: true,
            headerStyle: (colum, colIndex) => {
                return { width: '300px'};
            }
        },
        {
            dataField: 'InnerName',
            text: 'Наименование ВНД',
            sort: true,
            headerStyle: (colum, colIndex) => {
                return { width: '150px'};
            }
        },
        {
            dataField: 'InnerHeads',
            text: 'Ответственные лица структурных подразделений',
            sort: true,
            headerStyle: (colum, colIndex) => {
                return { width: '150px',  overflow: 'hidden'};
            }
        },
        {
            dataField: 'InnerDeadline',
            text: 'Срок исполнения',
            sort: true,
            sortFunc: (a, b, order) => sortDateCustom(a, b, order),
            searchable: false,  
            headerStyle: (colum, colIndex) => {
                return { width: '80px',  overflow: 'hidden'};
            }
        },
        {
            dataField: 'InnerMark',
            text: 'Отметка об исполнении',
            sort: true,
            sortFunc: (a, b, order) => sortDateCustom(a, b, order),
            searchable: false,  
            headerStyle: (colum, colIndex) => {
                return { width: '80px',  overflow: 'hidden'};
            }
        },
        {
            dataField: 'SubdivisionsID',
            text: 'Направление деятельности Банка',
            sort: true,
            headerStyle: (colum, colIndex) => {
                return { width: '130px',  overflow: 'hidden'};
            },
            formatter: (cell, row) => {
                if (subs.length>0 && cell) {
                    let Labels = []
                    cell.forEach(element => {

                        let index = subs.findIndex(el => el.id === element);
                        if (index>=0) Labels.push(<Label data={subs[index]}/>)
                    
                    });
                    cell=Labels
                }
                else {
                    cell = ""
                }
                return cell
            }
        }
    ] 
    
};

function Label(props) {    
    return <span style={{ display : "block", width: "100%"}}>{props.data.label}</span>;
}

function getDate(date){
    if (!date) return ''; 
    if (date === 'не требуется') return '';
    let newDate
    if (typeof(date)==='object') {
        newDate = date
    } else {
        let parts = date.split('/');
        newDate = new Date(parts[2], parts[1]-1, parts[0]);
    }
    return newDate.getFullYear() + '-' + ('0' + (newDate.getMonth() + 1)).slice(-2) + '-' + ('0' + newDate.getDate()).slice(-2)
}

function sortDateCustom(a, b, order){
    a=getDate(a)
    b=getDate(b)
    if (order === 'asc') {
        return b.localeCompare(a);
    }
    return a.localeCompare(b);
}