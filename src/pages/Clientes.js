import React, { Component } from 'react';
import M from "materialize-css";
import api from '../connection/api';
import Tools from '../tools/tools'
import IMask from 'imask';

class Clientes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      itens: [],
      categorias: [],
      medidas: [],
      item: {},
      endereco: {},
      email: {},
      telefone: {},
      perfis: [],
      finish_search: false,
      logado: true,
      pagina: 1
    };
    this.handleInputChange = this.handleInputChange.bind(this);




  }


  componentDidMount() {
    this.request()
    // this.request_perfil()
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


      const response = await api.get('/clientes', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token_user')}`
        }
      })
      if (response.status == 200) return this.setState({ itens: response.data })
      console.log(response)
    } catch (error) {
      M.toast({ html: error })
      return this.setState({ logado: false })

    }

  }

  async services_telefone({ cliente, numero, tipoTelefone }) {


    try {
      const response = await api.post('/telefones', { cliente, numero, tipoTelefone }, {
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
      return M.toast({ html: error })
    }

  }
  async services_email({ cliente, email }) {


    try {
      const response = await api.post('/email', { cliente, email }, {
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
      return M.toast({ html: error })
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
      console.log(error.response)
      return M.toast({ html: error })
    }
  }
  async service_get_cep(cep) {
    try {
      let { endereco } = this.state

      if (cep.length < 8) {
        if (endereco.cep.length == 8) {
          endereco = {}
          this.setState({ endereco })
          document.querySelectorAll("input").forEach(i => i.value = '')

        }
        return cep
      }



      const url = 'https://viacep.com.br/ws/' + cep + '/json/'
      const response = await api.get(url, {
        headers: { 'Content-Type': 'application/json' }
      })
      if (response.status == 200) {
        const retorno = response.data
        endereco = {
          "cep": retorno.cep.replace("-", ""),

          "logradouro": retorno.logradouro,
          "bairro": retorno.bairro,
          "cidade": retorno.localidade,
          "uf": retorno.uf
        }
        this.setState({ endereco })
        return cep
      }


    } catch (error) { console.log(error) }

  }




  open_Modal(type, item) {
    let ctx = this
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


        var inputCpf = IMask(document.getElementById("cpfInput"), {
          mask: '000.000.000-00',
          maxLength: 11
        });
        inputCpf.on("complete", function () {
          const cpf = inputCpf.unmaskedValue
          ctx.state.item.cpf = cpf
          ctx.setState({ item: item })

        });
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
        <td onClick={() => { this.open_Modal('modal_edit', item) }}>{item.cpf}</td>
        <td onClick={() => { this.open_Modal('modal_edit', item) }}>{item.telefones.length > 0 ? item.telefones[0].numero : '-'}</td>
        <td onClick={() => { this.open_Modal('modal_edit', item) }}>{ item.emails.length> 0 ? item.emails[0].email : '-'}</td>
        <td>
          <a class="btn-floating " style={{ margin: '0 16px' }} onClick={() => this.open_Modal('modal_telefones', item)} >
            <i class="material-icons" style={{ color: "white" }}>  settings_phone </i>
          </a>
          <a class="btn-floating red" onClick={() => this.open_Modal('modal_emails', item)}>
            <i class="material-icons" style={{ color: "white" }}> mail </i>
          </a>

        </td>
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


  modal_telefones() {
    let { item, telefone } = this.state;
    telefone.cliente = { id: item.id }
    var elems = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(elems, {});

    return (
      <div id="modal_telefones" class="modal">
        <div class="modal-content">
          <div class="row">
            <h5 class="left-align">{item.nome}</h5>
          </div>
          <div class="section row">
            <form action="#">

              <div class="input-field col s12 m4">
                <select value={telefone.tipoTelefone}
                  onChange={e => {
                    telefone.tipoTelefone = e.target.value;
                    this.setState({ telefone })
                  }}>
                  <option value="" selected>Selecione</option>
                  <option value="CELULAR">CELULAR</option>
                  <option value="RESIDENCIAL">RESIDENCIAL</option>
                  <option value="COMERCIAL">COMERCIAL</option>
                </select>
                <label>Selecione um tipo de telefone</label>
              </div>
              <div class="input-field col s12 m4">
                <input
                  class="input-group form-control"
                  value={telefone.numero}
                  placeholder="00 0000 0000"
                  onChange={e => {
                    telefone.numero = e.target.value;
                    this.setState({ telefone })
                  }}
                />
                <label class="active" for="last_name">Numero Telefonico</label>
              </div>



            </form>
          </div>

        </div>
        <div class="modal-footer">
          <a class="waves-effect waves-green btn-flat" onClick={() => this.close_Modal('modal_telefones')}>Voltar</a>
          <a class="waves-effect waves-green btn-flat" onClick={() => this.services_telefone(telefone)}>Salvar</a>
        </div>

      </div>
    )
  }
  modal_emails() {
    let { item, email } = this.state;
    email.cliente = { id: item.id }
    var elems = document.querySelectorAll('.materialboxed');
    M.Materialbox.init(elems, {});

    return (
      <div id="modal_emails" class="modal">
        <div class="modal-content">
          <div class="row">
            <h5 class="left-align">{item.nome}</h5>
          </div>
          <div class="section row">
            <form action="#">


              <div class="input-field col s12 m12">
                <input
                  class="input-group form-control"
                  value={email.email}
                  placeholder="email@email.email"
                  onChange={e => {
                    email.email = e.target.value;
                    this.setState({ email })
                  }}
                />
                <label class="active" for="last_name">Email</label>
              </div>



            </form>
          </div>

        </div>
        <div class="modal-footer">
          <a class="waves-effect waves-green btn-flat" onClick={() => this.close_Modal('modal_emails')}>Voltar</a>
          <a class="waves-effect waves-green btn-flat" onClick={() => this.services_email(email)}>Salvar</a>
        </div>

      </div>
    )
  }
  modal_edit() {

    let { item, endereco } = this.state;

    endereco = item.endereco ? item.endereco : endereco


    document.addEventListener('DOMContentLoaded', function () {
      var elems = document.querySelectorAll('.chips');
      var instances = M.Chips.init(elems,
        { placeholder: "Tags" }
      );
    });
    return !item ? (<></>) :
      (
        <div id="modal_edit" className={"modal " + (item.id ? 'modal-fixed-footer' : '')}>
          <div class="modal-content">
            <h4>{item.nome}</h4>

            <form action="#">

              <div class="row">
                <div class="input-field col s12 m6">
                  <input
                    disabled={(item.id) ? "disabled" : ""}
                    class="input-group form-control"
                    value={item.nome}
                    onChange={e => { item.nome = e.target.value; this.setState({ item }) }}
                  />
                  <label class="active" for="last_name">Nome</label>
                </div>
                <div class="input-field col s12 m6">
                  <input
                    id="cpfInput"
                    disabled={(item.id) ? "disabled" : ""}
                    class="input-group form-control"
                    type="text"
                    value={item.cpf}
                    onChange={e => { item.cpf = e.target.value; this.setState({ item }) }}

                  />
                  <label class="active" for="last_name">Cpf</label>
                </div>


                <div class="input-field col s12 m6">
                  <input
                    disabled={(item.id) ? "disabled" : ""}
                    class="input-group form-control"
                    type="number"
                    value={endereco.cep}
                    onChange={e => { this.service_get_cep(e.target.value) }} />
                  <label class="active" for="last_name">Cep</label>
                </div>
                <div class="input-field col s12 m6">
                  <input
                    disabled={(item.id) ? "disabled" : ""}
                    class="input-group form-control"
                    value={endereco.complemento}

                    onChange={e => { endereco.complemento = e.target.value; this.setState({ endereco }) }} />
                  <label class="active" for="last_name">Complemento</label>
                </div>


                <div class="input-field col s12 m4">
                  <input
                    disabled={(item.id) ? "disabled" : ""}
                    class="input-group form-control"
                    value={endereco.logradouro}

                    onChange={e => { endereco.logradouro = e.target.value; this.setState({ endereco }) }} />
                  <label class="active" for="last_name">Logradouro</label>
                </div>

                <div class="input-field col s12 m3">
                  <input
                    disabled={(item.id) ? "disabled" : ""}
                    class="input-group form-control"
                    value={endereco ? endereco.bairro : ''}

                    onChange={e => { endereco.bairro = e.target.value; this.setState({ endereco }) }} />
                  <label class="active" for="last_name">Bairro</label>
                </div>

                <div class="input-field col s12 m3">
                  <input
                    disabled={(item.id) ? "disabled" : ""}
                    class="input-group form-control"
                    value={endereco.cidade}

                    onChange={e => { endereco.cidade = e.target.value; this.setState({ endereco }) }} />
                  <label class="active" for="last_name">Cidade</label>
                </div>

                <div class="input-field col s12 m2">
                  <input
                    disabled={(item.id) ? "disabled" : ""}
                    class="input-group form-control"
                    value={endereco.uf}

                    onChange={e => { endereco.uf = e.target.value; this.setState({ endereco }) }} />
                  <label class="active" for="last_name">UF</label>
                </div>


              </div>

            </form>
            <div className={'section ' + (!item.id ? 'hide' : '')} >
              {this.modal_edit_telefones()}
              {this.modal_edit_emails()}
            </div>
          </div>
          <div class="modal-footer">
            <a className={'modal-close waves-effect waves-green btn-flat left ' + (!item.id ? 'hide' : '')} onClick={() => this.open_Modal("modal_telefones", item)}>TELEFONES</a>
            <a className={'modal-close waves-effect waves-green btn-flat left ' + (!item.id ? 'hide' : '')} onClick={() => this.open_Modal("modal_emails", item)}>EMAILS</a>


            <a class="modal-close waves-effect btn-flat">Voltar</a>
            <a className={'modal-close waves-effect  btn-flat ' + (item.id ? 'hide' : '')} onClick={() => {
              item.endereco = endereco
              this.setState({ item })
              item.id ? this.services_update(item) : this.services_create(item)
            }}> Salvar </a>
          </div>

        </div>
      )
  }

  modal_edit_telefones() {
    let { telefones } = this.state.item
    return (
      <>
        <table class="striped  responsive-table ">
          <thead>
            <tr>
              <th><a onClick={() => Tools.ordernarAZ(this, telefones, 'tipoTelefone')}>Tipo</a></th>
              <th><a onClick={() => Tools.ordernarAZ(this, telefones, 'numero')}>Número</a></th>
              <th>Registrado</th>
            </tr>
          </thead>
          <tbody>
            {!telefones ? '' : telefones.map((item) => {
              return (
                <tr key={item.id}>
                  <td> {item.tipoTelefone} </td>
                  <td>{item.numero}</td>
                  <td>{Tools.DataFormat(item.createdAt)}</td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    )
  }

  modal_edit_emails() {
    let { emails } = this.state.item
    return (
      <>
        <table class="striped  responsive-table ">
          <thead>
            <tr>
              <th><a onClick={() => Tools.ordernarAZ(this, emails, 'tipoTelefone')}>Email</a></th>
              <th>Registrado</th>
            </tr>
          </thead>
          <tbody>
            {!emails ? '' : emails.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.email}</td>
                  <td>{Tools.DataFormat(item.createdAt)}</td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    )
  }

  render() {
    const { logado } = this.state
    if (!logado) {
      localStorage.clear()
      this.props.history.push('/');
      return (<></>)
    } else
      return (
        <>
          <main>
            <div class="card" >
              <ul class="collection with-header">
                <li class="collection-item">
                  <div>
                    <span>Cadastro de clientes</span>

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
                    <th><a onClick={() => Tools.ordernarAZ(this, this.state.itens, 'cpf')}>CPF</a></th>
                    <th>Telefone</th>
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
          {this.modal_telefones()}
          {this.modal_emails()}
        </>
      )
  }
}

export default Clientes;


