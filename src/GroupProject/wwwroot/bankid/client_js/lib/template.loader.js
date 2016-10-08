/*!
 * TemplateLoader is a Require plugin to load template dependencies, by Knowit Reaktor Magma - Staale Raknes, 2013
 * It has dependency to the Text plugin
 *
 * @example
 * require.config({paths:{tmpl:"path/to/template.loader"}})
 * require(["tmpl!path/to/template.html"], function( tmpl ){
 *
 *     document.body.appendChild( tmpl );
 *
 * });
 */
define( function () {

    "use strict";

    var collectTypeAttribute = "data-collect-type",
        collectAsAttribute = "data-collect-as";

    function stripEmptyTextNodes( elem ) {
        var children = elem.childNodes;
        var child;
        var len = children.length;
        var i = 0;
        var whitespace = /^\s*$/;
        for ( ; i < len; i++ ) {
            child = children[i];
            if ( child.nodeType === 3 ) {
                if ( whitespace.test( child.nodeValue ) ) {
                    elem.removeChild( child );
                    i--;
                    len--;
                }
            } else if ( child.nodeType === 1 ) {
                stripEmptyTextNodes( child );
            }
        }
    }

    /**
     * Parse html string in a document fragment
     * @privat
     * @param html {String}
     * @param [clean] {Boolean}
     * @returns {DocumentFragment}
     */
    function parseStr( html, clean ) {

        var fragment = document.createDocumentFragment(),
            div = document.createElement( 'div' ),
            collection = {};

        // Convert html string to elements
        div.innerHTML = html;

        // Get elements to collect
        var returnElements = div.querySelectorAll( "[" + collectAsAttribute + "]" );

        // Collect elements to return
        var length = returnElements.length;
        for ( var i = 0; i < length; i++ ) {

            var rel = returnElements[ i ];

            var type = rel.getAttribute( collectTypeAttribute );
            var name = rel.getAttribute( collectAsAttribute );

            if ( type === "array" ) {

                if ( !collection[ name ] ) {

                    collection[ name ] = [];

                } else {

                    if ( typeof collection[ name ].push !== "function" ) {

                        // Already declared as an element
                        throw new Error( "Error in template collection! Duplicate declaration: '" + name + "'." );

                    }

                }

                collection[ name ].push( rel );

            } else if ( !collection[ name ] ) {

                rel.clone = clone;
                collection[ name ] = rel;

            } else {

                // Already declared
                throw new Error( "Error in template collection! Duplicate declaration: '" + name + "'." );

            }

            if ( clean ) {
                rel.removeAttribute( collectTypeAttribute );
                rel.removeAttribute( collectAsAttribute );
            }
        }

        stripEmptyTextNodes( div );

        // Move elements to document fragment
        while ( div.firstChild ) {

            fragment.appendChild( div.firstChild );

        }

        // Fetch collection to document fragment
        for ( var el in collection ) {

            if ( collection.hasOwnProperty( el ) ) {

                fragment[el] = collection[ el ];

            }

        }

        return fragment;

    }

    function clone() {
        /*jshint validthis:true */
        var ret = parseStr( this.outerHTML, true );
        return ret;
    }

    return {

        version: '0.1',

        load: function ( name, req, onLoad, config ) {

            /**
             * Get the template name.
             * Ex: 'some/template.html!myTemplate' will get 'myTemplate' as name
             */
            var arrName = name.split( "!" ),
                nName = arrName[0],
                altName = arrName[1];

            /**
             * Load the file using the Require Text plugin
             */
            req( ['text!' + nName], function ( tmplText ) {

                // Do not bother with the work if its a build
                if ( config.isBuild ) {
                    // return nothing if it is a build
                    onLoad();
                    return;
                }

                /**
                 * The plugin return a document fragment, containing the template 'name' and 'data'
                 * @type {DocumentFragment}
                 */
                var fragment = parseStr( tmplText );
                fragment.name = altName;
                fragment.data = fragment;

                // return / load the result
                onLoad( fragment );

            } );

        }

    };

} );
