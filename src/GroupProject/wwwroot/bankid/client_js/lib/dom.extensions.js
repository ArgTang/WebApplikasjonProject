/*global NodeList:false*/
"use strict";

define( function () {

    /**
     * Ease in/out based on danro's jQuery plugin
     * https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
     * @param time {Number} current time
     * @param startVal {Number} start value
     * @param changeInVal {Number} change in value
     * @param duration {Number} duration
     * @returns {Number}
     */
     function easeInOutQuad( time, startVal, changeInVal, duration ) {
	var d2 = duration / 2;
	var t2 = time / d2;
        if ( t2 < 1 ) {
            return changeInVal / 2 * t2 * t2 + startVal;
        }
        t2--;
        return -changeInVal / 2 * (t2 * (t2 - 2) - 1) + startVal;
    }

    return {

        /**
         * Insert content to end of each element in matched elements.
         * @param {String|Array|Element} content DOM element, Array or HTML string to be inserted at end of each element.
         * @memberOf lib.DomHelper
         * @returns {Array<Element>} Array or element
         */
        append: function ( content ) {
            var elements = [], i = 0;

            if ( typeof content === "string" ) {

                // convert html to document.element
                var doc = document.createElement( "div" );

                doc.innerHTML = content;

                for ( i = 0; i < doc.children.length; i++ ) {
                    elements.push( doc.children[i] );
                }

            }
            else if ( content instanceof Array || content instanceof NodeList ) {

                for ( i = 0; i < content.length; i++ ) {
                    elements.push( content[i] );
                }

            }
            else if ( content instanceof Element ) {

                // DOMElement
                elements.push( content );

            }

            if ( elements.length > 0 ) {
                var $el = this.element( 0 ),
                    elLen = elements.length;
                for ( var i = 0; i < elLen; i++ ) {
                    $el.appendChild( elements[i] );
                }
            }
            return this;
        },

        /**
         * appendTo puts every element OR the element into the first element matching the 'query' selector OR element
         * @param {string} query string (css selector) or element
         * @memberOf lib.DomHelper
         * @returns {Array<Element>} array or element
         */
        appendTo: function ( query ) {

            var parent = typeof query === "string" ? document.querySelector( query ) : query;

            this.each( function () {

                parent.appendChild( this );

            } );

            return this;
        },

        /**
         * Get the descendants of each element in the current set of matched elements, filtered by a query
         * @param query mixed - CSS Selector as string, element or array of elements
         * @memberOf lib.DomHelper
         * @returns {Array}
         */
        find: function ( query ) {

            var ret = [];

            this.each( function () {
                this.__$( query, this ).each( function () {
                    ret.push( this );
                } );
            } );

            return this.__$( ret );

        },

        /**
         * Reduces set of matched elements the first in set.
         * @memberOf lib.DomHelper
         * @returns {Array}
         */
        first: function () {

            return this.element( 0 );

        },

        /**
         * Reduces set of matched elements the last in set.
         * @memberOf lib.DomHelper
         * @returns {Array}
         */
        last: function () {

            return this.element( -1 );

        },

        /**
         * Determine if any matched elements are assigned given class name.
         * @param {String} cls Class name to look for.
         * @memberOf lib.DomHelper
         * @returns {boolean} True if any matched elements are assigned given class name.
         */
        hasClass: function ( cls ) {
            var ret = false;
            this.each( function () {
                if ( !ret && this.className.split( " " ).indexOf( cls ) > -1 ) {
                    ret = true;
                }
            } );
            return ret;
        },

        /**
         * Add or remove on class from matched elements.
         * @param {String} cls Class name to toggle.
         * @memberOf lib.DomHelper
         * @returns {*}
         */
        toggleClass: function ( cls ) {
            this.each( function () {
                var clss = this.className.split( " " );
                var indexOf = clss.indexOf( cls );
                if ( indexOf > -1 ) {
                    clss.splice( indexOf, 1 );
                }
                else {
                    clss.push( cls );
                }
                this.className = clss.join( " " );
            } );

            return this;

        },

        /**
         * Adds the specified class to each matched elements.
         * @param cls Class name.
         * @memberOf lib.DomHelper
         * @returns {*}
         */
        addClass: function ( cls ) {
            this.each( function () {
                var clss = this.className.split( " " );
                if ( clss.indexOf( cls ) === -1 ) {
                    clss.push( cls );
                }
                this.className = clss.join( " " );
            } );

            return this;
        },

        /**
         * Removes the specified class to each matched elements.
         * @param cls Class name.
         * @memberOf lib.DomHelper
         * @returns {*}
         */
        removeClass: function ( cls ) {
            this.each( function () {
                var clss = this.className.split( " " );
                var indexOf = clss.indexOf( cls );
                if ( indexOf > -1 ) {
                    clss.splice( indexOf, 1 );
                }
                this.className = clss.join( " " );
            } );

            return this;

        },

        /**
         * Swap the specified classes on each matched elements.
         * @param {Array|String} oldcls The class name to swap.
         * @param {String} newcls
         * @memberOf lib.DomHelper
         * @returns {*}
         */
        swapClass: function ( oldcls, newcls ) {

            oldcls = typeof oldcls === "string" ? [oldcls] : oldcls;
            var length = oldcls.length;

            this.each( function () {

                for ( var i = 0; i < length; i++ ) {

                    var clss = this.className.split( " " );
                    var indexOf = clss.indexOf( oldcls[i] );

                    if ( indexOf > -1 ) {
                        clss.splice( indexOf, 1 );
                        clss.push( newcls );
                    }

                    this.className = clss.join( " " );
                }

            } );

            return this;

        },

        /**
         * Removes the set of matched elements from the DOM.
         * @memberOf lib.DomHelper
         * @returns {boolean} True if one or more matched elements are removed from the DOM.
         */
        remove: function () {
            var ret = false;

            this.each( function () {
                if ( this.parentNode ) {
                    this.parentNode.removeChild( this );
                    ret = true;
                }
            } );

            return ret;
        },

        /**
         * Attach a handler to an event of the elements in the set.
         * @param {String} eventTypes DOM event types, seperated by " ".
         * @param {Function} handler A function to execute each time the event is triggered.
         * @memberOf lib.DomHelper
         * @returns {*}
         */
        bind: function ( eventTypes, handler ) {
            this.each( function () {
                var context = this;
                eventTypes.split( " " ).forEach( function ( eventType ) {
                    context.addEventListener( eventType, handler );
                } );
            } );

            return this;
        },

        /**
         * Remove a previously-attached event handler to elements in the set.
         * @param {String} eventTypes DOM event types, seperated by " ".
         * @param {Function} handler A function that is to be no longer executed.
         * @memberOf lib.DomHelper
         * @returns {*}
         */
        unbind: function ( eventTypes, handler ) {
            this.each( function () {
                var context = this;
                eventTypes.split( " " ).forEach( function ( eventType ) {
                    context.removeEventListener( eventType, handler );
                } );
            } );

            return this;
        },

        /**
         * Set one or more CSS properties
         * @param {(string|object)} property CSS property name or object of property-value pairs.
         * @param {string} [value] Value to set for the property.
         * @memberOf lib.DomHelper
         * @returns {*}
         */
        css: function ( property, value ) {
            this.each( function () {

                if ( typeof property === "string" && typeof value === "string" ) {

                    this.style.setProperty( property, value, null );

                } else {

                    for ( var p in property ) {
                        if ( property.hasOwnProperty( p ) ) {
                            this.style.setProperty( p, property[p], null );
                        }
                    }

                }
            } );

            return this;
        },

        /**
         * Get the current position of the first element in set
         * @memberOf lib.DomHelper
         * @returns {Object} Top, right, bottom, left, width and height. Empty object if set does not contain any elements.
         */
        position: function () {
            var element = this.element( 0 );
            if ( element ) {
                var pos = element.getBoundingClientRect();
                return {
                    top: pos.top,
                    right: pos.right,
                    bottom: pos.bottom,
                    left: pos.left,
                    width: pos.width,
                    height: pos.height
                };
            }
            else {
                return {};
            }
        },

        /**
         * Get the value of an attribute for the first element in the set of matched elements or attribute for matched elements.
         * @param {string} name The name of the attribute.
         * @param {string} [value] Value to set the attribute.
         * @memberOf lib.DomHelper
         * @returns {*|string} The element or the attribute value.
         */
        attribute: function ( name, value ) {
            if ( typeof value === "undefined" ) {
                var $el = this.element( 0 );
                if ( !$el ) {
                    return null;
                }
                else {
                    var item = $el.attributes.getNamedItem( name );
                    return item ? item.value : undefined;
                }
            }
            else {
                this.each( function () {
                    this.setAttribute( name, value );
                } );
                return this;
            }
        },

        /**
         * Returns the HTML markup of the first element in set.
         * @memberOf lib.DomHelper
         * @returns {string|null} The HTML markup or null if set is empty.
         */
        html: function () {
            var $el = this.element( 0 );

            if ( $el ) {
                var div = document.createElement( 'div' );
                div.appendChild( $el.cloneNode( true ) );
                return div.innerHTML;
            }

            return null;
        },

        /**
         * @memberOf lib.DomHelper
         * @param content
         * @returns {*}
         * @memberOf lib.DomHelper
         */
        prepend: function ( content ) {
            var elements = [], i = 0;

            if ( typeof content === "string" ) {

                // convert html to document.element
                var doc = document.createElement( "div" );

                doc.innerHTML = content;

                for ( i = 0; i < doc.children.length; i++ ) {
                    elements.push( doc.children[i] );
                }

            }
            else if ( content instanceof Array || content instanceof NodeList ) {

                for ( i = 0; i < content.length; i++ ) {
                    elements.push( content[i] );
                }

            }
            else if ( content instanceof Element ) {

                // DOMElement
                elements.push( content );

            }

            if ( elements.length > 0 ) {
                var $el = this.element( 0 ),
                    elLen = elements.length;
                for ( var i = 0; i < elLen; i++ ) {
                    $el.insertBefore( elements[i], $el.firstChild );
                }
            }
            return this;
        },

        /**
         *
         * @param parent
         * @returns {boolean}
         * @memberOf lib.DomHelper
         */
        hasParent: function ( parent ) {
            var element = this.element();

            do {
                if ( element === parent ) {
                    return true;
                }
                element = element.parentNode;
            } while ( element && element.parentNode );

            return false;
        },

        /**
         *
         * @param parentSelector
         * @returns {*}
         * @memberOf lib.DomHelper
         */
        parentUntil: function ( parentSelector ) {
            var element = this.element();

            while ( element && element.parentNode ) {
                if ( element === element.parentNode.querySelector( parentSelector ) ) {
                    return element;
                }
                element = element.parentNode;
            }

            return null;
        },

        /**
         * Insert content after current element
         * @param content
         * @returns {*}
         * @memberOf lib.DomHelper
         */
        after: function ( content ) {
            var element = this.element();
            if ( content instanceof Array || content instanceof NodeList ) {
                var nextSibling = element.nextSibling;
                for ( var i = 0; i < content.length; i++ ) {
                    element.parentNode.insertBefore( content[i], nextSibling );
                }
            } else if ( content instanceof Element ) {
                element.parentNode.insertBefore( content, element.nextSibling );
            }

            return this;
        },
        scrollTo: function ( to, duration ) {

            var el = this.element();
            if ( !el ) {
                return;
            }
            var start = el.scrollTop;
            var change = Math.min( to, el.scrollHeight - el.offsetHeight ) - start;
            var currentTime = 0;
            var increment = 30;

            if ( change === 0 ) {
                return;
            }

            var animateScroll = function () {
                currentTime += increment;
                el.scrollTop = easeInOutQuad( currentTime, start, change, duration );

                if ( currentTime < duration ) {
                    setTimeout( animateScroll, increment );
                }
            };
            animateScroll();
        },
        getScrollableParent: function () {

            var parent = this.element().parentNode;

            while ( parent ) {

                var currentStyle = (window.getComputedStyle( parent ) || {});
                var re = /auto|scroll/i;

                if ( re.test( currentStyle.overflow ) || re.test( currentStyle.overflowY )   ) {
                    return this.__$( parent ).element();
                } else {
                    parent = parent.parentNode;
                }
            }
            return this.__$( null );
        },
        /**
         *
         * @param [options] {Object}
         * @param [options.duration] {Number} Duration in millisecunds. Defaults to 300.
         * @param [options.native] {Boolean} Use netive behavior (no animation). Defaults to false.
         * @param [options.alignToTop] {Boolean}
         *      If true, the top of the element will be aligned to the top of the visible area of the scrollable ancestor.
         *      If false, the bottom of the element will be aligned to the bottom of the visible area of the scrollable ancestor.
         */
        scrollIntoView: function ( options ) {

            options = options || {};

            if ( options.native ) {
                return HTMLElement.prototype.scrollIntoView.call( this.element(), options.alignToTop, options );
            }

            var el = this.element();
            var parent = this.getScrollableParent();
            var offsetEl = el;
            var top = 0;

            while ( offsetEl && offsetEl !== parent ) {
                top += offsetEl.offsetTop;
                offsetEl = offsetEl.offsetParent;
            }

            if(!options.alignToTop){
                top = top - parent.offsetHeight + el.offsetHeight;
            }

            parent.scrollTo( top, options.duration || 300 );
        }
    };

} );
