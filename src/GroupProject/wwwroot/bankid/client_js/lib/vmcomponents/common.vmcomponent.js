"use strict";

define( [
    "utils",
    "event_handler"
], function ( utils, eventHandler ) {

    var removeAnimationClass = "remove_anim";

    var vmComponentsCommon = {
        // whether or not to use exit animations (for dialogs, popovers, pages, and error messages).
        // this is a debug variable for e2e-tests (where it is false) and should for all other purposes be set to true.
        useExitAnimation: window.dontUseExitAnimation ? false : true,

        // the duration for components' animation
        animationDuration: {
            popoverOpen: 50, // _popover.scss
            popoverRemove: 50, // _popover.scss
            dialogOpen: 150, // _dialog.scss
            dialogRemove: 150, // _dialog.scss
            infoBubbleOpen: 50, // _popover.scss
            infoBubbleRemove: 50, // _popover.scss
            pageOpen: 150, // _page.scss
            pageRemove: 100 // _page.scss
        }
    };

    /**
     * Call callback after animation duration if animation is supported, else call callback directly
     * @param {Function} callback Callback to be called
     * @param {number} animationDuration Call callback after animation duration
     */
    vmComponentsCommon.callAfterAnimation = function callAfterAnimation( callback, animationDuration ) {
        if ( utils.features.cssAnimation ) {
            setTimeout( function () {
                callback();
            }, animationDuration );
        }
        else {
            callback();
        }
    };

    /**
     * Remove element after animation
     * - Adds "remove_anim" css class to the element
     * - Waiting a given duration before removing the element from the DOM tree
     * - Calls callback when element is removed
     * - If called on element which is already removing, remove immediately
     * - Remove immediately if no support for exit animation
     * @param {DomHelper} $element Dom helper element to be removed
     * @param {number} duration Duration before removing element
     * @param {Function} [callback] Callback to be called after element is removed
     * @param {number} [timer] Timeout reference
     * @returns {*}
     */
    vmComponentsCommon.removeElementAfterAnimation = function removeElementAfterAnimation( $element, duration, callback, timer ) {
        function doRemove() {
            timer = null;
            if ( $element ) {
                $element.removeClass( "remove_anim" );
                $element.remove();
            }
            if ( callback ) {
                callback();
            }
        }

        if ( utils.features.cssAnimation && vmComponentsCommon.useExitAnimation && $element ) {
            if ( !$element.hasClass( removeAnimationClass ) && !timer ) {
                timer = setTimeout( doRemove, duration );
                $element.addClass( removeAnimationClass );
            } else {
                doRemove();
            }
        } else {
            doRemove();
        }

        return timer;
    };

    /**
     * Update DOM tree, this will make sure all browsers detect a DOM change
     * - Append empty div to body after a delay
     * - Remove empty div from body after a delay
     */
    vmComponentsCommon.updateDomTree = function updateDomTree() {
        var emptyDivElement = document.createElement( "div" );
        setTimeout( function () {
            document.body.appendChild( emptyDivElement );
        }, 10 );
        setTimeout( function () {
            if ( emptyDivElement.parentNode ) {
                emptyDivElement.parentNode.removeChild( emptyDivElement );
            }
        }, 20 );
    };

    /**
     * @param {String} [$message] Assistive message, empty removes the message
     */
    vmComponentsCommon.doAssistiveMessage = function doAssistiveMessage( $message ) {
        eventHandler.fire( "assistive_message", $message );
    };

    /**
     * @param {TouchEvent} event
     * @returns {*}
     */
    function getPointerEvent( event ) {
        return event.targetTouches ? event.targetTouches[0] : event;
    }

    var tapTouchStarted = false,
        tapCurrX = 0,
        tapCurrY = 0,
        tapCachedX = 0,
        tapCachedY = 0,
        tapTimeout;

    /**
     * @param $element
     * @param callback
     * @returns {{unbind: doUnbindTap}}
     */
    vmComponentsCommon.doBindTap = function ( $element, callback ) {
        var tapTouchstartCallback = function ( e ) {
                e.preventDefault();
                var pointer = getPointerEvent( e );
                tapCachedX = tapCurrX = pointer.pageX;
                tapCachedY = tapCurrY = pointer.pageY;
                tapTouchStarted = true;

                clearTimeout( tapTimeout );
                tapTimeout = setTimeout( function () {
                    if ( (tapCachedX === tapCurrX) && !tapTouchStarted && (tapCachedY === tapCurrY) ) {
                        callback( e );
                    }
                }, 200 );
            },
            tabTouchendCallback = function ( e ) {
                e.preventDefault();
                tapTouchStarted = false;
            },
            tabTouchmoveCallback = function ( e ) {
                e.preventDefault();
                var pointer = getPointerEvent( e );
                tapCurrX = pointer.pageX;
                tapCurrY = pointer.pageY;
            },
            doUnbindTap = function () {
                $element.unbind( "touchstart", tapTouchstartCallback );
                $element.unbind( "touchend touchcancel", tabTouchendCallback );
                $element.unbind( "touchmove", tabTouchmoveCallback );
            };

        $element.bind( "touchstart", tapTouchstartCallback );
        $element.bind( "touchend touchcancel", tabTouchendCallback );
        $element.bind( "touchmove", tabTouchmoveCallback );

        return {
            unbind: doUnbindTap
        };
    };

    return vmComponentsCommon;

} );