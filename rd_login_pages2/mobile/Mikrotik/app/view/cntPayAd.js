Ext.define('Mikrotik.view.cntPayAd', {
    extend  : 'Ext.Container',
    xtype   : 'cntPayAd',
    config  : {
        cls     : 'rdWrapper',
        html    : [
            "<h2>Your Payment gateway here!</h2>"+
            "<div class='imgAbout'><img src='resources/images/paypal.png' /></div>"+
            "<div class='rdDescription'>"+
            "For custom payment gateway integration contact the developers of <b>RADIUSdesk</b><br>"+
            "<a href='http://www.radiusdesk.com/getting_started/contact_us' target='_blank'>"+
            "http://www.radiusdesk.com/getting_started/contact_us</a>"+
            "</div>"
        ]
    }
});

