import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { userService } from '../_services';
import Multiselect from 'react-bootstrap-multiselect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { alertActions } from '../_actions/alert.actions';


const customStyles = {
    content : {
        top                   : '6%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginLeft            : '-40%',
        width                 : '80%',
        maxHeight             : '88%',
        zIndex                : '10'
      }
}
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

const multiselectProps = {
    nonSelectedText : 'Нет выбранных',
    delimiterText :'; ',
    multiple : true, 
    enableFiltering: true,
    optionLabel : function (element) { return element.label},
    onDropdownShown : function (event) { 
        event.target.lastChild.classList.add('show')
    },
    onDropdownHidden : function (event) { 
        event.target.lastChild.classList.remove('show')
    },
    nSelectedText : ' подразделений выбрано'
}

class Form_modal extends React.Component {
    constructor (props) {        
        super(props);
        this.state = {
            modalTitle: '',
            loading: false,
            isInnerMark: false,
            iscustomConstructor: false,
            subdivisionsData: this.props.subdivisions,
            passwordDivOpened: false,
            isPswd: '',
            isArchive: this.props.isArchive
        };
        this.deleteAct = this.deleteAct.bind(this);
        this.saveAct = this.saveAct.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.createAct = this.createAct.bind(this);
        this.customConstructor = this.customConstructor.bind(this) 
        this.deleteAccept = this.deleteAccept.bind(this)   
        this.closeHandle = this.closeHandle.bind(this)
        this.archiveChange = this.archiveChange.bind(this)
    }

    customConstructor(){
        let subdivisionsData = JSON.parse(JSON.stringify(this.props.subdivisions)) 
        if (this.props.modalIsOpen.row.SubdivisionsID) {
            this.props.modalIsOpen.row.SubdivisionsID.forEach(element=> {
                let index = subdivisionsData.findIndex(el => el.id === element);
                if (index>=0) subdivisionsData[index]["selected"]=true
            }) 
            
        }
        
        if (this.props.modalIsOpen.row.IsInnerMark!==this.state.isInnerMark) {
            
            if (this.refs.InnerMark && !this.state.isInnerMark) this.refs.InnerMark.value=""

            this.setState({
                subdivisionsData: subdivisionsData,
                isArchive: this.props.modalIsOpen.row.IsArchive,
                isInnerMark : !this.state.isInnerMark,
                iscustomConstructor: true
            });

        } else {
            this.setState({
                subdivisionsData: subdivisionsData,
                isArchive: this.props.modalIsOpen.row.IsArchive,
                iscustomConstructor: true
            });
        }

    }
    getUpdate(){
        let subdivisionsJson = []
        let subdivisions = []
        let mark = "не требуется"
        Array.from(this.refs.Subdivisions.selectRef.selectedOptions).forEach(function(item){
            subdivisionsJson.push({"Subdivision": item.value})
            subdivisions.push(item.value)
        });
        
        if (!this.state.isInnerMark) {
            if (this.refs.isInnerMark && this.refs.isInnerMark.value) {
                mark = this.refs.InnerMark.value.toString().slice(0, 10).split('-').reverse().join('/').trim()
            } else {
                mark = ""
            }
        } 
        return {
            "id" : this.props.modalIsOpen.newRow? '' : this.props.modalIsOpen.row.id,
            "IDExcel" : this.props.modalIsOpen.newRow? '' : this.props.modalIsOpen.row.IDExcel,
            "Date" : this.refs.Date.value.toString().slice(0, 10).split('-').reverse().join('/').trim(),
            "Name" : this.refs.Name.value.trim(),
            "InnerDate" : this.refs.InnerDate.value.toString().slice(0, 10).split('-').reverse().join('/').trim(),
            "InnerDescription" : this.refs.InnerDescription.value.trim(),
            "InnerName" : this.refs.InnerName.value.trim(),
            "InnerHeads" : this.refs.InnerHeads.value.trim(),
            "InnerDeadline" : this.refs.InnerDeadline.value.toString().slice(0, 10).split('-').reverse().join('/').trim(),
            "InnerMark" : mark,
            "IsArchive" : this.state.isArchive,
            "IsInnerMark" : this.state.isInnerMark,
            "Subdivisions" : subdivisionsJson,
            "SubdivisionsID" : subdivisions
            
        }
    }
    innerMarkChange(){
        if (this.refs.InnerMark && !this.state.isInnerMark) this.refs.InnerMark.value=""
        this.setState({isInnerMark : !this.state.isInnerMark});        
    }
    archiveChange(){
        this.setState({isArchive : !this.state.isArchive});  
    }
    saveAct(e){
        e.preventDefault();
        this.setState({loading : true});
        let update = this.getUpdate()
        userService.saveAct(update).then((response) => {
            this.props.dispatch(alertActions.success("Объект № "+update["IDExcel"]+" Обновлён")); 
            this.props.dispatch({type: "UPDATE_MODAL", row:update})
            this.closeHandle()
        })
        .catch((err) => {
            this.props.dispatch(alertActions.error("Ошибка обновления: "+err));        
            this.closeHandle()     
        });        
    }
    createAct(e){
        e.preventDefault();
        this.setState({loading : true});
        let newData = this.getUpdate()
        userService.createAct(newData).then((response) => {
            newData.IDExcel=response.IDExcel
            newData.id=response.InsertedID
            this.props.dispatch(alertActions.success("Объект успешно создан")); 
            this.props.dispatch({type: "CREATED_MODAL", row:newData})
            this.closeHandle()
        })
        .catch((err) => {
            this.props.dispatch(alertActions.error("Ошибка добавления: "+err)); 
            this.closeHandle()
        });  
    }
    deleteAct(){
        if (this.state.passwordDivOpened)
            this.setState({passwordDivOpened : false, isPswd: ''});
        else 
            this.setState({passwordDivOpened : true});
    }
    deleteAccept(){
        if (!this.refs.pswd.value) {
            this.setState({isPswd:"Введите пароль"}) 
            return;
        } else if(this.refs.pswd.value!=="123456") {
            this.setState({isPswd:"Неверный пароль"})
            return;
        }
        this.setState({loading : true, isPswd: ''});
        let num = this.props.modalIsOpen.row['IDExcel']
        userService.deleteAct(num).then((response) => {
            this.props.dispatch({type: "DELETE_MODAL", row:this.props.modalIsOpen.row})
            this.props.dispatch(alertActions.success("Объект № "+num+" Удалён")); 
            this.closeHandle()
        })
        .catch((err) => {
            this.props.dispatch(alertActions.error("Ошибка удаления: "+err)); 
            this.closeHandle()
        }); 
    }
    closeHandle(){
        let it = this
        //Таймаут для ожидания отработки dispatch
        setTimeout(function(){
            it.setState({
                iscustomConstructor: false, 
                loading : false, 
                isInnerMark:false,
                passwordDivOpened : false
            })
        }, 150)

    }
    closeModal() {
        this.props.dispatch({type: "HIDE_MODAL"})
        this.closeHandle()
    }
    getDate(date){
        if (!date) return null; 
        let newDate
        if (typeof(date)==='object') {
            newDate = date
        } else {
            let parts = date.split('/');
            newDate = new Date(parts[2], parts[1]-1, parts[0]);
        }
        return newDate.getFullYear() + '-' + ('0' + (newDate.getMonth() + 1)).slice(-2) + '-' + ('0' + newDate.getDate()).slice(-2)
    }

