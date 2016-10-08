"use strict";

define( [
    "dom",
    "ko",
    "utils",
    "gfx",
    "lib/constants",
    "lib/knockout_utils",
    "lib/vmcomponents/list.vmcomponent",
], function ( $, ko, utils, gfx, constants, koUtils, ListVmComponent ) {

    /**
     * @typedef {Object} HaListVmComponent.Tab
     * @property {String} tabId
     * @property {String} listId
     * @property {computed} isSelected
     * @memberOf HaListVmComponent
     */

    /**
     * @typedef {Object} HaListVmComponent.HaItem
     * @property {Boolean} isUnused
     * @memberOf HaListVmComponent
     * @extends ListVmComponent.Item
     */

    /**
     * @typedef {Object} HaListVmComponent.HaItems
     * @property {Array<HaListVmComponent.HaItem>} items
     * @property {String} listId
     * @property {computed} isSelected
     * @property {computed} isNotSelected
     * @memberOf HaListVmComponent
     */

    /**
     * @param {Object} options
     * @param {String} options.tabTitle
     * @param {String} options.unusedText
     * @param {String} options.switchMethodText
     * @constructor
     * @extends {ListVmComponent}
     */
    function HaListVmComponent( options ) {

        // CONSTRUCTOR

        var self = this;
        utils.merge( self, new ListVmComponent( options ) );

        // /CONSTRUCTOR

        // VARIABLES

        this.tabTabIndex = constants.CONTENT_BODY_TABINDEX;

        this.lists = ko.observableArray( [] );
        this.tabs = ko.observableArray( [] );
        this.hasTabs = ko.computed( function () {
            return self.tabs().length > 1;
        } );

        var selectedTab = ko.observable( null );

        this.itemSupportText = options.switchMethodText;
        this.itemSupportIcon = {
            src: gfx.getB64( "ico_arrow_right_blue" ),
            title: null,
            type: "arrow"
        };
        this.tabTitle = options.tabTitle;
        this.unusedText = options.unusedText;

        // /VARIABLES

        // FUNCTIONS

        /**
         * @param {Array<HaListVmComponent.HaItem>} items
         * @param {String} tabTitle
         */
        this.addItems = function ( items, tabTitle ) {
            var listId = utils.getRandomKey(),
                tabId = utils.getRandomKey();

            items = items.map( function ( haItem ) {
                haItem.isNotUnused = !haItem.isUnused;
                return haItem;
            } );

            /**
             * @type {HaListVmComponent.HaItems}
             */
            var haItems = {
                items: items,
                listId: listId,
                isSelected: null,
                isNotSelected: null
            };

            /**
             * @type {HaListVmComponent.Tab}
             */
            var tab = {
                tabId: tabId,
                listId: listId,
                title: tabTitle,
                isSelected: null,
                listIndex: self.tabs().length
            };

            tab.isSelected = ko.computed( function () {
                return selectedTab() ? selectedTab().listId === listId : false;
            } );
            haItems.isSelected = ko.computed( function () {
                return selectedTab() ? selectedTab().listId === listId : false;
            } );
            haItems.isNotSelected = koUtils.not( haItems.isSelected );

            self.lists.push( haItems );
            self.tabs.push( tab );

            if ( !selectedTab() ) {
                selectedTab( tab );
            }
        };

        this.onTabKeyDown = function ( tabVm, event ) {
            var isKeyLeftOrRightKey = event.which === constants.RIGHT_KEY || event.which === constants.LEFT_KEY,
                isKeyUpOrDownKey = event.which === constants.UP_KEY || event.which === constants.DOWN_KEY;

            // focus on next/previous tab
            if ( isKeyLeftOrRightKey ) {
                event.preventDefault();
                doSelectNextOrPreviousTab( event.which === constants.RIGHT_KEY, event.target );
            }
            // focus on first/last item in list
            else if ( isKeyUpOrDownKey ) {
                event.preventDefault();
                self.doSelectNextOrPreviousItem( event.which === constants.DOWN_KEY );
            }

            return true;
        };

        /**
         * @param {HaListVmComponent.Tab} tabVm
         */
        this.onTabClick = function ( tabVm ) {
            selectedTab( tabVm );
        };

        /**
         * @param {Event} event
         */
        function doSelectNextOrPreviousTab( isRight, element ) {
            var siblings = element.parentNode.children,
                focusElement = null;

            if ( isRight ) {
                focusElement = element.nextSibling || siblings[0];
            }
            else {
                focusElement = element.previousSibling || siblings[siblings.length - 1];
            }

            if ( focusElement ) {
                focusElement.focus();
            }
        }

        // /FUNCTIONS

        // BIND

        // /BIND

    }

    return HaListVmComponent;

} );