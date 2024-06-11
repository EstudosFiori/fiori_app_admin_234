sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "br/com/gestao/fioriappadmin234/util/Formatter",
    "sap/ui/core/Fragment",
    "sap/ui/core/ValueState",
    "sap/ui/model/json/JSONModel",
    "br/com/gestao/fioriappadmin234/util/Validator",
    "sap/m/MessageBox",
    "sap/m/BusyDialog",
    "sap/ui/model/odata",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, FilterOperator, Formatter, Fragment, ValueState, JSONModel, Validator, MessageBox, BusyDialog, odata, MessageToast) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappadmin234.controller.Lista", {

            objFormatter: Formatter,

            onInit: function () {
                //debugger;

                sap.ui.getCore().attachValidationError(function (oEvent) {
                    oEvent.getParameter("element").setValueState(ValueState.Error);
                });

                sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                    oEvent.getParameter("element").setValueState(ValueState.Success);
                });
                //    var oConfiguration = sap.ui.getCore().getConfiguration();
                //    oConfiguration.setFormatLocale("en_US");

            },
            criarModel: function () {
                // Model Produto
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "MDL_Produto");
            },
            onSearch: function () {
                var oProdutoInput = this.getView().byId("productIdIput");
                var oProdutoNameInput = this.getView().byId("productNameIput");
                var oProdutoCategoryInput = this.getView().byId("productCategoryIput");

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
                oRouter.navTo("Detalhes", {
                    productId: oProductId
                });
            },
            onCategoria: function (oEvent) {
                this._oInput = oEvent.getSource().getId();
                var oView = this.getView();

                if (!this._CategoriaSearchHelp) {
                    this._CategoriaSearchHelp = Fragment.load({
                        id: oView.getId(),
                        name: "br.com.gestao.fioriappadmin234.frags.SH_Categorias",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._CategoriaSearchHelp.then(function (oDialog) {
                    oDialog.getBinding("items").filter([]);
                    oDialog.open();
                })
            },

            onValueHelpSearch: function (oEvent) {
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
            onNovoProduto: function (oEvent) {

                this.criarModel();

                var oView = this.getView();

                if (!this._Produto) {
                    this._Produto = Fragment.load({
                        id: oView.getId(),
                        name: "br.com.gestao.fioriappadmin234.frags.Insert",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
                this._Produto.then(function (oDialog) {
                    oDialog.open();
                })
            },
            onValida: function () {
                var validator = new Validator();

                if (validator.validate(this.byId("_IDGenDialog1"))) {
                    this.onInsert();
                }
            },

            onInsert: function () {
                // 1 - Criando uma ref do obj model que está recebendo as informações do fragment
                var oModel = this.getView().getModel("MDL_Produto");
                var objNovo = oModel.getData();

                // 2 - Manipular propriedades
                objNovo.Productid = this.geraID();
                objNovo.Price = objNovo.Price[0].toString();
                objNovo.Createdat = this.objFormatter.dateSAP(objNovo.Createdat);
                objNovo.Currencycode = "BRL";
                objNovo.Userupdate = "";

                // 3 - Criando uma ref do arquivo i18n
                var bundle = this.getView().getModel("i18n").getResourceBundle();

                // Variavel contexto da View
                var t = this;

                // 4 - Criar o obj model ref do model default (OData)
                var oModelProduto = this.getView().getModel();

                MessageBox.confirm(
                    bundle.getText("insertDialogMsg"), // Pergunta para o processo
                    function(oAction) { // função de disparo do insert

                        // Verficando se usuário confirmou ou não a operação
                        if (MessageBox.Action.OK === oAction) {
                            t._oBusyDialog = new BusyDialog({
                                text: bundle.getText("Sendind")
                            });

                            t._oBusyDialog.open();

                            setTimeout(function () {
                                var oModelSend = new odata.ODataModel(oModelProduto.sServiceUrl,true);
                                oModelSend.create("Produtos", objNovo, null, 
                                    function(d, r) { // Função de Retorno Sucesso
                                        if (r.statusCode === 201) 
                                        {
                                            MessageToast.show(bundle.getText("insertDialogSuccess", [objNovo.Productid]),
                                            {
                                                duration: 4000
                                            });

                                            // Fechar o obj Dialog do fragment
                                            t.dialogClose();

                                            // dar um refresh no model default
                                            t.getView().getModel().refresh();

                                            // Fechar o BusyDialog
                                            t._oBusyDialog.close();
                                        }
                                    }, function(e) { // Função de Retorno Erro
                                        
                                    }
                                );
                            }, 2000 );
                        }
                    },
                    bundle.getText("insertDialogTitle"), // Pergunta para o processo
                )
            },

            // Geramos um ID de Produto Dinamico
            geraID: function () {
                return 'xxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    varr = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    returnv.toString(16).toUpperCase();
                });
            },

            // Fechamento do Dialog do Fragment
            dialogClose: function() {
                this._Produto.close();
            }
        });
    });

