import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { OTPProps } from '../../../interfaces';

export default function PrivateRoute({ children, ...rest }:OTPProps) {

  const auth = localStorage.getItem('OTP_TOKEN');

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
