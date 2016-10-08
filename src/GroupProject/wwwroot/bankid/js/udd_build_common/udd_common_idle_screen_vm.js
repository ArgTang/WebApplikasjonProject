"use strict";

define( [
    'ko',
    'utils',
    'gfx',
    'locale',
    'vm_components',
    'event_handler',
    'dom',
    'lib/constants',
    'dom_utils',
    'builds'
], function ( ko, utils, gfx, locale, comp, eventHandler, $, constants, domUtils, builds ) {

    return function ( config ) {

        // ------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------

        var self = {};

        config = utils.merge( {
            /**
             * HA type
             */
            type: "bimotp",
            /**
             * UDD action
             */
            action: "auth",
            /**
             * HA certificate type
             */
            certType: "personal",
            /**
             * Header subtitle
             */
            headerTitleSubtitle: "Navn på dokument", // DUMMY
            /**
             * Merchant certificate
             */
            merchantCertificate: "Bamble og Langesund Sparebank", // DUMMY
            /**
             * Has multi HA
             */
            hasMultiHa: true
        }, config, builds.customise );

        /**
         * Disabled view observable
         */
        var isViewDisabled = ko.observable( false );
        /**
         * Header logo crop
         */
        var headerLogoCrop = false;
        /**
         * Header title
         */
        var headerTitle = "[header title]"; // DUMMY
        /**
         * Header subtitle
         */
        var headerTitleSubtitle = null;
        /**
         * Header menu change password
         */
        var headerMenuChangePassword = config.action === "auth";
        /**
         * Header back title
         */
        var headerBackTitle = null;
        /**
         * Certificates array
         * @type {Array}
         */
        var footerCertificatesVm = [{
            text: config.merchantCertificate
        }];
        footerCertificatesVm.disabled = isViewDisabled;
        /**
         * Help header text
         */
        var helpHeaderText = null;
        /**
         * Help text
         */
        var helpText = null;
        /**
         * Idle screen title
         */
        var idleScreenTitle = null;
        /**
         * Idle screen spinner src
         */
        var idleScreenSpinnerSrc = null;
        /**
         * Idle screen icon src
         */
        var idleScreenIconSrc = null;
        /**
         * Idle screen reference
         */
        var idleScreenReference = null;
        /**
         * Idle screen instructions
         */
        var idleScreenInstructions = null;

        /*
         * Handle UDD action auth/netpay/sign
         * Overwrite certain variables
         */
        switch ( config.action ) {
            case "netpay":
                headerTitle = locale.label_header_bankaxess;
                break;
            case "sign":
                headerTitle = locale.label_header_signing;
                headerTitleSubtitle = config.headerTitleSubtitle;
                headerLogoCrop = true;
                break;
            default:
                headerTitle = builds.debugEditPasswordMode ? locale.label_header_change_password : locale.label_header_identification;
        }

        /*
         * Handle HA type
         */
        switch ( config.type ) {
            case "ha2":
                headerBackTitle = locale.label_switch_otp_method;
                helpHeaderText = locale.replace( locale.ha_help_header, locale._ha_app_name );
                idleScreenTitle = locale._ha_app_name;
                helpText = locale.ha_help_text;
                idleScreenSpinnerSrc = utils.features.cssAnimation ? gfx.getB64( 'ico_spinner_big' ) : gfx.gif.spinner_blue;
                idleScreenInstructions = locale.label_follow_ha_app_dialog;
                break;
            default:
                headerBackTitle = locale.button_back;
                helpHeaderText = locale.bim_reference_help_header;
                idleScreenTitle = locale.label_bid_mobile_otp;
                helpText = locale.bim_reference_help_text;
                idleScreenSpinnerSrc = utils.features.cssAnimation ? gfx.getB64( 'ico_spinner' ) : gfx.gif.spinner_blue;
                idleScreenIconSrc = gfx.getB64( 'ico_bimotp' );
                idleScreenReference = locale._bim_otp_reference;
                idleScreenInstructions = locale.label_watch_your_mobile_phone;
        }

        // ------------------------------------------------------------------
        // Components
        // ------------------------------------------------------------------

        /**
         * Help dialog
         */
        var helpDialog = new comp.HelpDialog( {
            title: locale.label_tooltip_open_dialog_help,
            header: helpHeaderText,
            text: helpText,
            closeButtonTitle: locale.label_tooltip_close_dialog_help,
            closeButtonLabel: locale.button_close,
            isViewDisabled: isViewDisabled
        } );

        // ------------------------------------------------------------------
        // View models
        // ------------------------------------------------------------------

        /**
         * Header title view model
         */
        var headerTitleVm = {
            text: headerTitle,
            subtext: headerTitleSubtitle,
            isViewDisabled: isViewDisabled
        };

        /**
         * Header back view model
         */
        var headerBackVm = config.hasMultiHa ? {
            title: headerBackTitle
        } : null;

        /**
         * Header logo view model
         */
        var headerLogoVm = {
            crop: headerLogoCrop
        };

        /**
         * Header menu view model
         */
        var headerMenuVm = {
            changePassword: headerMenuChangePassword,
            disabled: isViewDisabled
        };

        /**
         * Signature view model
         */
        var footerSignatureVm = {
            title: locale.bankid_merchant,
            text: footerCertificatesVm[0] && footerCertificatesVm[0].text || "[signature]" // DUMMY
        };

        /**
         * Idle screen view model
         */
        var idleScreenVm = {
            src_spinner: idleScreenSpinnerSrc,
            src: idleScreenIconSrc,
            title: idleScreenTitle,
            type: config.type,
            tabIndex: ko.observable( constants.BIMOTP_TITLE_TABINXEX ),
            reference: idleScreenReference,
            instructions: idleScreenInstructions,
            illustrationTitle: locale.bim_reference_retrieving,
            onTitleBlur: function () {
                idleScreenVm.tabIndex( null );
            }
        };

        /**
         * HA type view model
         */
        var haTypeVm = {
            text: config.certType === "employee" ? locale.label_employee_bankid : locale.label_person_bankid
        };

        // ------------------------------------------------------------------
        // Functions
        // ------------------------------------------------------------------

        function onReady() {
            if ( !self.debugNoFocus ) {
                domUtils.focusSecondaryHeader();
            }

            doAssitiveReferenceWordMessage();
        }

        function doAssitiveReferenceWordMessage() {
            // assistive message if BIMOTP
            if ( config.type === "bimotp" ) {
                var assistiveMessage = locale.label_bid_mobile_otp + ": " + locale._bim_otp_reference + ". " + locale.label_watch_your_mobile_phone;
                eventHandler.fire( "assistive_message", assistiveMessage );
            }
        }

        // ------------------------------------------------------------------
        // Ready
        // ------------------------------------------------------------------

        // event listen on UDD fragment ready
        eventHandler.on( "udd_fragment_ready", onReady );

        // ------------------------------------------------------------------
        // Return
        // ------------------------------------------------------------------

        return {
            header: {
                logo: headerLogoVm,
                back: headerBackVm,
                title: headerTitleVm,
                menu: headerMenuVm
            },
            body: {
                idleScreen: idleScreenVm,
                info: haTypeVm,
                help: helpDialog
            },
            footer: {
                certificates: footerCertificatesVm,
                signature: footerSignatureVm
            },
            customise: config
        };

    };
} );
