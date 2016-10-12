"use strict";

(function () {

    /**
     * @param name
     * @returns {string} URL parameter value for given name
     * @private
     */
    var _urlParameter = function ( name ) {
        return decodeURI( ((new RegExp( name + '=' + '(.+?)(&|$)' )).exec( location.search ) || [, null])[1] );
    };

    // locale config given in require config
    var config = require.s.contexts._.config.config.locale,
    // selected locale
        locale = null,
    // locale paths to load
        localeToLoad = null,
        localeToLoadAdditional = null,
    // locale id given in URL query
        localeQuery = _urlParameter( config.query )
        ;

    // find locale query in list of locales
    var indexOf = config.list.indexOf(localeQuery);
    
    // if locale is in list and locale is NOT mock locale
    if ( indexOf > -1 && localeQuery !== "zz" ) {
        // locale  found in list of locales
        locale = config.list[indexOf];
    }
    // choose default locale, if set and is in list
    else if ( config.default && config.list.indexOf( config.default ) > -1 ) {
        locale = config.default;
    }
    // choose the first locale in list
    else {
        locale = config.list[1];
    }

    // locale not given
    if ( !locale ) {
        console.error( "Could not find locale" );
    }

    // locale path
    localeToLoad = config.path + config.file.replace( "%", locale );

    // additional texts (that are not part of the standard COI-terminology but needed for the UDD viewer)
    localeToLoadAdditional = config.path + config.file.replace( "%", locale + "_additional" );

    define( ["utils", localeToLoad, localeToLoadAdditional], function ( utils, locale, localeAdditional ) {
        // merge locale
        utils.merge( locale, localeAdditional );

        // replace locale values if mock language
        if ( localeQuery === "zz" ) {
            utils.each( locale, function ( val, key ) {
                locale[key] = "[" + key + "]";
            } );
        }

        /**
         * @param {string} string
         * @param {string...} replace
         * @returns {*}
         */
        locale.replace = function ( string, replace ) {
            // replace is object
            if ( utils.isObject( replace ) ) {
                return string;
            }
            // string replace all arguments
            else {
                var argLength = arguments.length;
                for ( var i = 1; i < argLength; i++ ) {
                    // add arguments to end of string if mock language
                    if ( localeQuery === "zz" || localeQuery === "mm_MM" ) {
                        string += arguments[i];
                    }
                    // replace string with argument if match
                    else {
                        string = string.replace( /\$/, arguments[i] );
                    }
                }
                return string;
            }
        };

        // XXX Fix for client locale

        locale.get = function ( key, input ) {
            if ( input ) {
                return replaceTokens( locale[key] || key, input );
            }
            return locale[key] || key;
        };

        function replaceTokens( key, args ) {
            for ( var i = 0; i < args.length; i++ ) {
                if ( args[i] ) {
                    // add arguments to end of string if mock language
                    if ( localeQuery === "zz" ) {
                        key += args[i];
                    }
                    else {
                        key = key.replace( '$', args[i] );
                    }
                }
            }
            return key;
        }

        // XXX /Fix for client locale

        return locale;
    } );

}());