import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import M from "materialize-css";



function NavBarAdm(props) {
    const history = useHistory();

    useEffect(() => {
        var elems = document.querySelectorAll('.sidenav');
        var instances = M.Sidenav.init(elems, {});
 
        
    })

    return (

        <div class="navbar-fixed" >
            <nav class="nav-extended black" >
                <div class="navbar-fixed" >
                    <nav class="nav-extended black" >
                        <div class="nav-wrapper"  >
                            <a href="#" data-target="slide-out" class="sidenav-trigger"><i class="material-icons">menu</i></a>

                            <a class="brand-logo black center hide-on-small-only" onClick={() => history.push("/display/produtores")}>Clientes Surittec</a>
                            <ul class="right hide-on-med-and-down">
                                <li><a href="sass.html"><i class="material-icons">search</i></a></li>
                                <li><a href="badges.html"><i class="material-icons">view_module</i></a></li>
                                <li><a href="collapsible.html"><i class="material-icons">refresh</i></a></li>
                                <li><a href="mobile.html"><i class="material-icons">more_vert</i></a></li>
                            </ul>
                        </div>
                    </nav>
                </div>

            </nav>

        </div>
    );




}

export default NavBarAdm;

