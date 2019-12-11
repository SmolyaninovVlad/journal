import React from 'react';
import { connect } from 'react-redux';
import { userActions} from '../_actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import XLSX from 'xlsx';

class XlsButton extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            excelBtnHover : false
        }
        this.handleClick = this.handleClick.bind(this);
        this.ExcelDateToJSDate = this.ExcelDateToJSDate.bind(this);          
    }

    handleClick(e) {
        this.refs.fileUploader.click();
    }

    onChangeFile(e) {
        e.preventDefault();
        var readFile = new FileReader();
        let props=this.props;
        let getData=this.ExcelDateToJSDate;
        readFile.onload = function(e) { 
            var contents = e.target.result;
            var workbook = XLSX.read(contents, {
                type: 'binary'
            });
            let acts=[];
            

            //1ый лист
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
            let rowNum=0;
            XL_row_object.forEach(function(row) {
                //Обход каждой строки для записи в бд
                // console.log(row['Наименования направлений деятельности Банка'])
                
                // Subdivisions = row['Наименования направлений деятельности Банка']? row['Наименования направлений деятельности Банка'].split(",") : ""
                
                rowNum++
                
                if (rowNum<=2)  return;
                let Subdivisions=[]
                let SubsRequest = []
                if (row['Наименования направлений деятельности Банка']) {
                    Subdivisions=row['Наименования направлений деятельности Банка'].split(", ")
                    if (Subdivisions)
                        Subdivisions.forEach( function (sub) {
                            SubsRequest.push(  {"Name" : sub} ) 
                        })
                }
                acts.push({
                    Name: row['Нормативно-правовые акты, в т.ч. Письма, рекомендации, разъяснения и т.п.'],
                    IDExcel: row['№ п/п'],
                    Date: getData(row['Дата внесения информации']),
                    InnerDate: getData(row['__EMPTY_1']),
                    InnerDescription: row['__EMPTY_3'],
                    InnerName: row['Внутренние нормативные документы Банка, которые необходимо принять (внести изменения), относящиеся к обнаруженному документу. '],
                    InnerHeads: row['__EMPTY_7'],
                    InnerDeadline: getData(row['__EMPTY_10']),
                    InnerMark: getData(row['__EMPTY_12']),
                    Subdivisions: SubsRequest
                });                  
            }); 
            //Очищение таблицы перед загрузкой новых данных
            props.dispatch(userActions.deleteAllActs(acts));
            
            
        };
        readFile.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };
        readFile.readAsBinaryString(e.target.files[0]);

    }

    ExcelDateToJSDate(date) {
        let dateParse=new Date(Math.round((date - 25569)*86400*1000)).toLocaleDateString('en-GB', {
                        day : 'numeric',
                        month : 'numeric',
                        year : 'numeric'
                    }).split(' ').join('.');
        if (dateParse==='Invalid.Date') dateParse=''

        return dateParse;
    }

    render() {
        return (
            <div className="d-flex" style={{marginLeft:'-15px'}}>
                <input type="file" id="file"  accept=".xls,.xlsx" ref="fileUploader" style={{display: "none"}} onChange={this.onChangeFile.bind(this)}/>
                <button disabled className="btn btn-primary btnModal excel" onClick={this.handleClick}><span style={{ marginBottom: "10px"}} >Обновить таблицу</span><FontAwesomeIcon icon="file-excel" /></button>
            </div>
        )
    }

}


function mapStateToProps(state) {
    const { acts } = state;
    return {
      acts
    };
  }
  
  const connectedXlsButton = connect(mapStateToProps)(XlsButton);
  export { connectedXlsButton as  XlsButton};