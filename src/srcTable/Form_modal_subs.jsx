import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { userService } from '../_services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { alertActions } from '../_actions/alert.actions';

const customStyles = {
    content : {
        top                   : '25%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginLeft            : '-25%',
        width                 : '50%',
        zIndex                : '10'
      }
}

class Form_modal_subs extends React.Component {
    constructor (props) {        
        super(props);
        this.state = {
            loading:false
        };
        this.closeModal = this.closeModal.bind(this)
        this.saveSub = this.saveSub.bind(this);
        this.deleteSub = this.deleteSub.bind(this);
        this.createSub = this.createSub.bind(this);
    }
    closeModal() {
        this.props.dispatch({type: "HIDE_MODAL"})
    }
    saveSub(e){
        e.preventDefault();
        this.setState({loading : true});
        let update = {
            "id": this.props.modalIsOpen.row.id,
            "Name": this.refs.label.value,
            "HeadName": this.refs.HeadName.value,
            "Email": this.refs.Email.value,
        }
        userService.saveSub(update).then((response) => {
            this.props.dispatch(alertActions.success("Подразделение: "+ this.props.modalIsOpen.row.label+" обновлено"))
            update = {
                "id": update.id,
                "label": update.Name,
                "HeadName": update.HeadName,
                "Email": update.Email,
            }
            this.props.dispatch({type: "UPDATE_MODAL", row:update});
            this.setState({loading : false});
        })
        .catch((err) => {
            this.props.dispatch(alertActions.error("Ошибка обновления: "+err));
            this.setState({loading : false});
        });        
    }
    deleteSub(e){
        e.preventDefault();
        let row = this.props.modalIsOpen.row
        this.setState({loading : true});
        userService.deleteSub(this.props.modalIsOpen.row.id).then((response) => {
            this.props.dispatch(alertActions.success("Подразделение: "+ row.label+"  Удалено"))
            this.props.dispatch({type: "DELETE_MODAL", row: row});
            this.setState({loading : false});
        })
        .catch((err) => {
            this.props.dispatch(alertActions.error("Ошибка удаления: "+err));
            this.setState({loading : false});
        });
    }
    createSub(e){
        e.preventDefault();
        this.setState({loading : true});
        let newRow = {
            "Name": this.refs.label.value,
            "HeadName": this.refs.HeadName.value,
            "Email": this.refs.Email.value,
        }
        userService.createSub(newRow).then((response) => {
            this.props.dispatch(alertActions.success("Подразделение: "+ newRow.Name+" создано"))
            newRow = {
                "id": response.InsertedID,
                "label": newRow.Name,
                "HeadName": newRow.HeadName,
                "Email": newRow.Email,
            }
            this.props.dispatch({type: "CREATED_MODAL", row:newRow, });
            this.setState({loading : false});
        })
        .catch((err) => {
            this.props.dispatch(alertActions.error("Ошибка: "+err));
            this.setState({loading : false});
        });    
    }

    render() {
        return (        
        <div>
            <ReactModal
            ariaHideApp={false}
            isOpen={this.props.modalIsOpen.isOpen}
            onRequestClose={this.closeModal}
            style={customStyles}>
                    <div className="row form-group modal-header">
                        <h3 className={this.props.modalIsOpen.newRow? "newLabelSub":""} ref={subtitle => this.subtitle = subtitle}>{this.props.modalIsOpen.newRow? "Добавление подразделения" : "Подразделение: "+ this.props.modalIsOpen.row.label}</h3>  
                        <FontAwesomeIcon icon="times" onClick={this.closeModal}/>
                    </div>
                    <div className="container-fluid modal-body">
                        <div className="row form-group">
                            <div className="col-lg-3"><span>Наименование подразделения</span></div>
                            <div className="col-lg-9">
                                <div className="blockEdit">
                                    <input className="form-control" ref="label" placeholder="Введите наименование подразделения" defaultValue={this.props.modalIsOpen.row.label} />
                                </div>
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-lg-3"><span>Начальник</span></div>
                            <div className="col-lg-9">
                                <div className="blockEdit">
                                    <input className="form-control" ref="HeadName" placeholder="Введите ФИО начальника" defaultValue={this.props.modalIsOpen.row.HeadName}/>
                                </div>
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-lg-3"><span>Email</span></div>
                            <div className="col-lg-9">
                                <div className="blockEdit">
                                    <input className="form-control" ref="Email" placeholder="Введите Email" defaultValue={this.props.modalIsOpen.row.Email}/>
                                </div>
                            </div>
                        </div>
                        <div className="container ml-auto mr-0"> 
                            <div className="mt-5 mb-0 row form-group"> 
                                <div className="ml-auto mr-0">          
                                    {!this.props.modalIsOpen.newRow? 
                                        <button className="btn btn-primary btnModal change" onClick={this.saveSub} disabled={this.state.loading}>{this.state.loading?<FontAwesomeIcon icon="spinner" spin/> : "Изменить"}</button>
                                        :
                                        <button className="btn btn-primary btnModal change" onClick={this.createSub} disabled={this.state.loading}>{this.state.loading?<FontAwesomeIcon icon="spinner" spin/> : "Сохранить"}</button>
                                    }
                                    {!this.props.modalIsOpen.newRow && <button className="btn btn-primary btnModal delete" onClick={this.deleteSub}>{this.state.loading?<FontAwesomeIcon icon="spinner" spin/> : "Удалить"}</button>}
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
    const  { modalIsOpen, subdivisions}  = state;
    return {
        modalIsOpen,
        subdivisions
    };
}

const connectedform_modal = connect(mapStateToProps)(Form_modal_subs);
export { connectedform_modal as  Form_modal_subs};