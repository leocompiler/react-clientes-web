import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import M from "materialize-css";

function Sidenav(props) {

    const history = useHistory();

    useEffect(() => {
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.sidenav');
            var instances = M.Sidenav.init(elems, {});
        });
    })

    return (<>
        <ul id="slide-out" class="sidenav sidenav-fixed">
            <li>
                <div class="user-view grey darken-4">

                    <a href="#user" ><img class="circle" src={ props.usuario? props.usuario.photo_url : 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png'} /></a>
                    <a href="#name"><span class="white-text name"> {props.usuario ? props.usuario.nome : "Teste Teste"}</span></a>
                    <a href="#email"><span class="white-text email">{props.usuario ? props.usuario.email : "teste@teste.teste"}</span></a>
                </div>
            </li>

 
            <li><a href="/clientes"> <i class="fas fa-users"></i> Clientes</a></li>
 

            <li><div class="divider"></div></li>
            <li><a href="/display/adm/configuracao"><i class="fas fa-cogs"></i>Configuração</a></li>
            <li><a onClick={() => { localStorage.clear(); return history.push("/") }} ><i class="material-icons">power_settings_new</i>Sair</a></li>

        </ul>
    </>
    )
}
export default Sidenav;