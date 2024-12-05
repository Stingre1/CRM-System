import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!currentUser) {
          return <useNavigate to="/login" />;
        }

        if (roles && !roles.includes(currentUser.role)) {
          return <useNavigate to="/" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;

