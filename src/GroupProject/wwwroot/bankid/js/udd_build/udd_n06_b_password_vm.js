"use strict";

define( ["locale", "../udd_build_common/udd_common_password_vm.js"], function ( locale, UddCommonVM ) {

    var config = {
        action: "netpay",
        bankIdDevices: [
            {
                title: "Merchant Bank",
                value: "merchant_bank",
                type: "personal",
                histories: {
                    used: {
                        merchant: "merchantCommonName",
                        date: "17.05.2010 11:11"
                    }
                },
                certificate: 'Ola Norman'
            }
        ]
    };

    return UddCommonVM( config );

} );