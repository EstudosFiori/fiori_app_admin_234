sap.ui.define([
    "sap/ui/core/format/NumberFormat"
], 
function (NumberFormat) {
    "use strict";

    var Formatter = {

        date: function(value){
            var oConfiguration  = sap.ui.getCore().getConfiguration();
            var oLocale         = oConfiguration.getFormatLocale();
            var oPattern        = "";

            if (oLocale === "pt") {
                oPattern = "dd/MM/yyyy";
            } else {   
                oPattern = "MM/dd/yyyy";                   
            }

            if(value){
                var year = new Date(value).getFullYear();
                if (year === 999 ) {
                    return "";
                }else{
                    var oDateFormart = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        //style: "short"
                        pattern: oPattern
                    });

                    return oDateFormart.format(new Date(value));
                }
            }else{
                return value;
            }
        },

        dateSAP:function(value) {
            if(value) {
                var dateParts = value.split("/");
                var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
                var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                    pattern:"yyyy-MM-ddTHH:mm:ss"
                });
                return oDateFormat.format(new Date(dateObject));
            } else{
                return value;
            }
        },  

        statusProduto: function(value){
            var oBundle = this.getView().getModel("i18n").getResourceBundle();

            try{
                return oBundle.getText("status" + value);
            }catch(err){
                return "";
            }
        },
        stateProduto: function(value){
            try{
                if (value === "E") {
                    return "Success";
                }else if(value === "P"){
                    return "Warning";
                }else if(value === "F") {
                    return "Error";
                }else{
                    return "None";
                }
            }catch(err){
                return "None";
            }
        },
        iconProduto: function(value){
            try{
                if (value === "E") {
                    return "sap-icon://sys-enter-2";
                }else if(value === "P"){
                    return "sap-icon://alert";
                }else if(value === "F") {
                    return "sap-icon://error";
                }else{
                    return "";
                }
            }catch(err){
                return "";
            }
        },
        floatNumber: function (value){
            var numFloat = NumberFormat.getFloatInstance({
                maxFractionDigits: 2,
                minFractionDigits: 2,
                groupingEnabled: true,
                groupingSeparator: ".",
                decimalSeparator: ","
            });
            return numFloat.format(value);
        },                
    };

    return Formatter;

}, true);

