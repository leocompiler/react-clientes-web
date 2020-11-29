import React, { useState, useEffect, Component } from 'react';
import logo from '../assets/undraw_Done_checking_re_6vyx.png';

import { useHistory } from "react-router-dom";
import api from '../connection/api';
import qs from 'qs'
import M from "materialize-css";
import Tools from "../tools/tools"
import { data } from 'jquery';


function Login() {
    const [logado, setLogado] = useState(true)
    const [permission, SetPermission] = useState(false)
    const [password, setPassword] = useState("")
    const [username, setUserName] = useState("")

    const history = useHistory();

    useEffect(() => {
        // document.onkeypress = function (evt) {
        //     //  console.log(evt)
        //     if (evt.key === 'Enter') {
        //         auth_token()
        //     }
        // }
    })



    async function authentication_login() {
        try {
            if (username == "") return M.toast({ html: 'preencha o username' });
            if (password == "") return M.toast({ html: 'preencha sua senha' });


            const requestBody = {
                grant_type: 'password',
                username: username,
                password: password
            }
            var credentials = btoa("surittec" + ':' + "surittec@321");
            const basicAuth = 'Basic ' + credentials
            const config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    'Authorization': basicAuth
                }
            }

            let login = await api.post('/oauth/token', qs.stringify(requestBody), config).catch(err => { console.log( err )
                if (err.response.status === 404) {
                  throw new Error(`${err.config.url} not found`);
                }
                throw err;
              });

            SetPermission(true);
            const token = login.data.access_token
            localStorage.setItem('token_user', token);
            usuarioDetail( token )


        } catch (error) {
            localStorage.clear()
            console.log( error )
            M.toast({ html: error })
        }

  
    }

    async function usuarioDetail(token) {
        if (permission) {
            return (
                <div class="div-loader">
                    <div class="c-loader"></div>
                </div>
            )
        }

             api.get('/login', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+ token
                }
            }).then((user) => {
                localStorage.setItem('usuario', JSON.stringify(user.data));
                return history.push("/clientes")


            })
            .catch((err) => {
                localStorage.clear()
                return setLogado(false)
            })
       
    }

    return (
        <>
            <div class="login forms">
                <div class="row">
                    <div class="col m3 l4"></div>
                    <div class="col s12 m6 l4">
                        <div class="card hoverable" >

                            <div class="card-content logo">
                                <img src={logo} width="100%" />
                            </div>
                            <div class="center">
                                <pre style={{ color: '#6c63ff'}}>Digite o Username e a Senha.</pre>
                            </div>
                            <div class="card-content lighten-4 row">
                                <div class="input-field col s12">
                                    <input
                                        class="input-group form-control"
                                        placeholder=""
                                        type="text"
                                        value={username}
                                        onChange={e => setUserName(e.target.value)}
                                    />
                                    <label class="active" for="last_name">Username</label>
                                </div>

                                <div class="input-field password col s12">


                                    <input
                                        class="input-group form-control"
                                        type="password"
                                        placeholder=""
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        onKeyPress={event => {
                                            if (event.key === 'Enter') {
                                                authentication_login()
                                            }
                                        }}
                                    />
                                    <label class="active" for="last_name">Senha</label>

                                </div>
                            </div>
                            <div class="card-action">
                                <a class="color_secundaria" onClick={() => M.toast( { html : "Em desenvolvimento"})} >  Cadastre-se</a>
                                <a id="entryLogin" onClick={() => authentication_login()} > Entrar </a>
                            </div>
                        </div>
                        <div class="col s1 m3 l3"></div>

                    </div>

                </div>
            </div>

        </>
    );
}
 

export default Login;