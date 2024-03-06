sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "br/com/gestao/fioriappadmin234/util/Formatter",    
    "sap/ui/core/Fragment"    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator,Formatter, Fragment) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappadmin234.controller.Lista", {

            objFormatter: Formatter,

            onInit: function () {
            //debugger;
            //    var oConfiguration = sap.ui.getCore().getConfiguration();
            //    oConfiguration.setFormatLocale("en_US");

            },
            onSearch: function(){
                var oProdutoInput       = this.getView().byId("productIdIput");
                var oProdutoNameInput   = this.getView().byId("productNameIput");
                var oProdutoCategoryInput   = this.getView().byId("productCategoryIput");
 
                var objFilter = { filters: [], and: true };
                objFilter.filters.push(new Filter("Productid", FilterOperator.Contains, oProdutoInput.getValue()));
                objFilter.filters.push(new Filter("Name", FilterOperator.Contains, oProdutoNameInput.getValue()));
                objFilter.filters.push(new Filter("Category", FilterOperator.Contains, oProdutoCategoryInput.getValue()));

                var oFilter = new Filter(objFilter);

                // var oFilter = new Filter({
                //     filters: [
                //         new Filter("Productid", FilterOperator.Contains, oProdutoInput.getValue()),
                //         new Filter("Name", FilterOperator.Contains, oProdutoNameInput.getValue())
                //     ],
                //     and: true
                // });
 
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
                        name: "br.com.gestao.fioriappadmin234.frags.SH_Categorias",
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
            },

            onValueHelpSearch: function(oEvent){
                var sValue = oEvent.getParameter("value");

                // Opção 1 - Crio um único objeto filtro:
                // var oFilter = new Filter("Description", FilterOperator.Contains, sValue);
                // oEvent.getSource().getBinding("items").filter([oFilter]);

                // Opção 2 - Podemos criar um objeto (dinamico) onde adiciono várias propriedades:
                var objFilter = { filters: [], and: false };
                objFilter.filters.push(new Filter("Description", FilterOperator.Contains, sValue));
                objFilter.filters.push(new Filter("Category", FilterOperator.Contains, sValue));

                var oFilter = new Filter(objFilter);
                oEvent.getSource().getBinding("items").filter(oFilter);
            },

            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var oInput = null;

                if (this.byId(this._oInput)) {
                    oInput = this.byId(this._oInput);
                } else {
                    oInput = sap.ui.getCore().byId(this._oInput)                    
                }

                if (!oSelectedItem) {
                    oInput.resetProperty("value");
                    return;
                }

                oInput.setValue(oSelectedItem.getTitle());
            },
            onNovoProduto: function (oEvent){
                var oView = this.getView();

                if (!this._Produto) {
                    this._Produto = Fragment.load({
                        id: oView.getId(),
                        name: "br.com.gestao.fioriappadmin234.frags.Insert",
                        controller: this
                    }).then(function(oDialog){
                        oView.addDependent(oDialog);
                        return oDialog;                                                
                    });
                }
                this._Produto.then(function(oDialog){
                    oDialog.open();                        
                })                
            },
            
        });
    });
 
