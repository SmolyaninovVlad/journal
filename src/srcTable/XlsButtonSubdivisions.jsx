import React from 'react';
import { connect } from 'react-redux';
import { userActions} from '../_actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import XLSX from 'xlsx';
import { history } from '../_helpers';
import ReactModal from 'react-modal';

const customPasswordDivStyles = {
    content : {
        top                   : '350px',
        left                  : '70%',
        right                 : 'auto',
        bottom                : 'auto',
        marginLeft            : '-35%',
        width                 : '35%',
        zIndex                : '11'
      }
}

class XlsButtonSubdivisions extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            excelBtnHover : false,
            passwordDivOpened: false,
            isPswd: '',
        }
        this.handleClick = this.handleClick.bind(this);    
        this.access = this.access.bind(this)
        this.closeHandle = this.closeHandle.bind(this)
        this.openHandle = this.openHandle.bind(this)
    }

    handleClick(e) {
        this.refs.fileUploader.click();
    }

    access(){
        if (!this.refs.pswd.value) {
            this.setState({isPswd:"Введите пароль"}) 
            return;
        } else if(this.refs.pswd.value!=="123456") {
            this.setState({isPswd:"Неверный пароль"})
            return;
        }
        this.redirectToAdmin()
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
    redirectToAdmin(){
        history.push('/adminPanel');
        document.location.href="/adminPanel";
    }
    closeHandle(){
        this.setState({passwordDivOpened : false})
    }
    openHandle(){
        this.setState({passwordDivOpened : true})
    }
    render() {
        return (
            <div style={{justifyContent: "left", display:"grid", marginTop:'15px', marginLeft:'-15px', marginBottom:'10px'}}>
                <ReactModal
                ariaHideApp={false}
                onRequestClose={this.closeHandle}
                isOpen={this.state.passwordDivOpened}
                style={customPasswordDivStyles}>
                    <div className="container-fluid">
                        <div className="row form-group modal-header">
                            <h3 className="newLabel"> Проверка доступа </h3>
                        </div>
                        <div className="container-fluid">
                            <div className="ml-auto mr-auto row form-group"> 
                                <label htmlFor="pswd"><small style={{color: "#767676"}}>Для перехода по ссылке введите пароль доступа</small></label>
                                {this.state.isPswd && <small className="ml-auto mr-0" style={{lineHeight: "30px", color: "#f11010"}}>{this.state.isPswd}</small>}
                                <input type="password" className="form-control" id="pswd" placeholder="Введите пароль" ref="pswd"/>
                            </div>
                            <div className="mt-4 row form-group"> 
                                <div className="ml-auto mr-auto">
                                    <a href="/adminPanel"> </a>
                                    <button className="mr-0  btn btn-primary btnModal change"  onClick={this.access}>Перейти</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ReactModal>
                <input type="file" id="file"  accept=".xls,.xlsx" ref="fileUploader" style={{display: "none"}} onChange={this.onChangeFile.bind(this)}/>
                <button style={{marginBottom: "10px"}} disabled className="btn btn-primary btnModal excel" onClick={this.handleClick}><span>Обновить подразделения </span><FontAwesomeIcon icon="file-excel" /></button>
                <button className="btn btn-primary btnModal excel" onClick={this.openHandle}><span>Панель управления </span><FontAwesomeIcon icon="tools" /></button>
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