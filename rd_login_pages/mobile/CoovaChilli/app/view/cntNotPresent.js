Ext.define('CoovaChilli.view.cntNotPresent', {
    extend: 'Ext.Container',
    xtype: 'main',
    config: {
        layout  : 'hbox',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },      
        items: [
            { xtype     : 'spacer', flex: 1 },
            {
                html     : [ 
                    "<div class='rdWrapper'>"+
                    "<h2>Huston we have a problem....</h2>"+
                    "<div class='rdDescription'>"+
                    "Go to RADIUSdesk, open the <b>Dynamic Login Pages</b> applet. Select an entry and <b>edit</b> it<br>"+
                    "Make sure you added an identifier from this URL's query string under <b>Dynamic Keys</b>"+
                    " to ensure proper working of this login page<br>"+
                    "</div></div>"
                ],
                xtype:  'container'
            },
            { xtype     : 'spacer', flex: 1 }
        ]
     
    }
});
