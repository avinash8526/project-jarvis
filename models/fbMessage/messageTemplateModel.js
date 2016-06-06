
var messageTemplateModelObj = {};

messageTemplateModelObj.messageTemplateModel = function() {
    return this;
};

messageTemplateModelObj.messageTemplateModel.prototype = {
    buildButtonMessage : function(buttonText,buttons){
        return {
                attachment : {
                    type : 'template',
                    payload : {
                        template_type : "button",
                        text : buttonText,
                        buttons :buttons
                    }
                }
        }
    },

    buildGenericMessage : function(elements) {
        return {

                attachment : {
                    type : 'template',
                    payload : {
                        template_type : "generic",
                        elements : elements
                    }
                }

        }
    }
};

module.exports = messageTemplateModelObj;