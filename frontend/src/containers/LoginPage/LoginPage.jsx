import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Button, Form, Grid, Header, Message, Segment} from "semantic-ui-react";

import {authActions, validatorActions} from '../../actions';

export class LoginContainer extends Component {
  state = {email: '', password: '', submitted: false};
  schema = {
    "required": ["email", "password"],
    "properties": {
      "email": {
        "title": "Email",
        "type": "string",
        "format": "email",
        "minLength": 5,
        "maxLength": 255
      }, "password": {
        "title": "Password",
        "type": "string",
        "minLength": 8,
        "maxLength": 1024
      }
    }
  };

  handleChange = (e, {name, value}) => {
    this.props.validateInput(this.schema, name, value);
    this.setState({[name]: value});
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({submitted: true});
    const {email, password} = this.state;
    await this.props.validateForm(this.schema, {email, password});
    this.setState({submitted: false});
    if (!this.props.valid) return;
    await this.props.login(email, password);
  };

  render() {    
    const {loggingIn, errors, alert} = this.props;
    const {email, password, submitted} = this.state;
    return (
      <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
        <Grid.Column style={{maxWidth: 450}}>
          <Header as='h2' color='teal' textAlign='center'>Log-in to your account</Header>
          {alert && alert.header &&
          <Message error={alert.type === 'error'} success={alert.type === 'success'}
                   header={alert.header} content={alert.content}/>}
          <Form loading={loggingIn || submitted} size='large' onSubmit={this.handleSubmit}>
            <Segment>
              <Form.Input name='email' size='large' icon='mail' iconPosition='left'
                          placeholder='john.adams@email.com' value={email} onChange={this.handleChange}
                          error={errors && errors.email}/>

              <Form.Input name='password' size='large' icon='lock' iconPosition='left' placeholder='Password'
                          value={password} type='password' onChange={this.handleChange}
                          error={errors && errors.password}/>

              <Button color='teal' fluid>Login</Button>
            </Segment>
          </Form>
          {/* removed due to invitation */}
          {/*<Message>Don't have an account? <Link to='/register'>Register</Link></Message>*/}
        </Grid.Column>
      </Grid>
    );
  }
}

function mapState(state) {
  const {alert} = state;
  const {loggingIn} = state.authentication;
  const {valid, errors} = state.validation;
  return {loggingIn, valid, errors, alert};
}

const actionCreators = {
  login: authActions.login,
  validateInput: validatorActions.validateInput,
  validateForm: validatorActions.validateForm,
};

const connectedLoginPage = connect(mapState, actionCreators)(LoginContainer);
export {connectedLoginPage as LoginPage};
