"use strict";

define( [
    "dom",
    "utils",
    "ko",
    "lib/knockout_utils",
    "lib/constants"
], function ( $, utils, knockout, knockoutUtils, constants ) {

    /**
     * @constructor
     * @memberof vmcomponents
     * @param {Object} options
     * @param {Array} options.contents
     * @param {number|observable} [options.selected=0]
     */
    function TabContent( options ) {

        options = options || {};

        var self = this;

        self.selected = knockoutUtils.observable( options.selected, 0 );
        self.tabIndexHead = constants.CERTIFICATE_DETAILS_HEAD_TABINDEX;
        self.tabIndex = constants.CERTIFICATE_DETAILS_BODY_TABINDEX;
        self.contents = options.contents;

        options.contents.forEach( function ( content, i ) {
            content.idTab = utils.getRandomKey();
            content.idContent = utils.getRandomKey();

            content.isSelected = knockout.computed( function () {
                return self.selected() === i;
            } );

            content.isNotSelected = knockout.computed( function () {
                return !content.isSelected();
            } );
        } );

        self.onClickTab = function ( data ) {
            self.selected( self.contents.indexOf( data ) );
        };

        self.onKeyTab = function ( data, event ) {
            var isKeyLeftOrRightKey = event.which === constants.RIGHT_KEY || event.which === constants.LEFT_KEY;

            if ( isKeyLeftOrRightKey ) {

                var element = event.target,
                    siblings = element.parentNode.children,
                    focusElement = null;

                if ( event.which === constants.RIGHT_KEY ) {
                    focusElement = element.nextSibling || siblings[0];
                }
                else if ( event.which === constants.LEFT_KEY ) {
                    focusElement = element.previousSibling || siblings[siblings.length - 1];
                }

                if ( focusElement ) {
                    focusElement.focus();
                }

            }

            return true;
        };

        self.focus = function () {
            var $contentsWrapper = $( ".contents_wrapper", this.fragment ).element();
            if ( $contentsWrapper ) {
                $contentsWrapper.focus();
            }
        };

    }

    return TabContent;

} );