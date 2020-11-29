import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Login from './pages/Login'
import DashBoard from './pages/Dashboard'



export default function Routes() {

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Login} exact />
                <Route path="/clientes" component={DashBoard} />



            </Switch>
        </BrowserRouter>
    );
}