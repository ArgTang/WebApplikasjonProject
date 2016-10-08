/* Scripts for bidm */
function bidMobile() {
    "use strict";

    /**
     * Constant variable for the key esc.
     * @type {number}
     */
    var KEY_ESC = 27;
    var TIMER = 2000;

    /**
     * Action constants
     * @type {string}
     */
    var ACTION_IDENTIFICATION = "identification",
        ACTION_SIGNING = "signing",
        ACTION_BANKAXESS = "bankaxess";

    /**
     * Language strings
     */
    var LANGUAGE = {
        "def": {
            "header_identification": "Identification",
            "header_signing": "Signing",
            "header_bankaxess": "BankAxess",
            "success_message_identification": "Identification is complete",
            "success_message_signing": "Signing is complete",
            "success_message_bankaxess": "Transaction is complete",
            "wait_message_signing": "Follow the instruction on your mobile\nto complete the signing.",
            "wait_message_bankaxess": "Follow the instruction on your mobile\nto complete the transaction.",
            "error_phone_8_digits": "Mobile number must be 8 digits",
            "error_phone_6_digits": "Date of birth must be 6 digits"
        },
        "no": {
            "header_identification": "Identifisering",
            "header_signing": "Signering",
            "header_bankaxess": "BankAxess",
            "success_message_identification": "Identifisering er fullført",
            "success_message_signing": "Signering er fullført",
            "success_message_bankaxess": "Betaling er fullført",
            "wait_message_signing": "Følg instruksene på din mobil\nfor å fullføre signeringen.",
            "wait_message_bankaxess": "Følg instruksene på din mobil\nfor å fullføre transaksjonen.",
            "error_phone_8_digits": "Mobilnummer må være 8 siffer",
            "error_phone_6_digits": "Fødselsdato må være 6 siffer"
        }
    };

    /**
     * The chosen language, given from document's "lang"
     */
    var LOCALE = LANGUAGE[document.documentElement.lang] || LANGUAGE["def"];

    /**
     * Small method to help find the dom elements
     * @param key
     * @returns {HTMLElement}
     */
    function find( key ) {
        return document.querySelector( key );
    }

    /**
     * Parses the URL Parameters
     * @param name
     * @param def
     * @returns {*}
     */
    function urlParameter( name, def ) {
        return ((new RegExp( name + '=' + '(.+?)(&|$)' )).exec( location.search ) || [, def !== undefined ? def : false])[1];
    }

    /**
     * Method to help add the url parameters if a redirect is needed.
     * @param {String} page
     * @param {Boolean} [search]
     * @param {Boolean} [redirectParent] True if to redirect parent if in iframe
     */
    function redirect( page, search, redirectParent ) {
        var location = redirectParent && self !== top ? window.top.location : document.location;

        if ( search ) {
            location.href = page + document.location.search;
        }
        else {
            location.href = page;
        }
    }

    /**
     * Check if the browsers supports a css feature
     * @param eventName
     * @returns {boolean} True if CSS feature is supported
     */
    function supportsCSSFeature( eventName ) {
        var el = document.createElement( 'div' ),
            eventNameHash = {
                CSS3: eventName.toLowerCase(),
                webkit: 'webkit' + eventName,
                Moz: eventName.toLowerCase(),
                O: 'o' + eventName,
                ms: 'MS' + eventName
            }
            ;
        var support = false;
        Object.keys( eventNameHash ).some( function ( key ) {
            if ( eventNameHash[key] in el.style ) {
                support = true;
                return true;
            } else {
                return false;
            }
        } );
        return support;
    }

    /**
     * Add a class to a dom element, instead of using the classList
     * @param {HTMLElement} element
     * @param clas
     */
    function addClass( element, clas ) {
        var classes = element.className.split( " " );
        if ( classes.indexOf( clas ) === -1 ) {
            classes.push( clas );
            element.className = classes.join( " " );
        }
    }

    /**
     * Remove a class from a dom element, instead of using the classList
     * @param {HTMLElement} element
     * @param clas
     */
    function removeClass( element, clas ) {
        var classes = element.className.split( " " );
        var indexOf = classes.indexOf( clas );

        if ( indexOf > -1 ) {
            classes.splice( indexOf, 1 );
            element.className = classes.join( " " );
        }
    }

    /**
     * @param {HTMLElement} element
     * @param clas
     * @returns {boolean} True if element contains class
     */
    function hasClass( element, clas ) {
        var classes = element.className.split( " " );
        return classes.indexOf( clas ) > -1;
    }

    /**
     * @param {Element} element
     * @param {Array} events
     * @param {Function} handler
     */
    function addMultipleEventListeners( element, events, handler ) {
        events.forEach( function ( eventName ) {
            element.addEventListener( eventName, handler );
        } );
    }

    var userAgent = window.navigator.userAgent;

    /**
     * Browser detections
     * @type {Object}
     */
    var browser = {
        mobile: {
            android: userAgent.match( /Android/i ),
            blackBerry: userAgent.match( /BlackBerry/i ),
            iOS: userAgent.match( /iPhone|iPad|iPod/i ),
            opera: userAgent.match( /Opera Mini/i ),
            windows: userAgent.match( /IEMobile/i )
        },
        ie: (userAgent.indexOf( 'Trident/' ) >= 0),
        ie10OrAbove: (userAgent.match( /[MS]?IE\s?(\d+).*Trident/ ) || userAgent.match( /Trident.*rv\:(\d+)/i ) || [, false])[1] >= 10,
        androidInternal: (/Android.*Version\/[\d\.]+.Mobile/.test( userAgent )),
        firefox: userAgent.toLowerCase().indexOf( "firefox" ) > -1
    };
    browser.mobile.any = browser.mobile.android || browser.mobile.blackBerry || browser.mobile.iOS || browser.mobile.opera || browser.mobile.windows;

    /**
     * Browser features
     * @type {Object}
     */
    var features = {
        noAnimation: !(supportsCSSFeature( 'Animation' )),
        noPlaceholder: !( 'placeholder' in ( document.createElement( 'input' ) ) && 'placeholder' in ( document.createElement( 'textarea' ) ) ),
        partialPlaceholder: browser.androidInternal || browser.ie10OrAbove
    };

    var appBody = find( ".bidm_app" );
    var backButton = find( ".bidm_header button.bidm_back" ),
        closeButton = find( ".bidm_header button.bidm_close" ),
        helpButton = find( "button.bidm_help" ),
        nextButton = find( ".bidm_body button.bidm_next" );
    var infoDialog = find( ".bidm_dialog" ),
        infoDialogBody = find( ".bidm_dialog .bidm_dialog-body" ),
        infoDialogHeaderTitle = find( ".bidm_dialog .bidm_dialog-header .bidm_title" ),
        infoDialogCloseButton = find( ".bidm_dialog button.bidm_close" );
    var phoneInput = find( ".bidm_form input.bidm_phone" ),
        birthInput = find( ".bidm_form input.bidm_birth" );
    var errorDialog = find( ".bidm_body .bidm_error-wrapper" ),
        errorDialogText = find( ".bidm_body .bidm_error-wrapper .bidm_text" ),
        errorDialogParent;
    var scrollView = find( ".bidm_body.bidm_scroll" );
    var liveRegion = find( ".bidm_live_region" );
    var form = find( ".bidm_outer-form" );
    var referenceLabel = find( "#bidm_ref-label" );
    var headerTitle = find( ".bidm_header .bidm_title" );
    var waitMessage = find( "#bidm_wait-message" );
    var successMessage = find( ".bidm_info h2" );

    /**
     * True if browser is mobile device
     * @type {boolean}
     */
    var isMobile = browser.mobile.any;
    /**
     * True if to set auto focus when page is loaded
     * - Don't set auto focus if URL contains 'autoFocus=false' (only for demo)
     * - Dont' set auto focus if mobile device
     * @type {boolean}
     */
    var isAutoFocus = window.location.search.indexOf( 'autoFocus=false' ) >= 0 ? false : !isMobile;
    /**
     * True if in flow mode
     * @type {boolean}
     * @debug Only use in debug/demo mode
     */
    var isFlow = urlParameter( "flow", false );
    /**
     * True if in UDD mode
     * @type {boolean}
     * @debug Only use in debug/demo mode
     */
    var isUdd = urlParameter( "udd", false );
    /**
     * Action type
     * @type {String}
     * @debug Only use in debug/demo mode
     */
    var action = urlParameter( "action", ACTION_IDENTIFICATION );
    /**
     * Flow scenario mode
     * @type {String}
     * @debug Only use in debug/demo mode
     */
    var scenario = urlParameter( "scenario", "success" );

    /*
     * Set a class on the body if the browser does not support animations
     */
    if ( features.noAnimation ) {
        addClass( appBody, "bidm_no-animation" );
    }
    /*
     * Set a class on the body if the browser does not support placeholders
     */
    if ( features.noPlaceholder ) {
        addClass( appBody, "bidm_no-placeholder" );
    }
    /*
     * Set a class on the body if the browser does not fully support placeholders
     */
    if ( features.partialPlaceholder ) {
        addClass( appBody, "bidm_partial-placeholder" );
    }
    /*
     * Set app body to have full height when in UDD-mode
     * @debug Only use in debug/demo mode
     */
    if ( isUdd ) {
        appBody.style.position = "absolute";
        appBody.style.height = null;
        appBody.style.top = 0;
        appBody.style.bottom = 0;
    }

    /*
     * Removed padding and margin on body
     * @debug Only use in debug/demo mode
     */
    document.body.style.margin = 0;
    document.body.style.padding = 0;

    /*
     * If in a flow mode, redirect, if not show an alert of the default action
     */
    if ( backButton ) {
        backButton.addEventListener( "click", function () {
            if ( isFlow ) {
                var redirectPage = document.documentElement.lang === "no" ? "login.html" : "login_en.html";
                redirect( redirectPage, true, true );
            }
            else {
                alert( "Back" );
            }
        } );
    }
    /*
     * If in a flow mode, redirect, if not show an alert of the default action
     */
    if ( closeButton ) {
        closeButton.addEventListener( "click", function () {
            if ( isFlow ) {
                redirect( "./demo/", false, true );
            }
            else {
                alert( "Close" );
            }
        } );
    }
    /*
     * Add an eventListener to show and hide the help dialog
     */
    if ( infoDialog ) {
        // show dialog
        helpButton.addEventListener( "click", function () {
            showDialog();
        } );
        // hide dialog
        infoDialogCloseButton.addEventListener( "click", function () {
            hideDialog();
        } );
    }
    /*
     * Store error dialog parent and remove error dialog from parent
     */
    if ( errorDialog ) {
        errorDialogParent = errorDialog.parentNode;
        errorDialogParent.removeChild( errorDialog );
    }

    //    -----------------------------------------------------------------------------------------------------

    /**
     * Show an error bubble, with a message and an arrow
     * @param {HTMLElement} inputElement
     * @param {String} message
     */
    function showInputError( inputElement, message ) {
        if ( hasClass( errorDialog, "bidm_visible" ) ) {
            hideInputError();
        }

        addClass( inputElement, "bidm_error" );

        if ( inputElement === birthInput ) {
            addClass( errorDialog, "bidm_right" );
        }
        else {
            removeClass( errorDialog, "bidm_right" );
        }

        appBody.addEventListener( "click", hideInputError );
        appBody.addEventListener( "keydown", hideInputError );

        errorDialogText.innerHTML = message;

        // update live region with error message
        liveRegion.innerHTML = "";
        liveRegion.innerHTML = message;

        // appends the visible class to make it visible, before inserting it into the DOM
        addClass( errorDialog, "bidm_visible" );
        errorDialogParent.insertBefore( errorDialog, errorDialogParent.firstChild );
    }

    /**
     * Hide the error bubble
     */
    function hideInputError() {
        removeClass( phoneInput, "bidm_error" );
        removeClass( birthInput, "bidm_error" );

        removeClass( errorDialog, "bidm_visible" );
        errorDialogText.innerHTML = "";
        liveRegion.innerHTML = "";

        appBody.removeEventListener( "click", hideInputError );
        appBody.removeEventListener( "keydown", hideInputError );

        // if the Error bubble is in DOM; then remove it.
        if ( errorDialog.parentNode ) {
            errorDialog.parentNode.removeChild( errorDialog );
        }
    }

    /**
     * Enable all focusable elements behind dialog
     */
    function enableViewBehindDialog() {
        var enableViews = [backButton, closeButton, nextButton, phoneInput, birthInput, helpButton];
        enableViews.forEach( function ( element ) {
            if ( element ) {
                element.removeAttribute( "disabled" );
            }
        } );
        if ( scrollView ) {
            scrollView.setAttribute( "tabindex", "2000" );
        }
    }

    /**
     * Disable all focusable elements behind dialog
     */
    function disableViewBehindDialog() {
        var enableViews = [backButton, closeButton, nextButton, phoneInput, birthInput, helpButton];
        enableViews.forEach( function ( element ) {
            if ( element ) {
                element.setAttribute( "disabled", "disabled" );
            }
        } );
        if ( scrollView ) {
            scrollView.removeAttribute( "tabindex" );
        }
    }

    /**
     * Handle dialog click; hide dialog if clicked outside dialog
     */
    function handleDialogClick( event ) {
        if ( event.target.querySelector( ".bidm_center" ) ) {
            hideDialog();
        }
    }

    /**
     * Handle keyboard click; hide dialog ESC is pressed
     */
    function handleDialogKeyboard( event ) {
        if ( event.which === KEY_ESC ) {
            hideDialog();
        }
    }

    /**
     * Show the Help Dialog
     */
    function showDialog() {
        addClass( infoDialog, "bidm_visible" );
        infoDialog.addEventListener( "click", handleDialogClick );
        infoDialog.addEventListener( "keyup", handleDialogKeyboard );
        infoDialogBody.style.maxHeight = (appBody.offsetHeight - 70) + "px";
        disableViewBehindDialog();
        infoDialogHeaderTitle.focus();
    }

    /**
     * Show the Help Dialog
     */
    function hideDialog() {
        removeClass( infoDialog, "bidm_visible" );
        infoDialog.removeEventListener( "click", handleDialogClick );
        infoDialog.removeEventListener( "keyup", handleDialogKeyboard );
        enableViewBehindDialog();
    }

    /**
     * Set page's header title according to action
     */
    function setPageHeaderAccordingToAction() {
        switch ( action ) {
            case ACTION_SIGNING:
                headerTitle.innerHTML = LOCALE.header_signing;
                break;
            case ACTION_BANKAXESS:
                headerTitle.innerHTML = LOCALE.header_bankaxess;
                break;
            default:
                headerTitle.innerHTML = LOCALE.header_identification;
        }
    }

    //    -----------------------------------------------------------------------------------------------------
    /**
     * All the logic for the reference Page
     */
    function referencePage() {

        setPageHeaderAccordingToAction();

        setTimeout( function () {
            redirect( "../bankid.html?udd=n06_b_password&locale=no", false, true );
        }, TIMER );
    }

    //    -----------------------------------------------------------------------------------------------------

    var pageType = appBody.getAttribute( "data-page-type" );
    switch ( pageType ) {
        case "reference":
            referencePage();
            break;
    }
}

window.addEventListener( "load", function () {
    "use strict";
    bidMobile();
} );