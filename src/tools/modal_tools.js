export default class ModalTools {

    open_Modal(type, item) {
        this.setState({ item: {}, item_create: {} })
    
        document.querySelectorAll("input").forEach(i => i.value = '')
        document.querySelectorAll("select").forEach(i => i.value = '')
        document.querySelectorAll("textarea").forEach(i => i.value = '')
    
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


 
   


}