import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import { userActions } from '../_actions';
import { connect } from 'react-redux';
import {Form_modal} from './Form_modal';
import {XlsButton} from './XlsButton';
import {XlsButtonSubdivisions} from './XlsButtonSubdivisions';
import { columns } from './columns';
import { onColumnMatch } from './onColumnMatch';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const { SearchBar } = Search;
var $ = require("jquery");

class Table extends React.Component {
    constructor(props){
        super(props);
        document.title = "Журнал мониторинга изменений законодательства";
        this.state = {
          scroll: true,
          showArchive: false
        }        
        this.props.dispatch(userActions.getSubdivisions());
        this.props.dispatch(userActions.getActs());        
        this.getActs = this.getActs.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this)
        this.rowStyleFunction = this.rowStyleFunction.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      //нажата кнопка копирования строки
      if (e.target.closest('.copyBtn')) this.props.dispatch({type: "CREATE_MODAL", row: row, rowIndex: rowIndex}) 
      else this.props.dispatch({type: "SHOW_MODAL", row: row, rowIndex: rowIndex})  
    }
  };

  handleClick(){
    this.setState({showArchive: !this.state.showArchive})
  }

  handleDataChange (dataSize ){
    if (!this.state.scroll) return

    if (dataSize.dataSize===this.props.acts.length)
    {
      //ожидание отрисовки таблицы
      setTimeout(function(){
        $('html, body').animate({scrollTop: $(document).height()},1000);
      }, 1000);
      
    } else 
    if(dataSize.dataSize>=this.props.acts.length){
      //прокрутка сразу после добавления записи
      $('html, body').animate({scrollTop: $(document).height()},1000);
    }
    this.setState({scroll: false})
  }

  getActs(){
    let { acts } = this.props;
    if ( acts ) acts = Object.values(acts)

    if (this.props.modalIsOpen.deleted) {
      let index = acts.findIndex(el => el.id === this.props.modalIsOpen.row.id);
      acts.splice(index, 1);
      this.props.dispatch({type: "GOT_IT", acts: acts})
    } else if (this.props.modalIsOpen.updated) {
      let index = acts.findIndex(el => el.id === this.props.modalIsOpen.row.id);
      acts[index]=this.props.modalIsOpen.row
      this.props.dispatch({type: "GOT_IT", acts: acts})
    } else if (this.props.modalIsOpen.created) {  
      acts.push(this.props.modalIsOpen.row)      
      this.props.dispatch({type: "GOT_IT", acts: acts})
    }
    return acts
  }

  rowStyleFunction(row){
    if (!row.IsArchive) return {};

    if (this.state.showArchive) {
      return { backgroundColor: "rgba(244, 255, 111, 0.33)" }
    } else return { display: "none" }
  }
  

  render() { 
    let acts = this.getActs()
    
    return (  
        
      <div className="container-fluid" style={{ padding:10, marginTop: 150 }}>    
        <XlsButton/> 
        <XlsButtonSubdivisions/>
        <div className="custom-control custom-checkbox" style={{position: "absolute", right: "10px"}} onClick={this.handleClick}>
            <input type="checkbox" className="float-right custom-control-input" name="showArchive" onChange={this.handleClick} checked={this.state.showArchive}/>
            <label className="custom-control-label" htmlFor="showArchive">Архивные записи</label>
        </div>      
        {acts && this.props.subdivisions.length?  (
          <div className="row">            
            <ToolkitProvider
              bootstrap4
              striped
              search={ {
                onColumnMatch
              } }
              hover
              keyField="id"
              data={ acts }
              columns={ columns(acts, this.props.subdivisions) }               
              headerStyle={this.state.headerStyle}
            >
              {
                props => (
                  <div className="mx-auto">              
                    <Form_modal/>                   
                    <SearchBar placeholder ="Поиск"  delay = {800} { ...props.searchProps }/>
                    <div className="tableTitle d-flex">
                      <div className="firstBlock">
                        <span>Нормативно-правовые акты, в т.ч. Письма, рекомендации, разъяснения и т.п.</span>
                      </div>
                      <div className="secondBlock">
                        <span>Внутренние нормативные документы Банка, которые необходимо принять (внести изменения), относящиеся к обнаруженному документу</span>
                      </div>
                    </div>  
                    <BootstrapTable
                      keyField='id'
                      
                      { ...props.baseProps }
                      rowStyle={  this.rowStyleFunction  }
                      rowEvents={ this.rowEvents }
                      onTableChange={ this.onTableChange }
                      onDataSizeChange={ this.handleDataChange }
                    />
                  </div>
                )
              }
            </ToolkitProvider>
          </div>
          ):(<span className="text-center" style={{color: "#cbcbcb",fontSize: "20px"}}>Загрузка данных...<FontAwesomeIcon icon="cog" spin style={{position: "absolute", paddingTop: "15px",marginLeft: "-140px",fontSize: "100px",color: "#eaeaea", marginTop: "30px"}}/> </span> )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { acts,modalIsOpen, subdivisions } = state;
  return {
    acts,
    subdivisions,
    modalIsOpen
  };
}

const connectedTable = connect(mapStateToProps)(Table);
export { connectedTable as  Table};