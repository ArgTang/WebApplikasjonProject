/*global NodeList:false*/

/**
 * DomHelper is a kind of a mini jQuery :)

 * @class
 * @name DomHelper
 * @memberOf lib
 *
 * @example
 * require(["dom"], function($){
 *     $("div.myclassname").each(function(){
 *         this.backgroundColor = "red";
 *     });
 * });
 */
define( ["domx"], function ( ex ) {
    "use strict";

    /**
     * DomHelper
     * @constructor DomHelper
     */
    function DomHelper() {
    }

    var methods = new DomHelper();

    /**
     * Appends DomHelper methods to argument.
     * @param arg
     */
    function init( arg ) {
        for ( var method in methods ) {
            arg[method] = methods[method];
        }
    }

    /**
     * @private
     * @param query mixed - CSS Selector as string, element or array of elements
     * @param [parent] - The element to run the query in. Defaults to document.
     * @return {Array}
     */
    function getQuery( query, parent ) {
        /*jshint validthis:true */
        parent = parent || document;

        var ret = [], i, j;

        //console.log(query, parent);
        if ( typeof query === "string" ) { // CSS Selector

            // Convert NodeList to a proper array
            //ret = typeof parent.querySelectorAll === "function" ? [].splice.call( parent.querySelectorAll( query ), 0 ):[];
            if ( typeof parent.querySelectorAll === "function" ) {
                var result = parent.querySelectorAll( query );
                for ( i = 0, j = result.length; i !== j; ret.push( result[i++] ) ) {
                }
            }

        } else if ( query instanceof Array || query instanceof NodeList ) { // Array of elements

            // Ensure it is a proper array
            ret = [];
            for ( i = 0; i < query.length; i++ ) {
                ret.push( query[i] );
            }

        } else if ( (query && query.nodeType === 1) || query === window || query === document ) { // DOM Element or window/document

            ret = [query];

        }
        else { // Error
            //throw new Error("DomHelper failed");
            ret = [];

        }

        // add methods
        init( ret );

        return ret;
    }

    getQuery.extend = function extend( obj ) {
        for ( var prop in obj ) {
            if ( obj.hasOwnProperty( prop ) ) {
                DomHelper.prototype[ prop ] = obj[ prop ];
            }
        }
    };

    /**
     *  @exports module:DomHelper.DomHelper
     */
    var exports = {

        /**
         * Make it possible to do new query search within it self
         * @memberOf lib.DomHelper
         */
        __$: getQuery,

        /**
         * Returns the n'th element if exists, null returns the first, -1 returns the last.
         * @param [n] The n'th element to retrieve.
         * @memberOf lib.DomHelper
         * @returns {Array} Returns the n'th element.
         */
        element: function ( n ) {

            var el = null;

            if ( this instanceof Array ) {

                if ( n === -1 ) { // return the last element if n is set to -1

                    el = this[ this.length - 1 ];

                } else if ( !n ) { // return first element n is not set or is set to 0

                    el = this[ 0 ];

                } else if ( n in this && this[ n ] ) { // return the n'th element if it exists

                    el = this[ n ];

                }

            } else {

                el = this;

            }

            // If there's still no element, return 'this'
            if ( !el ) {
                return null;
            }

            // add methods
            init( el );

            return el;
        },

        /**
         * Iterates over all elements, executing a function for each element.
         * @param fn Function to execute for each matched element. (function(index) {}).
         * @memberOf lib.DomHelper
         * @returns {*} Array or element
         */
        each: function ( fn ) {

            if ( this instanceof Array ) { // loop and execute callback for each element in array

                for ( var i = 0; i < this.length; i++ ) {

                    fn.call( this.element( i ), i );

                }

            } else { // execute callback for element

                fn.call( this, 0 );

            }

            return this;
        }

    };
    /**
     * Extend core
     *
     */


    getQuery.extend( exports );

    /**
     * Extend
     */
    getQuery.extend( ex );

    return getQuery;

} );