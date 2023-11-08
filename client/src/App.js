// npm install react-router-dom
// npm install react-bootstrap
// npm install bootstrap
// npm install react-icons
// npm install styled-component


import React from 'react';
// import {BrowserRouter} from "react-router-dom";
import { BrowserRouter } from "react-router-dom"
import Header from './page/header/Header';
import Router from './routes/Router';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (

    <BrowserRouter basename= {process.env.PUBLIC_URL}>
        <Header />
        <Router />
    </BrowserRouter>

  )
}

export default App