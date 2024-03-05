sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "br/com/gestao/fioriappreport234/util/Formatter"            
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Formatter) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappreport234.controller.Lista", {
            
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
            }
        });
    });
 
