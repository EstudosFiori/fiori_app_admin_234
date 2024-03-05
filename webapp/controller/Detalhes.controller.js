sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "br/com/gestao/fioriappreport234/util/Formatter"
    ],
    function(BaseController,Formatter) {
      "use strict";
  
      return BaseController.extend("br.com.gestao.fioriappreport234.controller.Detalhes", {

        objFormatter: Formatter,

        onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Detalhes").attachMatched(this.onBindingProdutoDetalhes, this);
        },
        onBindingProdutoDetalhes: function(oEvent){
          //Capturando o parametro trafegado no Route Detalhes (productId)
          var oProduto = oEvent.getParameter("arguments").productId;

          //Objeto referente a View Detalhes
          var oView = this.getView();

          //Criar a URL de chamada da nossa entidade de Produtos
          var sURL = "/Produtos('" + oProduto + "')";

          oView.bindElement({
            path: sURL,
            parameters: { expand: 'to_cat' },
            events:{
              change: this.onBindingChange.bind(this),
              dataRequested: function(){
                oView.setBusy(true);
              },
              dataReceived: function(data){
                debugger;
                oView.setBusy(false);
              }
            }
          });

        },
        onBindingChange: function(oEvent){
            var oView = this.getView();
            var oElementBinding = oView.getElementBinding();

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

            //Se não existir um elemento (registro) válido eu farei uma ação:
            if (!oElementBinding.getBoundContext()) {
                oRouter.getTargets().display("objnotFound");
                return;
            }
        },
        onNavBack: function(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Lista")
        },

        });
    }
  );
  