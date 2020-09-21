import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { columnsSubdivisions } from './srcTable/columns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { connect } from 'react-redux';
import { userActions } from './_actions';
import {Form_modal_subs} from './srcTable/Form_modal_subs';
import { store } from './_helpers';
import { history } from './_helpers';

const { SearchBar, ClearSearchButton } = Search;

class AdminPanel extends React.Component {
    constructor(props) {
      super(props);
      document.title = "Панель управления";
      this.state = {
      }
      this.props.dispatch(userActions.getSubdivisions(true));
      this.getSubs = this.getSubs.bind(this)
      this.redirectToHome = this.redirectToHome.bind(this)
    }

    rowEvents = {
      onClick: (e, row, rowIndex) => {
        this.props.dispatch({type: "SHOW_MODAL", row: row, rowIndex: rowIndex})        
      }
    };

    getSubs(){
      let { subdivisions } = this.props;
      if (this.props.modalIsOpen.deleted) {
        let index = subdivisions.findIndex(el => el.id === this.props.modalIsOpen.row.id);
        subdivisions.splice(index, 1);
        this.props.dispatch({type: "SUBS_GOT_IT", subdivisions: subdivisions})
        
      
      } else if (this.props.modalIsOpen.updated) {
        let index = subdivisions.findIndex(el => el.id === this.props.modalIsOpen.row.id);
        subdivisions[index]=this.props.modalIsOpen.row
        this.props.dispatch({type: "SUBS_GOT_IT", subdivisions: subdivisions});
      } else if (this.props.modalIsOpen.created) {  
        subdivisions.unshift(this.props.modalIsOpen.row)      
        this.props.dispatch({type: "SUBS_GOT_IT", subdivisions: subdivisions})
      }
      return subdivisions
    }
    redirectToHome(){
      history.push('/');
      document.location.href="/";
    }

    render() {
      let subs = store.getState().subdivisions
      if (this.props.modalIsOpen.updated || this.props.modalIsOpen.deleted || this.props.modalIsOpen.created) subs = this.getSubs()
      return (
        <div className="App container-fluid" style={{paddingTop: "100px"}}>
          <div className="mt-4 row">  
            <button className="btn btn-primary btnModal excel" onClick={this.redirectToHome}><span>Главная </span></button>
          </div>
          <div style={{color: "#6a6a6a", padding: "20px 15px 10px 15px", fontSize: "17px", textTransform: "uppercase", fontWeight: "500"}} className="mt-4 row">  
            <span>Список подразделений</span>
          </div>
          {subs.length?  (
            <div className="row">            
              <ToolkitProvider
                bootstrap4
                striped
                hover
                keyField="id"
                data={ subs }
                search
                columns={ columnsSubdivisions(subs) }>
                {
                  props => (
                    <div className="mx-auto">
                      <Form_modal_subs/>                   
                      <SearchBar placeholder ="Поиск"  delay = {800} { ...props.searchProps }/>
                      <div className="tableTitle d-flex"> 
                        <BootstrapTable
                          keyField='id'
                          { ...props.baseProps }
                          rowEvents={ this.rowEvents }
                        />
                      </div>
                    </div>
                  )
                }
              </ToolkitProvider>
            </div>
            ):(<span className="text-center" style={{color: "#cbcbcb",fontSize: "20px"}}>
              Загрузка данных...
              <FontAwesomeIcon icon="cog" spin style={{position: "absolute", paddingTop: "15px",
              marginLeft: "-140px",fontSize: "100px",color: "#eaeaea", marginTop: "30px"}}/> </span> )}
        </div>
      );  
    }
  }



function mapStateToProps(state) {
  const { subdivisions, modalIsOpen } = state;
  return {
  subdivisions,
  modalIsOpen
}}



const connectedTable = connect(mapStateToProps)(AdminPanel);
export { connectedTable as  AdminPanel};