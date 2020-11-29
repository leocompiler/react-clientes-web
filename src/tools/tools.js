export default class Tools {

  static MoedaConvert(  prefix, valor  ) {
    valor =  (valor != null)  ?  valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : 0
    if ( !prefix ){  valor = valor.replace('R$','') }
    return valor 
}

  static DataFormat( valor , separador) {
      
    var d = new Date(valor);
    separador = separador ? separador : "/"
    var datestring = String(d.getDate()).padStart(2,'0')  + separador + (d.getMonth()+1) + separador + d.getFullYear()   
    return datestring;
}

  static ordernarAZReturnLista(lista, nomeCampo) {

    const resultLista = nomeCampo == 'id' ? lista.reverse() : lista.sort(function (a, b) {
      if (a[nomeCampo] > b[nomeCampo]) {
        return 1;
      }
      if (a[nomeCampo] < b[nomeCampo]) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
    return resultLista
  }
  static ordernarAZ(ctx, lista, nomeCampo) {
    console.log("ordernarAZ " + nomeCampo)

    const resultLista = nomeCampo == 'id' ? lista.reverse() : lista.sort(function (a, b) {
      if (a[nomeCampo] > b[nomeCampo]) {
        return 1;
      }
      if (a[nomeCampo] < b[nomeCampo]) {
        return -1;
      }
      // a must be equal to b
      return 0;
    })
    ctx.setState({ itens: resultLista })
  }

  static isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
  }

  static getErroByServices( error ) {
    //error.response.data.erro[0].message
    if ( error && error.response && error.response.data ) {
      const errors = error.response.data.erro
      let message = errors[0].message
      message = message.replaceAll("_"," ");

      return message
    }
  }

}