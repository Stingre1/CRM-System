import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LeadManagement from './components/LeadManagement';
import UserManagement from './components/UserManagement';
import Reports from './components/Reports';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Navigation />
      <Container>
        <Switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute path="/leads" component={LeadManagement} />
          <PrivateRoute path="/users" component={UserManagement} />
          <PrivateRoute path="/reports" component={Reports} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;

