Ext.define('CoovaChilli.view.pnlPayPal', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.pnlPayPal',
    layout: {
        type    : 'vbox',
        align   : 'stretch'
    },
    border: false,
    requires: ['Ext.toolbar.TextItem'],
    initComponent: function() {
        me          = this;

        var clean_location = window.location.href;
        clean_location     = clean_location.replace(/&tx=.*/, ""); //Remove the PayPal part of the query string else it keeps on adding up!

        var tplVoucher = Ext.create('Ext.XTemplate', [ 
            '<h3>Last purchase</h3>'+
            '<div><div class="item">Username</div><div class="value">{username}</div></div>',
            '<div class="alternate"><div class="item">Password</div><div class="value">{password}</div></div>', 
            '<div><div class="item">Profile</div><div class="value">{profile}</div></div>',
            '<div class="alternate"><div class="item">Valid for</div><div class="value">{valid_for}</div></div>'   
        ]);

        me.items    = [
            {
                height      : 140,
                tpl         : tplVoucher,
                data        : {username: 'UN Placeholder',password: 'PW Placeholder'},
                bodyCls     : 'lastPurchase',
                hidden      : true,
                itemId      : 'pnlPayPalFeedback'
            },
            {
                height      : 80,
                html        : [
                    '<b>Could not retrieve your voucher detail</b><br>',
                    'This detail will also be emailed to you.<br>',
                    'Alternatively contact the helpdesk.<br>'
                ],
                bodyCls     : 'lastPurchase',
                hidden      : true,
                itemId      : 'pnlPayPalError'
            },
            {
               // bodyStyle   :{"background-color":"blue"},
                flex        : 1,
                html        : [
'<div class="lastPurchase">',
'<h3>Need time on the Internet?</h3>',
'<div>Select the time you want and click the <b>Buy Now</b> button below</div>',
'<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">',
'<input type="hidden" name="cmd" value="_s-xclick">',
'<input type="hidden" name="hosted_button_id" value="your button">',
'<input type="hidden" name="return" value="'+clean_location+'" />',
'<input type="hidden" name="cancel_return" value="'+clean_location+'" />',
'<input type="hidden" name="notify_url" value="http://your server/cake2/rd_cake/fin_paypal_transactions/paypal_ipn.json" />',
'<table>',
'<tr><td class="thead"><input type="hidden" name="on0" value="Vouchers">Vouchers</td></tr><tr><td><select name="os0">',
    '<option value="2Hours">2Hours £2.00 GBP</option>',
	'<option value="4Hours">4Hours £4.00 GBP</option>',
	'<option value="12Hours">12Hours £6.00 GBP</option>',
'</select> </td></tr>',
'</table>',
'<input type="hidden" name="currency_code" value="GBP">',
'<input type="image" src="https://www.paypalobjects.com/en_US/GB/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">',
'<img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">',
'</form>',
'<div>'

/*
<form action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="hidden" name="hosted_button_id" value="UFMHSSYCZUWB8">
<table>
<tr><td><input type="hidden" name="on0" value="Vouchers">Vouchers</td></tr><tr><td><select name="os0">
	<option value="2Hours">2Hours £2.00 GBP</option>
	<option value="4Hours">4Hours £4.00 GBP</option>
	<option value="12Hours">12Hours £6.00 GBP</option>
</select> </td></tr>
</table>
<input type="hidden" name="currency_code" value="GBP">
<input type="image" src="https://www.sandbox.paypal.com/en_US/GB/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal – The safer, easier way to pay online.">
<img alt="" border="0" src="https://www.sandbox.paypal.com/en_GB/i/scr/pixel.gif" width="1" height="1">
</form>
*/
               ]
  
            }  
        ];
        me.callParent(arguments);
    }
});
