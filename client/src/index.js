import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css'; // This file is optional, but you can add some basic styling here
import App from './App'; // Ensure you have an App component (it should be created by default)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // This will reference the div with id 'root' in your public/index.html
);
