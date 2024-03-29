sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/TextArea",
    "sap/ui/layout/form/SimpleForm"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Label, Input, TextArea, SimpleForm) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappadmin234.controller.Objetos", {
            onInit: function () { },

            onClicaSet: function (evt) {
                var objTitle = this.getView().byId("headerTitle");

                objTitle.setText("Novo Título do Header");
            },

            onClicaGet: function (evt) {
                var objTitle = this.getView().byId("headerTitle");
                var sValorText = objTitle.getText();
            },

            addFormulario: function (evt) {
                //Estamos criando uma referência do objeto Panel
                var objPanel = this.getView().byId("panel_formulario");

                //Chama o método destroyContent para eliminar todo o conteúdo do Panel
                objPanel.destroyContent();

                //Criar os objetos do Formulário
                var objItensFormulario = [];

                objItensFormulario.push(new Label("lblPergunta1", {
                    text: "Pergunta 1",
                    required: true
                }));
                objItensFormulario.push(new Input("inputPergunta1", {
                    value: "Valor da Pergunta 1"
                }));

                objItensFormulario.push(new Label("lblPergunta2", {
                    text: "Pergunta 2",
                    required: true
                }));

                objItensFormulario.push(new TextArea("txtArea", {
                    rows: 7
                }));

                //Criar um Simple Form
                var oForm = new SimpleForm("simpleForm", {
                    content: objItensFormulario
                });

                //Adicionar o Formulário dentro do Panel
                objPanel.addContent(oForm);
            }
        });
    });
