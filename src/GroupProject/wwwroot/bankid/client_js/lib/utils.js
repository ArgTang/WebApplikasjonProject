"use strict";

/*jshint unused: vars */
/*globals XSLTProcessor:false */

/**
 * A collection of useful functions
 * @namespace utils
 */
define( ['feature_detection', 'lib/global', 'event_handler'], function ( feature_detection, global, eventHandler ) {

    // ------------------------------------------------------------------
    // VARIABLES
    // ------------------------------------------------------------------

    var CHECK_DOC_WINDOW_INTERVAL = 500;

    /**
     * Holds a counter for the key generator
     * @private
     * @type {number}
     */
    var random_counter = 0;
    /**
     * Interval for checking if doc window is set
     * @type {null|*}
     */
    var docWindowInterval = null;

    // ------------------------------------------------------------------
    // FUNCTIONS
    // ------------------------------------------------------------------

    /**
     * @param eventName
     * @returns {string}
     */
    function getEventName( eventName ) {
        var el = document.createElement( 'div' ),
            eventNameHash = {
                webkit: 'webkit' + eventName,
                Moz: eventName.toLowerCase(),
                O: 'o' + eventName,
                ms: 'MS' + eventName
            }
            ;

        var retValue = eventName.toLowerCase();

        Object.keys( eventNameHash ).some( function ( vendor ) {
            if ( vendor + 'TransitionProperty' in el.style ) {
                retValue = eventNameHash[vendor];
                return true;
            } else {
                return false;
            }
        } );

        return retValue;

    }

    /**
     * Returns the string for a css rule.
     * @param prop String
     * @returns {*}
     * @example getCSSString('animation') // Chrome => "WebkitAnimation"
     */
    function getCSSString( prop ) {
        // Does the browser support non-prefixed property name?
        var s = document.createElement( 'p' ).style;
        if ( s[prop] === '' ) {
            return prop;
        }

        // Go through the usual suspects and check with those prefixes.
        var i, v = ['ms', 'O', 'Moz', 'Webkit'];

        // change the casing of the first letter so that ie. "animation" becomes "Animation"
        prop = prop.charAt( 0 ).toUpperCase() + prop.slice( 1 );

        // find the correct prefix and return the full css property name
        for ( i = 0; i < v.length; i++ ) {
            if ( s[v[i] + prop] === '' ) {
                return v[i] + prop;
            }
        }

        // Nope, no support.
        return false;
    }

    /**
     * Helper function. Checks whether the css property is supported or not, and returns a boolean. Example of use:
     * supportCSSFeature('transition'); // IE 10 => true, IE 9 => false
     *
     * @param prop The css property name (lowercase, no vendor prefix)
     * @returns {boolean}
     */
    function supportsCSSFeature( prop ) {
        return Boolean( getCSSString( prop ) );
    }

    // ------------------------------------------------------------------
    // UTILS
    // ------------------------------------------------------------------

    var utils = {};

    /**
     * Does a deep search of an object or array and recursively retrieves values that matches the given key name.
     * @param {object|array} obj    The object or array to search through.
     * @param {string} key  The name of the object key to search for.
     * @returns {Array} The plucked array.
     * @memberOf utils
     */
    utils.recursivePluck = function ( obj, key /* stack */ ) {

        // make sure we have a stack to run with
        var stack = arguments[2] || [];

        // go through every sub object of the object/array
        for ( var k in obj ) {

            var o = obj[k];

            // is it an object/array (with potentially more sub objects)?
            if ( utils.isArray( o ) || utils.isObject( o ) ) {
                // recursive pluck FTW!
                stack = utils.recursivePluck( o, key, stack );
            } else
            // is the object we're looking for?
            if ( k === key ) {
                // add it to the stack
                stack.push( o );
            }

        }

        // our job is done, return the stack!
        return stack;

    };

    /**
     * Checks if argument is an array.
     * @param arg           The argument to check.
     * @returns {boolean}   True if argument is array.
     * @see <http://stackoverflow.com/questions/4775722/javascript-check-if-object-is-array>
     * @memberOf utils
     */
    utils.isArray = function ( arg ) {
        return Object.prototype.toString.call( arg ) === '[object Array]';
    };

    /**
     * Checks if argument is an object
     * @param arg           The argument to check.
     * @returns {boolean}   True if argument is object.
     * @see <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof>
     * @memberOf utils
     */
    utils.isObject = function ( arg ) {
        return arg !== null && typeof arg === 'object' && !utils.isArray( arg );
    };

    /**
     * Returns an unique array with maintained order.
     * @param array     The array to make unique.
     * @returns {Array} The unique array.
     * @see <http://stackoverflow.com/questions/13486479/javascript-array-unique>
     * @memberOf utils
     */
    utils.unique = function ( array ) {
        if ( utils.isArray( array ) ) {
            return array.reverse().filter( function ( e, i, array ) {
                return array.indexOf( e, i + 1 ) === -1;
            } ).reverse();
        }
        else {
            return null;
        }
    };

    /**
     * Converts an object into an array.
     * @param object    The object to convert.
     * @returns {Array} The converted object.
     * @memberOf utils
     */
    utils.objectToArray = function ( object ) {
        var array = [];
        if ( utils.isObject( object ) ) {
            for ( var key in object ) {
                if ( object.hasOwnProperty( key ) ) {
                    array.push( object[key] );
                }
            }
        }
        return array;
    };

    /**
     * Returns all the keys associated to given object.
     * @param object    The object to retrieve keys from.
     * @returns {Array} The keys associated to object.
     * @memberOf utils
     */
    utils.objectKeys = function ( object ) {
        var keys = [];
        if ( utils.isObject( object ) ) {
            for ( var key in object ) {
                if ( object.hasOwnProperty( key ) ) {
                    keys.push( key );
                }
            }
        }
        return keys;
    };

    /**
     * Merge the contents of two objects, or more together, into the first object.
     * @returns {Object} The merged object.
     * @member
     */
    utils.merge = function () {

        var i = 0,
            deep = false,
            argLen = arguments.length;

        if ( typeof arguments[0] === "boolean" ) {
            deep = arguments[0];
            i = 1;
        }

        function mergeRecursive( par1, par2 ) {

            /*jshint validthis:true */
            for ( var p in par2 ) {
                if ( par2.hasOwnProperty( p ) ) {
                    try {
                        // Property in destination object set; update its value.
                        if ( utils.isObject( par2[p] ) && deep ) {
                            mergeRecursive( par1[p], par2[p] );
                        } else {
                            par1[p] = par2[p];
                        }
                    } catch ( e ) {
                        // Property in destination object not set; create it and set its value.
                        par1[p] = par2[p];
                    }
                }
            }
        }

        var retObject = arguments[i];

        for ( ; i < argLen; i++ ) {
            mergeRecursive( retObject, arguments[i] );
        }

        return retObject;
    };

    /**
     * Generates a unique key
     * @public
     * @method
     * @returns {string}
     * @memberOf utils
     */
    utils.getRandomKey = function () {

        var str = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz";
        var pl = possible.length;

        for ( var i = 0; i < 20; i++ ) {
            str += possible.charAt( Math.floor( Math.random() * pl ) );
        }

        return str + "_" + (random_counter++);

    };

    /**
     * Iterates over each attribute/item in a list (object or array).
     * @param {Object|Array} list The list to iterate through.
     * @param {Function} iterator The iterator function; called with three arguments (value, key, list).
     * @memberOf utils
     */
    utils.each = function ( list, iterator ) {
        for ( var key in list ) {
            if ( list.hasOwnProperty( key ) ) {
                var val = list[key];
                iterator( val, key, list );
            }
        }
    };

    /**
     * Translate all items in an array to new array of items.
     * @param {Object|Array} list Array or object to translate.
     * @param {Function} callback Function to process each item. Function(key, value, list).
     * @returns {Array}
     * @memberOf utils
     */
    utils.map = function ( list, callback ) {
        var ret = [];
        utils.each( list, function ( value, key ) {
            ret.push( callback( value, key, list ) );
        } );
        return ret;
    };

    /**
     * Checks if an argument is empty or not.
     * @param arg The argument to validate.
     * @returns {boolean} True if empty. Otherwise false.
     * @memberOf utils
     */
    utils.isEmpty = function isEmpty( arg ) {
        if ( utils.isObject( arg ) ) {
            for ( var prop in arg ) {
                if ( arg.hasOwnProperty( prop ) ) {
                    return false;
                }
            }
            return true;
        }
        else if ( typeof arg === "function" ) {
            return !arg();
        }
        return !arg;
    };

    /**
     * @returns {boolean} True if client is touch device
     * @memberOf utils
     */
    utils.isTouchDevice = function () {
        return utils.mobile.any(); // !!('ontouchstart' in window); // || (!!('onmsgesturechange' in window) && !!window.navigator.maxTouchPoints); // Removed test for Windows touch
    };

    /**
     * Source: http://stackoverflow.com/questions/4715762/javascript-move-caret-to-last-character
     * @param el Document element
     * @memberOf utils
     */
    utils.moveCaretToEnd = function ( el ) {
        if ( typeof el.selectionStart === "number" ) {
            el.selectionStart = el.selectionEnd = el.value.length;
        }
        if ( typeof el.createTextRange !== "undefined" ) {
            el.focus();
            var range = el.createTextRange();
            range.collapse( false );
            range.select();
        }
    };

    /**
     * @memberOf utils
     * @type {Object}
     * @property {boolean} ie User agent is Internet Explorer (MSIE)
     * @property {boolean} ie10OrAbove User agent is Internet Explorer version 10 or above
     * @property {boolean} androidInternal User agent is internal Android browser
     * @property {boolean} firefox User agent is Firefox
     */
    utils.browser = {
        ie: (window.navigator.userAgent.indexOf( 'Trident/' ) >= 0),
        ie10OrAbove: (window.navigator.userAgent.match( /[MS]?IE\s?(\d+).*Trident/ ) || window.navigator.userAgent.match( /Trident.*rv\:(\d+)/i ) || [, false])[1] >= 10,
        androidInternal: (/Android.*Version\/[\d\.]+.Mobile/.test( window.navigator.userAgent )),
        firefox: navigator.userAgent.toLowerCase().indexOf( "firefox" ) > -1
    };

    /**
     * @memberOf utils
     * @type {Object}
     * @property {function} android User Agent contains Android
     * @property {function} blackBerry User Agent contains BlackBerry
     * @property {function} iOS User Agent contains iPhone|iPad|iPod
     * @property {function} opera User Agent contains Opera Mini
     * @property {function} windows User Agent contains IEMobile
     * @property {function} any
     */
    utils.mobile = {
        android: function () {
            return navigator.userAgent.match( /Android/i );
        },
        blackBerry: function () {
            return navigator.userAgent.match( /BlackBerry/i );
        },
        iOS: function () {
            return navigator.userAgent.match( /iPhone|iPad|iPod/i );
        },
        opera: function () {
            return navigator.userAgent.match( /Opera Mini/i );
        },
        windows: function () {
            return navigator.userAgent.match( /IEMobile/i );
        },
        any: function () {
            return (utils.mobile.android() || utils.mobile.blackBerry() || utils.mobile.iOS() || utils.mobile.opera() || utils.mobile.windows());
        }
    };

    /**
     * Detects browser features
     * @memberOf utils
     * @property {boolean} cors True if the browser supports Cross Origin Resource Sharing (CORS)
     * @property {boolean} xdm True if the browser supports Cross Document Messaging (XDM)
     * @property {boolean} noPlaceholder True if browser does not support input placeholder
     * @property {boolean} partialPlaceholder True if browser hides placeholder when input is focused
     * @property {boolean} transitionEnd
     * @property {boolean} animationEnd
     * @property {boolean} visibleCursorBehindOverlay True if browser shows cursor in an focused field behind overlay
     * @property {function} scrollbarsize
     * @property {boolean} corsCookie True if the browser supports setting CORS cookie
     */
    utils.features = {
        cors: feature_detection.cors,
        xdm: feature_detection.xdm,
        noPlaceholder: !( 'placeholder' in ( document.createElement( 'input' ) ) ),
        partialPlaceholder: utils.browser.ie10OrAbove || utils.browser.androidInternal,
        transitionEnd: getEventName( 'TransitionEnd' ),
        animationEnd: getEventName( 'AnimationEnd' ),
        visibleCursorBehindOverlay: utils.browser.ie || utils.mobile.iOS(),
        cssAnimation: supportsCSSFeature( 'animation' ),
        scrollbarsize: (function () {

            var body = document.querySelector( "body" );

            // we'll have to instantiate a new div to do some testing
            var scrollDiv = document.createElement( "div" );

            // ensure the scrollbars are "turned on"
            scrollDiv.style.overflow = "scroll";

            // make it part of the DOM
            body.appendChild( scrollDiv );

            // retrieve width (size) of the scrollbar
            var size = scrollDiv.offsetWidth - scrollDiv.clientWidth;

            // remove div from the DOM
            body.removeChild( scrollDiv );

            return size;
        }()),
        mutationObserver: "MutationObserver" in window,
        // are we dealing with an Internet Explorer browser?
        internetExplorer: "ActiveXObject" in window || "XDomainRequest" in window,
        corsCookie: window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()
    };
    // Content Security Policy should be supported on all non-IE browsers
    utils.features.csp = !utils.features.internetExplorer;

    /**
     * @param {String} str String to strip
     * @returns {String} Returns string stripped from HTML
     * @memberOf utils
     */
    utils.stripHtml = function ( str ) {
        if ( str === undefined || str === null ) {
            return str;
        }
        return str.replace( /(<([^>]+)>)/ig, "" );
    };

    utils.urlParameter = function ( name, def ) {
        var parameter = ((new RegExp( name + '=' + '(.+?)(&|$)' )).exec( location.search ) || [, def !== undefined ? def : null])[1];
        return parameter && parameter !== def ? decodeURIComponent( parameter ) : parameter;
    };

    /**
     * @param {Date} date
     * @returns {boolean} True if given date is valid
     * @memberOf utils
     */
    utils.isValidDate = function ( date ) {
        if ( Object.prototype.toString.call( date ) !== "[object Date]" ) {
            return false;
        }
        return !isNaN( date.getTime() );
    };

    /**
     * Counts occurrences of items in an array.
     * @param items {array}
     * @returns {{get: get, countKeys: countKeys, keys: keys, each: each}}
     * @memberOf utils
     */
    utils.countItems = function ( items ) {
        var result = {};
        for ( var i in items ) {
            var item = items[i];
            result[item] = (result[item] || 0) + 1;
        }
        return {
            // returns the number of instances of an item
            get: function ( item ) {
                return result[item] || 0;
            },
            // returns the number of unique items
            countKeys: function () {
                return this.keys().length;
            },
            // returns an array of unique items
            keys: function () {
                return Object.keys( result );
            },
            // iterates through every item applying function (f) which returns an array with all results, usage:
            // f (item, count)
            each: function ( f ) {
                var res = [];
                for ( var i in result ) {
                    res.push( f( i, result[i] ) );
                }
                return res;
            }
        };
    };

    /**
     * Transform xml and xslt into html
     * @param {string} xml Input XML
     * @param {string} xsl XSLT Stylesheet
     * @returns {string} HTML string
     * @memberOf utils
     */
    utils.transformXml = function ( xml, xsl ) {
        if ( window.ActiveXObject || "ActiveXObject" in window ) {
            var xslt = new ActiveXObject( "Msxml2.XSLTemplate" );
            var xmlDoc = new ActiveXObject( "Msxml2.DOMDocument" );
            var xslDoc = new ActiveXObject( "Msxml2.FreeThreadedDOMDocument" );
            xmlDoc.loadXML( xml );
            xslDoc.loadXML( xsl );
            xslt.stylesheet = xslDoc;
            var xslProc = xslt.createProcessor();
            xslProc.input = xmlDoc;
            xslProc.transform();
            // Normalize newLine
            return xslProc.output.replace( "\n", "\n" );
        } else {
            var parser = new DOMParser();
            var xmlObj = parser.parseFromString( xml, "text/xml" );
            var xslObj = parser.parseFromString( xsl, "text/xml" );

            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet( xslObj );
            var htmlObj = xsltProcessor.transformToDocument( xmlObj );

            var xmlSerializer = new XMLSerializer();
            // Normalize newLine
            return xmlSerializer.serializeToString( htmlObj ).replace( "\n", "\n" );
        }
    };

    function closeDocumentWindow() {
        clearInterval( docWindowInterval );
        eventHandler.fire( "close_document_window" );

        if ( global.docWindow && global.docWindow.window ) {
            global.docWindow.removeEventListener( "beforeunload", closeDocumentWindow );
            global.docWindow.close();
        }

        window.removeEventListener( "beforeunload", closeDocumentWindow );
        window.focus();
        global.docWindow = null;
        global.docWindowId = null;
    }

    utils.openDocumentWindow = function ( documentId ) {

        global.docWindowId = documentId;

        if ( global.docWindow && !global.docWindow.closed ) {
            global.docWindow.focus();
            return global.docWindow;
        }

        global.docWindow = window.open( "about:blank", "bid_doc", getFeatureString() );
        global.docWindow.focus();

        // In FF, if "about:blank" is opened, it applys a basic DOM after a short while (<1s). By doing so the browser
        // overwrites anything appended to the exsiting DOM. To avoid this behaivor we'll write our own basic DOM -
        // basically telling FF that we're good and it should do no further DOM update.
        global.docWindow.document.open();
        global.docWindow.document.write(
            '<html>' +
            '<head>' +
            '<title>BankID</title>' +
            '<meta name="viewport" content="initial-scale=1.0"/>' +
            '<meta http-equiv="X-UA-Compatible" content="IE=edge"/>' +
            '</head>' +
            '<body>' +
            '</body>' +
            '</html>'
        );
        global.docWindow.document.close();

        global.docWindow.addEventListener( "beforeunload", closeDocumentWindow );
        window.addEventListener( "beforeunload", closeDocumentWindow );

        // check periodically if window has been closed, for browsers that does not support "beforeunload" (iOS Safari)
        clearInterval( docWindowInterval );
        docWindowInterval = setInterval( function () {
            // doc display window has been closed
            if ( global.docWindow && !global.docWindow.window ) {
                closeDocumentWindow();
            }
        }, CHECK_DOC_WINDOW_INTERVAL );

        return global.docWindow;

    };

    function getFeatureString() {

        var w = global.docWindowWidth;
        var h = global.docWindowHeight;

        // centers the new window
        var left = ( screen.width / 2 ) - (w / 2);
        var top = ( screen.height / 2 ) - (h / 2);

        return [
            global.strWinFeatures,
            "width=" + w,
            "height=" + h,
            "left=" + left,
            "top=" + top
        ].join( "," );

    }

    utils.closeDocumentWindow = function () {
        closeDocumentWindow();
    };

    return utils;

} )
;
