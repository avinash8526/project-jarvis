/**
 * Created by avagrawal on 6/3/16.
 */

var elementModelObject = {};

elementModelObject.elementModel = function(){
    this.elements = [];
};

elementModelObject.elementModel.prototype = {

    addElements : function(buttons,title,subtitle,imageUrl){
        this.elements.push({
           title : title,
           buttons : buttons.buttons,
           subtitle : subtitle,
           image_url : imageUrl
        });

    },
    getElementModel : function(){
        return this.elements;
    }
};


module.exports = elementModelObject;