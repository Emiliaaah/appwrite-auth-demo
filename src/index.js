import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router } from  'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
      <Router>
    <AuthProvider>
        <App />
    </AuthProvider>
      </Router>
  </React.StrictMode>,
  document.getElementById('root')
);