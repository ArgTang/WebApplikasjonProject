"use strict";
/*jshint devel:true */

define( ["." + "/lib/vm_components", "utils", "ko"], function ( vm_components, utils, ko ) {

    // configure view model components
    if ( window.dontUseExitAnimation ) {
        vm_components.useExitAnimation = false;
    }

    /**
     * View model for tracking all BankIDs and their certificates and histories.
     * @memberof vmcomponents
     * @constructor
     */
    vm_components.BankIdViewModel = function () {
        var self = this;

        /**
         * we'll store all bank ids here
         * @memberof vmcomponents.BankIdViewModel
         * @type {Array}
         */
        self.all = ko.observableArray();

        /**
         * unless told otherwise we'll use the first index as the current
         * @memberof vmcomponents.BankIdViewModel
         * @type {Number}
         */
        self.currentIndex = ko.observable( 0 );

        /**
         * returns the current object based on the current index
         * @memberof vmcomponents.BankIdViewModel
         * @type {Object}
         */
        self.current = ko.computed( {
            read: function () {
                return self.all()[self.currentIndex()];
            },
            write: function ( obj ) {
                utils.each( self.all(), function ( o, key ) {
                    if ( obj === o ) {
                        self.currentIndex( key );
                    }
                } );
            }
        } );

        /**
         *
         * @memberof vmcomponents.BankIdViewModel
         * @type {Function}
         */
        self.currentPeronalCertificate = ko.computed( function () {
            if ( self.current() ) {
                // return the last certificate - assuming that the last = personal
                var certificates = self.current().certificates;
                return certificates[certificates.length - 1];
            } else {
                return {text: ''};
            }
        } );

        /**
         *
         * @memberof vmcomponents.BankIdViewModel
         * @param obj
         */
        self.addObject = function ( obj ) {

            // add onClick event to certificates
            utils.each( obj.certificates, function ( cert ) {
                cert.onClick = function () {
                    alert( cert.text + ' ' + 'clicked' );
                };
            } );

            utils.each( obj.histories, function ( history ) {
                if ( history.error === undefined ) {
                    history.error = false;
                }
            } );

            self.all.push( obj );
        };
    };

    /**
     * @memberof vmcomponents
     * @param certificate
     * @constructor
     */
    vm_components.Certificate = function ( certificate ) {
        var self = this;

        utils.merge( true, self, {
            type: null,
            general: {
                issuedTo: null,
                bank: null,
                issuedBy: null,
                bankIdType: null,
                validFrom: null,
                validTo: null,
                qualified: null,
                creditLimit: null
            },
            details: {
                version: null,
                serialNumber: null,
                signatureAlgorithm: null,
                issuedBy: null,
                issuedTo: null,
                subject: null,
                dateOfBirth: null,
                email: null,
                bankRegNumber: null,
                publicKey: null,
                subjectKeyIdentifier: null,
                authorityKeyIdentifier: null,
                keyUsage: null,
                validationAuth: null,
                certificatePolicy: null,
                fingerprintAlgo: null,
                certificateFingerprint: null
            }
        }, certificate );
    };

    return vm_components;

} );