    render() {  

        //Необходимо для установки параметров окна
        if (this.props.modalIsOpen.isOpen && !this.state.iscustomConstructor) this.customConstructor()
        return (        
        <div>
            <ReactModal
            ariaHideApp={false}
            isOpen={this.props.modalIsOpen.isOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            >
                <ReactModal
                ariaHideApp={false}
                onRequestClose={this.deleteAct}
                isOpen={this.state.passwordDivOpened}
                style={customPasswordDivStyles}
                >
                    <div className="container-fluid">
                        <div className="row form-group modal-header">
                            <h3 className="newLabel"> Проверка доступа </h3>
                        </div>
                        <div className="container-fluid">
                            <div className="ml-auto mr-auto row form-group"> 
                                <label htmlFor="pswd"><small style={{color: "#767676"}}>Для удаления объекта введите пароль доступа</small></label>
                                {this.state.isPswd && <small className="ml-auto mr-0" style={{lineHeight: "30px", color: "#f11010"}}>{this.state.isPswd}</small>}
                                <input type="password" className="form-control" id="pswd" placeholder="Введите пароль" ref="pswd"/>
                            </div>
                            <div className="mt-4 row form-group"> 
                                <div className="ml-auto mr-auto">
                                    <button className="mr-0  btn btn-primary btnModal deleteAccept"  onClick={this.deleteAccept} disabled={this.state.loading}>{this.state.loading?<FontAwesomeIcon icon="spinner" spin/> : "Удалить"}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </ReactModal>

                <div className="container-fluid">
                    <div className="row form-group modal-header">
                        <h3 className={this.props.modalIsOpen.newRow? "newLabel":""} ref={subtitle => this.subtitle = subtitle}>{this.props.modalIsOpen.newRow? "Добавление записи" : "Изменение объекта №"+ this.props.modalIsOpen.row.IDExcel}</h3>  
                        <FontAwesomeIcon icon="times" onClick={this.closeModal}/>
                    </div>
                    <div className="container-fluid modal-body">
                        <div className="row form-group">
                            <div className="col-lg-3"><span>Дата внесения информации</span></div>
                            <div className="col-lg-9">
                                <div className="blockEdit" style={{display: "inline-block", width: "100%"}}>
                                    <input type="date" className="form-control float-left" defaultValue={this.props.modalIsOpen.isOpen? (this.props.modalIsOpen.row.Date? (
                                        this.props.modalIsOpen.newRow? this.getDate(new Date()) : this.getDate(this.props.modalIsOpen.row.Date)
                                        ):this.getDate(new Date())):("")} ref='Date'/>
                                    <div className="custom-control custom-checkbox" onClick={this.archiveChange} >
                                        <input type="checkbox" className="float-right custom-control-input" name="isArchive" ref='isArchive' checked={this.state.isArchive}/>
                                        {this.props.modalIsOpen.row.InnerMark && <label className="custom-control-label" htmlFor="isArchive">Архив</label>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-lg-3"><span>Нормативно-правовые акты</span></div>
                            <div className="col-lg-9">
                                <div className="blockEdit">
                                    <textarea className="form-control" defaultValue={this.props.modalIsOpen.row.Name} ref='Name'/>
                                </div>
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-lg-3"><span>Дата вступления в силу</span></div>
                            <div className="col-lg-9">
                                <div className="blockEdit">
                                    <input type="date" className="form-control" defaultValue={this.getDate(this.props.modalIsOpen.row.InnerDate)} ref='InnerDate'/>
                                </div>
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-lg-3"><span>Краткое описание</span></div>                
                            <div className="col-lg-9">
                                <div className="blockEdit">
                                    <textarea className="form-control" defaultValue={this.props.modalIsOpen.row.InnerDescription} ref='InnerDescription'/>
                                </div>
                            </div>
                        </div> 
                        <div className="row form-group">  
                            <div className="col-lg-3"><span>Наименование ВНД</span></div>                
                            <div className="col-lg-9">
                                <div className="blockEdit">
                                    <textarea className="form-control" defaultValue={this.props.modalIsOpen.row.InnerName} ref='InnerName'/>
                                </div>
                            </div>
                        </div> 
                        <div className="row form-group">  
                            <div className="col-lg-3"><span>Ответственные лица структурных подразделений</span></div>                
                            <div className="col-lg-9">
                                <div className="blockEdit">
                                    <input type="text" className="form-control" defaultValue={this.props.modalIsOpen.row.InnerHeads} ref='InnerHeads'/>
                                </div>
                            </div>
                        </div> 
                        <div className="row form-group">  
                            <div className="col-lg-3"><span>Срок исполнения</span></div>                
                            <div className="col-lg-9">
                                <div className="blockEdit">
                                    <input type="date" className="form-control" defaultValue={this.getDate(this.props.modalIsOpen.row.InnerDeadline)} ref='InnerDeadline'/>
                                </div>
                            </div>
                        </div> 
                        <div className="row form-group">  
                            <div className="col-lg-3"><span>Отметка об исполнении</span></div>                
                            <div className="col-lg-9">
                                <div className="blockEdit d-inline-block">
                                    <input type="date" className="float-left form-control" defaultValue={this.getDate(this.props.modalIsOpen.row.InnerMark)} ref='InnerMark' disabled={this.state.isInnerMark}/>
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="float-left custom-control-input" onClick={this.innerMarkChange.bind(this)} id="isInnerMark" ref='isInnerMark'checked={this.state.isInnerMark}/>
                                        <label className="custom-control-label" htmlFor="isInnerMark">Не требуется</label>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        <div className="row form-group">  
                            <div className="col-lg-3"><span>Наименования направлений деятельности Банка</span></div>                
                            <div className="col-lg-5">
                                <div className="blockEdit">
                                    <div>
                                        <Multiselect  { ...multiselectProps } data={this.state.subdivisionsData}   ref='Subdivisions'/>
                                    </div>
                                    <div>
                                        {/* {subdivisions} */}
                                    </div>
                                    {/* <textarea className="form-control" defaultValue={this.props.modalIsOpen.row.Subdivision} ref='Subdivision'/> */}
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="container ml-auto mr-0" style={{marginTop:"5px"}}> 
                                    <div className="row"> 
                                        <div className="ml-auto mr-0" style={{display:"inherit"}}>          
                                            {!this.props.modalIsOpen.newRow? 
                                                <button className="btn btn-primary btnModal change" onClick={this.saveAct} disabled={this.state.loading}>{this.state.loading?<FontAwesomeIcon icon="spinner" spin/> : "Изменить"}</button>
                                                :
                                                <button className="btn btn-primary btnModal change" onClick={this.createAct} disabled={this.state.loading}>{this.state.loading?<FontAwesomeIcon icon="spinner" spin/> : "Сохранить"}</button>
                                            }
                                            {!this.props.modalIsOpen.newRow && <button className="btn btn-primary btnModal delete" onClick={this.deleteAct}>{this.state.loading?<FontAwesomeIcon icon="spinner" spin/> : "Удалить"}</button>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                 
                    </div>
                </div>
            </ReactModal>
        </div>
        );
    }
}

function mapStateToProps(state) {
    const  { modalIsOpen, subdivisions }  = state;
    return {
        modalIsOpen,
        subdivisions
    };
}

const connectedform_modal = connect(mapStateToProps)(Form_modal);
export { connectedform_modal as  Form_modal};