
var buttonModelObject = {};

buttonModelObject.buttonModel = function(){
    this.buttons = [];
};

buttonModelObject.buttonModel.prototype = {

    buildUrlButton : function(type,url,title){
        this.buttons.push({
            type : type,
            url : url,
            title : title
        });

    },
    buildPayLoadButton : function(type,title,payload){
        this.buttons.push({
            type : type,
            payload : payload,
            title : title
        });
    },
    getButtonsList : function(){
      return this.buttons;
    }
};

module.exports = buttonModelObject;