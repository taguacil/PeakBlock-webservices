import {Message} from "semantic-ui-react";
import React from "react";

export const alertService = {
  getAlerts,
};

function getAlerts(alert) {
  return (
    alert && alert.header &&
    <Message error={alert.type === 'error'} success={alert.type === 'success'}
             header={alert.header} content={alert.content}/>
  );
}
