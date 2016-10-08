"use strict";

define( [
    "dom",
    "ko",
    "utils",
    "lib/knockout_utils",
    "lib/constants"
], function ( $, ko, utils, koUtils, constants ) {

    /**
     * @typedef {Object} ListVmComponent.Item
     * @property {String} name
     * @property {Object} item
     * @memberOf {ListVmComponent}
     */

    /**
     * @param {Object} options
     * @param {Function} options.onItemSelect
     * @param {Boolean|observable} [options.isDisabled]
     * @param {Array<Object>} [options.items]
     * @constructor
     */
    function ListVmComponent( options ) {

        // CONSTRUCTOR

        var self = this;
        utils.merge( self, {}, options );

        // /CONSTRUCTOR

        // VARIABLES

        this.itemTabIndex = constants.CONTENT_BODY_TABINDEX;

        this.items = koUtils.observableArray( options.items, [] );

        this.isDisabled = koUtils.observable( options.isDisabled, false );

        // /VARIABLES

        // FUNCTIONS

        /**
         * @param {ListVmComponent.Item} itemVm
         */
        this.onItemClick = function ( itemVm ) {
            if ( options.onItemSelect ) {
                options.onItemSelect( itemVm );
            }
        };

        self.doSelectNextOrPreviousItem = function ( isNext ) {
            var $activeList = $( ".list.active", self.fragment ),
                $listButtons = $activeList.find( ".item button" ),
                $nextOrPreviousItem = null;

            if ( $activeList.length === 0 ) {
                return;
            }

            if ( isNext ) {
                $nextOrPreviousItem = $listButtons.first();
            }
            else if ( !isNext ) {
                $nextOrPreviousItem = $listButtons.last();
            }

            if ( $nextOrPreviousItem ) {
                $nextOrPreviousItem.element().focus();
            }
        };

        // /FUNCTIONS

    }

    return ListVmComponent;

} );