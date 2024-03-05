sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "br/com/gestao/fioriappadmin2342/util/Formatter",    
    "sap/ui/core/Fragment"    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator,Formatter, Fragment) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappadmin2342.controller.Lista", {

            objFormatter: Formatter,

            onInit: function () {
              //debugger;
            //    var oConfiguration = sap.ui.getCore().getConfiguration();
            //    oConfiguration.setFormatLocale("en_US");

            },
            onSearch: function(){
                var oProdutoInput       = this.getView().byId("productIdIput");
                var oProdutoNameInput   = this.getView().byId("productNameIput");
 
                var oFilter = new Filter({
                    filters: [
                        new Filter("Productid", FilterOperator.Contains, oProdutoInput.getValue()),
                        new Filter("Name", FilterOperator.Contains, oProdutoNameInput.getValue())
                    ],
                    and: true
                });
 
                var oTable = this.getView().byId("tableProdutos");
                var oBinding = oTable.getBinding("items");
 
                oBinding.filter(oFilter);
            },
            onRouting: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Detalhes");
            },                            
            onSelectItem: function (evt) {
                var oProductId = evt.getSource().getBindingContext().getProperty("Productid");

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Detalhes",{
                    productId: oProductId
                });
            },
            onCategoria: function (oEvent){
                debugger;
                this._oInput = oEvent.getSource().getId();
                var oView = this.getView();

                if (!this._CategoriaSearchHelp) {
                    this._CategoriaSearchHelp = Fragment.load({
                        id: oView.getId(),
                        name: "br.com.gestao.fioriappadmin2342.frags.SH_Categorias",
                        controller: this
                    }).then(function(oDialog){
                        oView.addDependent(oDialog);
                        return oDialog;                                                
                    });
                }
                this._CategoriaSearchHelp.then(function(oDialog){
                    oDialog.getBinding("items").filter([]);
                    oDialog.open();                        
                })                
            }
        });
    });
 
