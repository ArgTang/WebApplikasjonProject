"use strict";

/**
 * @namespace templategenerator
 */

/**
 * Template generator build definition
 * @typedef {Object} ViewBuild
 * @memberOf templategenerator
 */

/**
 * Template generator view fragment
 * @typedef {DocumentFragment} ViewFragment
 * @memberOf templategenerator
 */

define( [
    'dom',
    'ko',
    'utils',
    'templates'
], function ( $, ko, utils, templates ) {

    /**
     * Adds a child element to a mother element.
     * @param {DOMElement} motherElement Element that will be appended to
     * @param {DOMElement} childElement Elment that will be appended
     * @param {string} selector A selector to the element in mother fragment to append the child fragment.
     */
    function appendChild( motherElement, childElement, selector ) {
        // does the top level element have a data-container attribute?
        if ( $( motherElement ).attribute( 'data-container' ) !== undefined ) {
            // ...then append the fragment to that element
            motherElement.appendChild( childElement );
        } else {
            // ...if not we'll make use of the selector to find the target element
            try {
                var element = motherElement.querySelector( selector );
                element.appendChild( childElement );
            } catch ( err ) {
                throw "TemplateGenerator.appendChildFragment: Element is null";
            }
        }
    }

    /**
     * Returns a template by looking up that template (id) within a template collection (file).
     * @param {ViewBuild} build The partial build. The build must contain a tmpl-object with file and id attributes.
     * @returns {object} A template.
     * @param documentContext Optional. A window.document object.
     * @returns {*}
     */
    function getTemplate( build, documentContext ) {
        if ( !build ) {
            throw "TemplateGenerator.getTemplate: Build is empty";
        }
        return documentContext ? templates.getFragment( build.tmpl.file, build.tmpl.id, documentContext ) : templates[build.tmpl.file][build.tmpl.id];
    }

    /**
     * Takes a build definition, goes through the whole definition recursively, and produces one "mother of all"
     * document fragment.
     * @param {ViewBuild} build The build definition.
     * @param documentContext Optional. A window.document object.
     * @returns {ViewFragment} The complete build translated into a document fragment.
     */
    var generate = function ( build, documentContext ) {

        var motherElement = getTemplate( build, documentContext );

        if ( !motherElement || !("cloneNode" in motherElement) ) {
            throw "TemplateGenerator.generate: Mother element can not be cloned";
        }

        // we'll need a unique element
        var element = motherElement.cloneNode( true );

        if ( build.mod ) {
            // after setting applying bindings to fragment...
            ko.applyBindings( build.mod, element );
            // ...make the mother fragment available to the build's view model.
            build.mod.fragment = element;
        }

        // retrieve fragment's children based on container
        var container = build.container;

        var childElement;

        // is there a container (with children)?
        if ( container ) {

            // is the container a single child (ie. it already has a tmpl object)?
            if ( container.tmpl ) {

                // generate a fragment based on the container...
                childElement = generate( container, documentContext );
                // ... and append it
                appendChild( element, childElement, '[data-container]' );

            }
            // ... otherwise we're dealing with a container with multiple children
            else {

                // go through every child (defined in container)
                utils.each( container, function ( build, key ) {

                    if ( build === null ) {
                        return;
                    }

                    // generate fragment
                    childElement = generate( build, documentContext );

                    // declare a selector string
                    var selector;

                    // where should the child fragment be injected?
                    if ( utils.isArray( container ) ) {
                        // the container has only one placeholder
                        selector = '[data-container]';
                    } else if ( build.tmpl || build.container ) {
                        // the container has multiple placeholders - we'll use key as the attribute value
                        selector = '[data-container=' + key + ']';
                    }

                    appendChild( element, childElement, selector, documentContext );

                } );
            }
        }

        return element;

    };

    return generate;

} );
