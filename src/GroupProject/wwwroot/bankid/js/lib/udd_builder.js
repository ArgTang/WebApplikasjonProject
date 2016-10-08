/**
 * Retrieves URL to an udd config and view model based on a GET-parameter.
 */

"use strict";

define( function ( ) {

    var uc = require.s.contexts._.config.config.udd;

    return {
        config: {
            // the GET parameter we're retrieving
            uddParam: "udd",
            // default path and prefix/suffix for udd config files
            uddConfigPath: "/udd/js/udd_build/udd_%.js",
            // default path and prefix/suffix for udd view model files
            uddVMPath: "/udd/js/udd_build/udd_%_vm.js"
        },
        /**
         * Retrieves the parameter from the page's URL.
         * @param name
         * @returns {string} Returns the given parameter's value.
         */
        urlParameter: function ( name ) {
            return decodeURI( ((new RegExp( name + '=' + '(.+?)(&|$)' )).exec( location.search ) || [, null])[1] );
        },
        /**
         * @returns {string} Returns the given UDD id, default UDD if given is not in white list.
         */
        uddId: function ( id ) {
            var uddId = id || this.urlParameter( this.config.uddParam );
            return uc.views.indexOf( uddId ) > -1 ? uddId : uc.views[0];
        },
        /**
         * Parses the GET udd-parameter (?udd=) and returns a validated udd config file.
         * If file is not on the white list the first file on that list is returned instead.
         * @returns {string}    The path to the udd config file.
         */
        uddConfigPath: function ( uddId ) {
            uddId = this.uddId( uddId );
            return this.config.uddConfigPath.replace( "%", uddId );
        },
        /**
         * Parses the GET udd-parameter (?udd=) and returns a validated udd view model.
         * If file is not on the white list the first file on that list is returned instead.
         * @returns {string}
         */
        uddVM: function ( uddId ) {
            uddId = this.uddId( uddId );
            return this.config.uddVMPath.replace( "%", uddId );
        }
    };
} );
