import { useAlert } from "react-alert";
import { connect } from 'react-redux';

const AlertComp = props  => { 

    const alert = useAlert();
    
    if (props.alert)
        switch (props.alert.type) {
            case "success":
                alert.success(props.alert.message);
                break
            case "error":
                alert.error(props.alert.message);
                break
            case "info":
                alert.show(props.alert.message);
                break
            default:
                break
        }

    
    return null

};
  

function mapStateToProps(state) {
  const { alert } = state;
  return {
    alert
  };
}

const connectedAlertComp = connect(mapStateToProps)(AlertComp);
export { connectedAlertComp as  AlertComp};