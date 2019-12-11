import React from 'react';
import { connect } from 'react-redux';
import { userActions} from '../_actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import XLSX from 'xlsx';

class XlsButtonSubdivisions extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            excelBtnHover : false
        }
        this.handleClick = this.handleClick.bind(this);    
      
    }

    handleClick(e) {
        this.refs.fileUploader.click();
    }

    onChangeFile(e) {
        e.preventDefault();
        var readFile = new FileReader();
        let props=this.props;
        readFile.onload = function(e) { 
            var contents = e.target.result;
            var workbook = XLSX.read(contents, {
                type: 'binary'
            });
            let subdivisions=[];
            //1ый лист
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
            XL_row_object.forEach(function(row) {
                // console.log(row)
                 //Обход каждой строки для записи в бд
                subdivisions.push({
                    Name: row['Подразделение КРАТКО'],
                    HeadName: row['Фамилия Имя Отчество'],
                    Email: row['E-mail']
                });                  
            }); 
            //Очищение таблицы перед загрузкой новых данных
            console.log(subdivisions)
            props.dispatch(userActions.deleteAllSubdivisions(subdivisions));
            
            
        };
        readFile.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
        };
        readFile.readAsBinaryString(e.target.files[0]);

    }

    render() {
        return (
            <div className="d-flex" style={{marginTop:'15px', marginLeft:'-15px', marginBottom:'10px'}}>
                <input type="file" id="file"  accept=".xls,.xlsx" ref="fileUploader" style={{display: "none"}} onChange={this.onChangeFile.bind(this)}/>
                <button disabled className="btn btn-primary btnModal excel" onClick={this.handleClick}><span>Обновить подразделения </span><FontAwesomeIcon icon="file-excel" /></button>
            </div>
        )
    }

}


function mapStateToProps(state) {
    const { subdivisions } = state;
    return {
        subdivisions
    };
  }
  
  const connectedXlsButtonSubdivisions = connect(mapStateToProps)(XlsButtonSubdivisions);
  export { connectedXlsButtonSubdivisions as  XlsButtonSubdivisions};