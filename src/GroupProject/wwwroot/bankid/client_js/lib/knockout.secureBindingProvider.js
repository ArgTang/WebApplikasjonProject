/**
 * @name SecureBindingProvider
 * @description
 * <p>The default binding provider looks for any elements that have a <code>data-bind</code> attribute.
 * When the binding provider finds an element with this attribute, then it will parse the
 * attribute value, using <code>eval</code> and turn it into a binding object using the current data context.</p>
 * <p>SecureBindingProvider does exactly the same without the use of the evil <code>eval</code>.
 * This means that it is no longer possible to write javascript directly in the <code>data-bind</code> attribute.
 * Only the use of reference objects and scopes are allowed.</p>
 * @exports Knockout
 * @author Staale Raknes, Knowit 2014
 * @repositiry git@github.knowit.no:starak/knockout-secureBindingProvider.git
 * @require js/external/knockout.js
 */
"use strict";

define( [ "knockout" ], function ( ko ) {

    var knockoutTriggerEvent = ko.utils.triggerEvent;

    /**
     * Using fragments may cause error when dispatching events in knockout. Therefore we'll check if the element,
     * which is dispatching an event, is part of the DOM-tree. Otherwise we'll return silently from the function.
     * @param {element} element HTML element which triggers the event.
     * @param {string} eventType
     */
    ko.utils.triggerEvent = function ( element, eventType ) {

        // the current element we're checking
        var el = element;

        // the last successful element found
        var lastEl = null;

        // for as long as we're dealing with an element we'll search ever upward
        while ( el ) {

            // store the last successful element
            lastEl = el;

            // retrieve the element's parent
            el = el.parentNode;

        }

        // okay, so now it's time to check whether we've reached the document node
        if ( lastEl !== document ) {
            // if not we'll abort the event dispatchment
            return;
        }

        // everything in order, let's give control back to knockout's triggerEvent-function
        knockoutTriggerEvent( element, eventType );

    };

    /**
     * Finding the required context
     * @privat
     * @param bindingPath {Array}
     * @param context {Object} ViewModel
     * @param node {Element}
     * @param bindingContext {Object}
     * @returns {Object|Element}
     */
    function getContext( bindingPath, context, node, bindingContext ) {

        // loop through all nested contexts
        for ( var i = 0; i < bindingPath.length; i++ ) {

            var binding = bindingPath[ i ];

            // The nested binding is a function call
            if ( /\(.*\)/ig.test( binding ) ) {

                var functionName = binding.replace( /\(.*\)/ig, "" );
                var functionParameters = binding.replace( /^.*\((\$.*)\).*$/ig, "$1" ) || "";

                if ( functionParameters === binding ) {
                    functionParameters = "";
                }

                var functionParameterArray = functionParameters.split( "," );
                var functionParameterContextArray = [];

                for ( var p = 0; p < functionParameterArray.length; p++ ) {

                    if ( !functionParameterArray[p] ) {
                        continue;
                    }

                    var functionParameterContext = getContext(
                        [functionParameterArray[p].replace( /\(.*\)/ig, "" )],
                        context,
                        node,
                        bindingContext
                    );

                    if ( typeof functionParameterContext === "function" ) {
                        functionParameterContext = functionParameterContext.call( bindingContext );
                    }

                    functionParameterContextArray.push( functionParameterContext );
                }

                if ( typeof context[ functionName ] === "function" ) {
                    context = context[ functionName ].apply( context, functionParameterContextArray );
                }

                // if the binding name is $element, point to the element node
            } else if ( binding === "$element" ) {

                context = node;

                // if the binding starts with a "$" point it to the binding context. Ex: $data, $root, $parent
            } else if ( /^\$/.test( binding ) ) {

                context = bindingContext[ binding ];

                // else try to point it to the model context
            } else {
                context = context[ binding ];
            }

            /**
             * Prevent context to leak out of the viewmodel
             * Ex:  $element.ownerDocument // <-- document
             *      $element.ownerDocument.defaultView // <-- window
             */
            if ( context === window || context === document ) {
                context = null;
            }

        }

        return context;
    }

    /**
     * Secure Binding Provider
     * @constructor SecureBindingProvider
     */
    function SecureBindingProvider() {
        this.attribute = "data-bind";
    }

    /**
     * Parsing bindings and routing context
     * @public
     * @method
     * @memberof SecureBindingProvider
     * @param binding {String}
     * @param node {Element}
     * @param bindingContext {Object}
     * @returns {Function}
     */
    SecureBindingProvider.prototype.bindingRouter = function ( binding, node, bindingContext ) {

        var bindingPath,
            bindingArr,
            re = /(\w+):{([^}]*)}/,         // matching 'foo: {bar:"baz"}'
            re2 = /^(\w+):/,                // matching 'foo: [$]anything'
            re3 = /[^,]*\((\$.*)\).*$/ig,   // matching 'foo: isActive($index())'

            matches1 = re.exec( binding ),
            matches2 = re2.exec( binding );

        if ( matches1 !== null ) {
            // Object literal ex: css:{error:$root.error()}

            //console.log("SBP Object literal", binding);

            var bind = matches1[ 2 ];
            var fnAttributeArray = [];
            var matches3;

            // pickup and remove bindings with function calls
            while ( ( matches3 = re3.exec( bind ) ) ) {
                fnAttributeArray.push( matches3[0] );
            }
            // remove function bindings and clean
            bind = bind.replace( re3, "" ).replace( /^\s*,/, "" ).replace( /,\s*$/, "" );

            var tmpArray = bind !== "" ? bind.split( "," ) : [];

            var AttributeArray = tmpArray.length >= 1 ? fnAttributeArray.concat( tmpArray ) : fnAttributeArray;

            return function () {
                var ret = {}, ia;

                ret[matches1[1]] = {};

                for ( ia = 0; ia < AttributeArray.length; ia++ ) {
                    bindingArr = AttributeArray[ia].split( ":" );
                    bindingPath = bindingArr[1].split( "." );
                    ret[ matches1[ 1 ]][ bindingArr[ 0 ] ] = getContext( bindingPath, this, node, bindingContext );

                }

                return ret;

            };

        } else if ( matches2 ) {
            // Ordinary binding ex: foo:bar
            //console.log("SBP Ordinary binding", binding);
            bindingArr = binding.split( ":" );
            bindingPath = bindingArr[1].split( "." );

            return function () {
                var ret = {};
                ret[ bindingArr[ 0 ] ] = getContext( bindingPath, this, node, bindingContext );
                return ret;
            };

        } else {
            throw("Secure Binding Provider error: " + binding);
        }

    };

    /**
     * @public
     * @method
     * @memberof SecureBindingProvider
     * @param node {Element}
     * @param bindingContext {Object}
     * @returns {Object} The bindings to a given node, and the bindingContext
     */
    SecureBindingProvider.prototype.getBindings = function ( node, bindingContext ) {

        var i, j,
            bindingAccessor,
            binding,
            result = {},
            bindings = "";

        if ( node.nodeType === 1 ) {
            bindings = node.getAttribute( this.attribute );
        }

        if ( bindings ) {
            var newBindings = [];

            /**
             * Look for valid bindings
             * @type {RegExp}
             * @example
             *  Matching:
             *
             *      foo
             *      foo()
             *      foo($index)[,$data])
             *
             *      text:bar
             *      text:bar()
             *      text:bar($index)[,$data])
             *
             *      css:{bar:baz}
             *      css:{bar:baz()}
             *      css:{bar:baz($index)[,$data]}
             *
             *  Parameters:
             *      $data       -> Current scope
             *      $root       -> ViewModel root
             *      $parent     -> Parent to current scope
             *      $element    -> Current element node
             *      $index      -> Current index (foreach only)
             *
             */
            var re = /((\w+\s*:+\s*({([^}]*)}))|((\$?\w|\.)+\s*(\((\$?\w|\.|,|\(|\))*\))?(:+\s*(\$?\w|\.|\(|\))+)?))/g, matches;
            while ( ( matches = re.exec( bindings ) ) ) {
                newBindings.push( matches[1].replace( /(\s|\u00A0|'|")+/g, "" ) );
            }

            bindings = newBindings;

            //console.log( bindings );

            for ( i = 0, j = bindings.length; i < j; i++ ) {
                bindingAccessor = this.bindingRouter( bindings[i], node, bindingContext );
                if ( bindingAccessor ) {
                    binding = typeof bindingAccessor === "function" ? bindingAccessor.call( bindingContext.$data, bindingContext, bindings ) : bindingAccessor;
                    ko.utils.extend( result, binding );
                }
            }
        }

        return result;
    };

    /**
     *
     * @memberof SecureBindingProvider
     * @param node
     * @returns {Boolean} True if the node has a binding attribute set
     */
    SecureBindingProvider.prototype.nodeHasBindings = function ( node ) {
        return Boolean( node.nodeType === 1 && node.getAttribute( this.attribute ) );
    };

    /**
     * Add our new bindig provider to Knockout
     * @memberof SecureBindingProvider
     * @type {SecureBindingProvider}
     */
    ko.bindingProvider.instance = new SecureBindingProvider();

    /**
     * Custom bindings for opposite visible
     */
    ko.bindingHandlers.hidden = {
        update: function ( element, valueAccessor ) {
            ko.bindingHandlers.visible.update( element, function () {
                return !ko.utils.unwrapObservable( valueAccessor() );
            } );
        }
    };

    /**
     * Knockout is now equipped with a new, secure binding provider, so we only return Knockout
     */
    return ko;

} );
