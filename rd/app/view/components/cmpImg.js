Ext.define('Rd.view.components.cmpImg', {
    extend: 'Ext.Component',  
    alias: 'widget.cmpImg',      
    html: '<img src="'+Ext.BLANK_IMAGE_URL+'">', 
    setImage: function (img) {   
        var me = this, imgEl;                      
        imgEl = me.el.dom.firstChild;
        imgEl.src = img;
    }
});

