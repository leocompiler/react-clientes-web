import React, { Component } from 'react';
import M from "materialize-css";
import api from '../connection/api';
import Tools from '../tools/tools'

class Clientes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      itens: [],
      categorias: [],
      medidas: [],
      item: {},
      perfis: [],
      finish_search: false,
      logado: true,
      pagina: 1
    };
    this.handleInputChange = this.handleInputChange.bind(this);




  }


  componentDidMount() {
    this.request()
    this.request_perfil()
  }
  componentDidUpdate() { }

  async request_perfil() {
    try {

      const perfis = JSON.parse(localStorage.getItem('usuario_perfil'))
      if (perfis) {
        return this.setState({ perfis })
      }
      const response = await api.get('/api/admin/perfis', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_user')}`
        }
      })
      if (response.status == 200) {
        localStorage.setItem('usuario_perfil', JSON.stringify(response.data));

        return this.setState({ perfis: response.data })
      }
      console.log(response)
    } catch (error) {
      M.toast({ html: error })
      return console.log(error);
    }

  }
  async request() {
    try {


      const response = await api.get('/api/admin/usuarios', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_user')}`
        }
      })
      if (response.status == 200) return this.setState({ itens: response.data })
      console.log(response)
    } catch (error) {
      M.toast({ html: error })
      return console.log(error);
    }

  }

  async services_nova_senha({ id, senha }) {


    try {
      const response = await api.put('/api/admin/usuarios/senha', { id, senha }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_user')}`
        }
      })
      if (response.status == 200) {
        this.close_Modal("modal_nova_senha")
        return this.request()
      }
    } catch (error) {
      console.log(error.response)
      return M.toast({ html: Tools.getErroByServices(error) })
    }

  }

  async services_create(item) {

    try {
      const response = await api.post('/api/admin/usuarios', item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_user')}`
        }
      })
      if (response.status == 200) {
        this.request()
        return M.toast({ html: "registrado." })

      }
    } catch (error) {
      return M.toast({ html: Tools.getErroByServices(error) })
    }
  }

  async services_update(item) {

    let response = {}
    try {
      response = await api.put('/api/admin/usuarios', item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_user')}`
        }
      })
      if (response.status == 200) {
        this.close_Modal("modal_edit")
        return this.request()
      }
    } catch (error) {
      this.request();
      return M.toast({ html: Tools.getErroByServices(error) })
    }

  }
  async services_delete(item) {
    let data = JSON.stringify({ id: item.id })
    try {
      const response = await api.delete('/api/admin/usuarios', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_user')}`
        },
        params: data
      })
      if (response.status == 200) {
        await this.request()
      }
    } catch (error) {
      return M.toast({ html: Tools.getErroByServices(error) })
    }
  }

  async services_image(imagem, item) {
    if (!imagem || !item) {
      return
    }
    var formData = new FormData();

    formData.append("thumbnail", imagem);
    try {
      const response = await api.post('/api/storage/thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token_user')}`
        }
      })
      if (response.status == 200) {
        const photo_url = response.data.thumbnail.url
        await this.services_update({ id: item.id, photo_url })
        this.request()
        this.close_Modal('modal_thumbnail')
        return M.toast({ html: "registrado." })
      }
    } catch (error) {
      return M.toast({ html: Tools.getErroByServices(error) })
    }

  }



  open_Modal(type, item) {
    document.querySelectorAll("input").forEach(i => i.value = '')
    document.querySelectorAll("select").forEach(i => i.value = '')
    document.querySelectorAll("textarea").forEach(i => i.value = '')

    this.setState({ item: {} })
    this.setState({ item: item })
    const elem = document.getElementById(type);
    const instance = M.Modal.init(elem, {
      dismissible: true,
      onOpenEnd: function () {
        var elems = document.querySelectorAll('select');
        M.FormSelect.init(elems, {});
        console.log("onOpenEnd")
      }

    });
    return instance ? instance.open() : 0;
  }

  close_Modal(type) {
    this.setState({ item: {}, item_create: {}, item_edit: {} })
    const elem = document.getElementById(type);
    const instance = M.Modal.init(elem, {});
    return instance ? instance.close() : 0;
  }


  detalhes(item) {
    return (
      <tr key={item.id}>
        <td onClick={() => { this.open_Modal('modal_thumbnail', item) }} ><img width='30' height='30' class="circle" src={item.photo_url} /></td>

        <td onClick={() => { this.open_Modal('modal_edit', item) }}>{String(item.id).padStart(4, '0')}</td>
        <td onClick={() => { this.open_Modal('modal_edit', item) }} > <span className={(!item.ativo ? 'red-text text-accent-4' : 'green-text')} >{item.nome} </span></td>
        <td onClick={() => { this.open_Modal('modal_edit', item) }}>{item.numeroTelefonico}</td>
        <td onClick={() => { this.open_Modal('modal_edit', item) }}>{item.email}</td>

      </tr>
    )
  }


  handleInputChange(event) {
    const { item } = this.state
    const target = event.target;

    const value = target.type === 'checkbox' ? target.checked : target.value;
    item.ativo = value
    this.setState({ item })

  }

  mudar_pagina(valor) {
    return this.setState((state) => ({
      pagina: state.pagina + valor
    }));
  }


  modal_nova_senha() {
    let { item } = this.state;
    let senha, confimarSenha

    var elems = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(elems, {});

    return (
      <div id="modal_nova_senha" class="modal">
        <div class="modal-content">
          <div class="row">
            <h5 class="left-align">{item.nome}</h5>
          </div>
          <div class="section row">
            <form action="#">

              <div class="input-field col s12 m4">
                <input
                  class="input-group form-control"
                  value={senha}
                  onChange={e => senha = e.target.value}
                />
                <label class="active" for="last_name">Senha</label>
              </div>
              <div class="input-field col s12 m4">
                <input
                  class="input-group form-control"
                  value={confimarSenha}
                  onChange={e => { confimarSenha = e.target.value }}
                />
                <label class="active" for="last_name">Confirmar senha</label>
              </div>



            </form>
          </div>

        </div>
        <div class="modal-footer">
          <a class="waves-effect waves-green btn-flat" onClick={() => this.close_Modal('modal_thumbnail')}>Voltar</a>
          <a class="waves-effect waves-green btn-flat" onClick={() => this.services_nova_senha({ id: item.id, senha })}>Salvar</a>
        </div>

      </div>
    )
  }
  modal_thumbnail() {
    let { item } = this.state;

    var elems = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(elems, {});

    return (
      <div id="modal_thumbnail" class="modal">
        <div class="modal-content">
          <div>
            <h5 class="center-align">{item.nome}</h5>
          </div>
          <div class="row">
            <form action="#">
              <div class="file-field input-field col s12 m12 center-align">
                <img src={item.imagem_url} alt="" class="materialboxed img-middle " />
                <div style={{ float: 'unset' }} class="btn-floating btn-large waves-effect waves-light red ">
                  <i class="fas fa-camera-retro"></i>
                  <input type="file" accept="image/png, image/jpeg" onChange={(e) => this.services_image(e.target.files[0], item)} />
                </div>
              </div>



            </form>
          </div>

        </div>
        <div class="modal-footer">
          <a class="waves-effect waves-green btn-flat" onClick={() => this.close_Modal('modal_thumbnail')}>Voltar</a>
        </div>

      </div>
    )
  }
  modal_edit() {

    let { item } = this.state;

    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('.chips');
      var instances = M.Chips.init(elems,
        { placeholder: "Tags" }
      );
    });

    return (
      <div id="modal_edit" class="modal modal-fixed-footer">
        <div class="modal-content">
          <h4>{item.nome}</h4>

          <div class="row">
            <form action="#">

              <div className={'input-field col s12 m12 ' + (!item.id ? 'hide' : '')} >
                <div class="switch">
                  <label> Off <input type="checkbox" checked={item.ativo ? true : false} onChange={this.handleInputChange} /> <span class="lever"> </span> On </label>
                </div>
                <label class="active">Login ativo ?</label>

              </div>

              <div class="input-field col s12 m4">
                <input
                  class="input-group form-control"
                  value={item.nome}
                  onChange={e => { item.nome = e.target.value; this.setState({ item }) }}
                />
                <label class="active" for="last_name">Nome</label>
              </div>
              <div class="input-field col s12 m6">
                <input
                  class="input-group form-control"
                  value={item.email}
                  onChange={e => { item.email = e.target.value; this.setState({ item }) }}
                />
                <label class="active" for="last_name">Email</label>
              </div>
              <div class="input-field col s12 m3">
                <input
                  class="input-group form-control"
                  value={item.numeroTelefonico}

                  onChange={e => { item.numeroTelefonico = e.target.value; this.setState({ item }) }}
                />
                <label class="active" for="last_name">Numero telefonico</label>
              </div>
              <div class="input-field col s12 m6">
                <select defaultValue={''} value={item.perfil_id} onChange={e => (item.perfil_id = e.target.value)} multiple>

                  {this.state.perfis.map(item => {
                    return (<option key={item.perfil_id} value={item.perfil_id} > {item.perfil} </option>)
                  })}


                </select>
                <label>Perfil</label>
              </div>
              <div class="input-field col s12 m2">
                <input
                  type="number"
                  min="4"
                  max="4"
                  class="input-group form-control"
                  value={item.pin}
                  onChange={e => { item.pin = e.target.value; this.setState({ item }) }}
                />
                <label class="active" for="last_name">Senha Pin</label>
              </div>
              <div className={'input-field col s12 m4 ' + (item.id ? 'hide' : '')}>
                <input
                  class="input-group form-control"
                  value={item.senha}
                  onChange={e => { item.senha = e.target.value; this.setState({ item }) }}
                />
                <label class="active" for="last_name">Senha</label>
              </div>


            </form>
          </div>

        </div>
        <div class="modal-footer">
          <a className={'modal-close waves-effect waves-green btn-flat left ' + (!item.id ? 'hide' : '')} onClick={() => this.services_delete(item)}>Descartar</a>
          <a className={'modal-close waves-effect waves-green btn-flat left ' + (!item.id ? 'hide' : '')} onClick={() => this.open_Modal('modal_nova_senha', item)}>Nova Senha</a>

          <a class="modal-close waves-effect waves-green btn-flat">Voltar</a>
          <a className="modal-close waves-effect waves-red btn-flat" onClick={() => {
            item.id ? this.services_update(item) : this.services_create(item)
          }}> Salvar </a>
        </div>

      </div>
    )
  }

  render() {
    return (
      <>
        <main>
          <div class="card" >
            <ul class="collection with-header">
              <li class="collection-item">
                <div>
                  <span>Cadastro de login de acesso único a plataforma.</span>

                  <a class="secondary-content"><i
                    style={{ cursor: "pointer" }}
                    onClick={() => { this.open_Modal('modal_edit', {}) }} class="material-icons small">add</i></a>
                </div>
              </li>
            </ul>
            <table class="striped  responsive-table ">
              <thead>
                <tr>
                  <th>    </th>
                  <th><a onClick={() => Tools.ordernarAZ(this, this.state.itens, 'id')}>Código</a></th>
                  <th><a onClick={() => Tools.ordernarAZ(this, this.state.itens, 'nome')}>Nome</a></th>
                  <th><a onClick={() => Tools.ordernarAZ(this, this.state.itens, 'numeroTelefonico')}>Telefone</a></th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {this.state.itens.map((item) => {
                  return this.detalhes(item)
                })}
              </tbody>
            </table>
            <div class="row" >
              <ul class="pagination right">
                {this.state.pagina < 2 ? <li class="disabled"><a><i class="material-icons" style={{ color: "transparent" }} >chevron_left</i></a></li>
                  : <li class="waves-effect"><a onClick={() => { if (this.state.pagina > 1) return this.mudar_pagina(-1) }}><i class="material-icons">chevron_left</i></a></li>
                }
                <li class="waves-effect"><a onClick={() => { if (this.state.pagina > 1) return this.mudar_pagina(-1) }}>{(this.state.pagina - 1)}</a></li>
                <li class="active"><a >{(this.state.pagina)}</a></li>
                <li class="waves-effect"><a onClick={() => this.mudar_pagina(1)}>{(this.state.pagina + 1)}</a></li>
                <li class="waves-effect"><a onClick={() => this.mudar_pagina(2)}>{(this.state.pagina + 2)}</a></li>
                <li class="waves-effect"><a onClick={() => this.mudar_pagina(3)}>{(this.state.pagina + 3)}</a></li>
                <li class="waves-effect"><a onClick={() => this.mudar_pagina(4)}>{(this.state.pagina + 4)}</a></li>
                <li class="waves-effect"><a onClick={() => this.mudar_pagina(+1)} ><i class="material-icons">chevron_right</i></a></li>
              </ul>
            </div>

          </div>
        </main>
        {this.modal_edit()}
        {this.modal_thumbnail()}
        {this.modal_nova_senha()}
      </>
    )
  }
}

export default Clientes;


