import React from 'react';
import  { Table }  from './srcTable/Table';
// import { alertActions } from './_actions';
// import { history } from './_helpers';
// import { Provider } from 'react-redux';
// import { store } from './_helpers';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'; 
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { connect } from 'react-redux';


var $ = require("jquery");
class App extends React.Component {
  componentDidMount () {
    window.addEventListener('scroll', this.handleScroll, true);
  }
  constructor(props) {
    super(props);
    // const { dispatch } = this.props;
    library.add(fas);
    this.state = {
      btnUp: false
    }
    this.autoScroll = this.autoScroll.bind(this); 
    this.handleScroll = this.handleScroll.bind(this); 
    this.create = this.create.bind(this); 
  }

  handleScroll(){
    if (window.pageYOffset>300) {
      this.setState({
        btnUp: true
      })
    } else {
      this.setState({
        btnUp: false
      })
    }
  }
  autoScroll(){
    $('html, body').animate({scrollTop: 0},500);
  }

  create(){
    this.props.dispatch({type: "CREATE_MODAL"})  
  }
  render() {
    return (
      <div className="App container-fluid">
        <header id="header">
          <div className="container-fluid text-left">
            <div id="logo" className="pull-left">
              <h1><span>Журнал мониторинга изменений законодательства</span></h1>
              <a href="#intro"><img src="img/logo.png" alt="" title="" /></a>
            </div>
          </div>
        </header>
        <Table/>
        <span className="btnCreate" onClick={this.create}><FontAwesomeIcon icon="plus" /> <span>Добавить запись </span> </span>
        {this.state.btnUp && <span className="btnUp" onClick={this.autoScroll}><FontAwesomeIcon icon="arrow-circle-up" /></span>}
      </div>
    );  
  }
}


function mapStateToProps(state) {return {}}

const connectedTable = connect(mapStateToProps)(App);
export { connectedTable as  App};