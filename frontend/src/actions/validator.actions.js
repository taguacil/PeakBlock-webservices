import {validatorConstants} from '../constants';
import {validatorService} from '../services';

export const validatorActions = {
  validateInput,
  validateForm,
  clear
};

function validateInput(schema, name, value) {
  return dispatch => {
    const errors = validatorService.validateInput(schema, name, value);
    if (errors) {
      const humanErrors = validatorService.buildHumanErrors(schema, errors);
      dispatch(failure(humanErrors));
    } else {
      dispatch(success(name));
    }
  };

  function success(input) {
    return {type: validatorConstants.INPUT_VALIDATE_SUCCESS, input}
  }

  function failure(errors) {
    return {type: validatorConstants.INPUT_VALIDATE_FAILURE, errors}
  }
}

function validateForm(schema, data) {
  return dispatch => {
    const errors = validatorService.validateForm(schema, data);
    if (errors) {
      const humanErrors = validatorService.buildHumanErrors(schema, errors);
      dispatch(failure(humanErrors));
    } else {
      dispatch(success());
    }
  };

  function success() {
    return {type: validatorConstants.FORM_VALIDATE_SUCCESS}
  }

  function failure(errors) {
    return {type: validatorConstants.FORM_VALIDATE_FAILURE, errors}
  }
}

function clear() {
  return {type: validatorConstants.CLEAR};
}
