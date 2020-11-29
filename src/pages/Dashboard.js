import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import '../index.css'
import Login from './Login';
import Clientes from './Clientes'
import Painel from './Logs'
import Logs from './Painel'

import Sidenav from '../components/Sidenav'
import NavBar from "../components/NavBar";
import Tools from '../tools/tools';

class DashBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usuario: {},
            value: '',

            loading: false,
            finish_search: false,
            logado: true
        };

    }



    componentDidMount() {


        const usuario = JSON.parse(localStorage.getItem("usuario"))
        this.setState({ usuario })


    }



    render() {


        return (
            <>
                <NavBar usuario={this.state.usuario} />
                <div class="container admin" >
                    <div class="row">
                        <div class="col m1 l1">
                            <Sidenav usuario={this.state.usuario} />
                        </div>
                        <div class="col s12 m11 l11">
                            <Switch >
                                <Route path="/clientes" component={Clientes} exact />


                                {/* <Route path="/clientes/configuracao" component={() => <Edit_Configuracao usuario={this.state.usuario} />} exact /> */}
                            </Switch>
                        </div>
                    </div>
                </div>
            </>)

    }


}
export default DashBoard;