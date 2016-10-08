"use strict";

define( [
    "ko",
    "dom",
    "utils",
    "lib/constants",
    "lib/knockout_utils"
], function ( knockout, $, utils, constants, knockoutUtils ) {

    /**
     * List content
     * @memberof vmcomponents
     * @constructor
     * @param {Object} [options] List content options
     * @param {String} [options.title] List title
     * @param {number} [options.selectedHeader] Selected header index
     * @param {Object} [options.selectedListItem] Selected list item object
     * @param {Function} [options.onSelectItem] On selected list item callback handler Function(item)
     * @param {String} [options.itemTitle] List items title
     * @param {number} [options.tabIndexItem] List items tab index
     * @param {number} [options.tabIndexHead] List headers tab index
     * @param {boolean} [options.noFocus=false] Do not set auto-focus on list item
     * @param {number} [options.closeDialogTimeout=0] Close dialog after timeout (null does not close dialog)
     * @param {observable} [options.isViewDisabled=null] Is view disabled observable (if given sets view to enabled on onSelectingItem)
     */
    function ListContent( options ) {

        // CONSTRUCTOR

        var self = this;
        utils.merge( self, {
            title: null,
            selectedHeader: 0,
            selectedListItem: null,
            onSelectItem: null,
            itemTitle: null,
            headerTabIndex: constants.HEADER_DIALOG_TABINDEX,
            tabIndexItem: constants.LIST_ITEM_TABINDEX,
            tabIndexHead: constants.LIST_HEAD_TABINDEX,
            noFocus: false,
            closeDialogTimeout: 0,
            isViewDisabled: null
        }, options );

        var isItemSelected = false;

        // /CONSTRUCTOR

        // BIND

        self.header = knockout.observableArray( [] );
        self.list = knockout.observableArray( [] );
        self.selectedHeader = knockout.observable( self.selectedHeader );
        self.selectedListItem = knockout.observable( self.selectedListItem );
        self.selectedListItemOriginal = null;

        self.selectedListItem.subscribe( function () {
            // scroll to item on next process to make sure dom is updated
            setTimeout( doScrollToItem.bind( self ), 0 );
        } );

        self.hasTabs = knockout.computed( function () {
            return self.header().length > 1;
        } );

        self.id = knockout.observable( null );

        // /BIND

        // FUNCTIONS

        function getSelectedItemHeaderIndex() {
            var selectedItemHeaderIndex = 0;

            self.list().forEach( function ( list, i ) {
                list.forEach( function ( item ) {
                    if ( self.selectedListItem() === item.value ) {
                        selectedItemHeaderIndex = i;
                    }
                } );
            } );

            return selectedItemHeaderIndex;
        }

        function getSelectedItem() {
            var selectedItem = null;

            self.list().forEach( function ( list ) {
                list.forEach( function ( item ) {
                    if ( self.selectedListItem() === item.value ) {
                        selectedItem = item;
                    }
                } );
            } );

            return selectedItem;
        }

        function getItemFromId( id ) {
            var item = null;

            self.list().forEach( function ( list ) {
                list.forEach( function ( item_ ) {
                    if ( id === item_.id ) {
                        item = item_;
                    }
                } );
            } );

            return item;
        }

        /**
         * Add list, and header if needed.
         * @param {Array<Object>} list List items for given header. Array[ { value, title }, ... ]
         * @param {Object} [header] Header for list, only needed when use of tabs. Object{ title }
         */
        this.addContent = function ( list, header ) {
            var listId = utils.getRandomKey(),
                tabId = utils.getRandomKey();

            var list_ = list.map( function ( item ) {
                return {
                    value: item.value,
                    title: item.title,
                    id: utils.getRandomKey(),
                    hasFocus: knockout.observable( false ),
                    item: item,
                    isSelected: knockout.computed( function () {
                        return self.selectedListItem() === item.value;
                    } )
                };
            } );

            list_.listId = listId;
            list_.tabId = tabId;
            list_.index = self.list().length;
            list_.isSelected = knockout.computed( function () {
                return self.selectedHeader() === list_.index;
            } );
            list_.isNotSelected = knockoutUtils.not( list_.isSelected );

            self.list.push( list_ );

            if ( header ) {
                var isSelected = knockout.computed( function () {
                    return self.selectedHeader() === list_.index;
                } );

                self.header.push( {
                    tabId: tabId,
                    listId: listId,
                    title: header.title,
                    header: header,
                    isSelected: isSelected
                } );

            }
        };

        /**
         * @param {Object} header Given header
         * @returns {boolean} True if given header is selected
         */
        this.isSelectedHeader = function ( index ) {
            return index === self.selectedHeader();
        };

        /**
         * @param {Object} list Given list
         * @returns {boolean} True if given list is selected
         */
        this.isSelectedList = function ( list ) {
            var indexOf = self.list.indexOf( list );
            return indexOf === self.selectedHeader();
        };

        /**
         * @param {Object} listItem Given list item
         * @returns {boolean} True if given list item is selected
         */
        this.isSelectedListItem = function ( listItem ) {
            return this.selectedListItem() === listItem.value;
        };

        /**
         * @param {Event} event Key event
         * @returns {boolean} True if should select item from keyboard event
         * @private
         */
        function shouldSelectItemFromKeyboard( event ) {
            return event.which === constants.ENTER_KEY || event.which === constants.SPACE_KEY;
        }

        /**
         * Key event for header tabs
         *
         * @param {Object} event
         */
        this.onKeyTab = function ( data, event ) {
            var isKeyLeftOrRightKey = event.which === constants.RIGHT_KEY || event.which === constants.LEFT_KEY,
                isKeyUpOrDownKey = event.which === constants.UP_KEY || event.which === constants.DOWN_KEY;

            // focus on next/previous tab
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
            // focus on first/last item in list
            else if ( isKeyUpOrDownKey ) {
                event.preventDefault();
                doSelectNextOrPreviousItem( event.which === constants.UP_KEY, null, $( ".body ul.active li", self.fragment ).element().parentNode );
            }

            return true;
        };

        /**
         * Key event for headline
         *
         * @param {Object} data
         * @param {Object} event
         */
        this.onKeyHeadline = function ( data, event ) {
            var isKeyLeftOrRightKey = event.which === constants.RIGHT_KEY || event.which === constants.LEFT_KEY,
                isKeyUpOrDownKey = event.which === constants.UP_KEY || event.which === constants.DOWN_KEY,
                isKeyEnterOrSpace = event.which === constants.ENTER_KEY;

            // focus on first/last header
            if ( self.hasTabs && isKeyLeftOrRightKey ) {
                var $header = $( ".header", self.fragment ).element();

                if ( $header ) {
                    var $headerTabs = $header.children,
                        focusElement = event.which === constants.LEFT_KEY ? $headerTabs[0] : $headerTabs[$headerTabs.length - 1];

                    if ( focusElement ) {
                        focusElement.focus();
                    }
                }
            }
            // focus on first/last item
            else if ( isKeyUpOrDownKey ) {
                event.preventDefault();
                doSelectNextOrPreviousItem( event.which === constants.UP_KEY, null, $( ".body ul.active li", self.fragment ).element().parentNode );
            }
            // close dialog with selected item
            else if ( isKeyEnterOrSpace && self.selectedListItem() ) {
                doCloseDialog();
            }

            return true;
        };

        /**
         * Click header, set selected header, focus on active or first item
         * @param {object} header Header item
         */
        this.onClickHeader = function ( header ) {
            var indexOf = self.header.indexOf( header );
            if ( indexOf > -1 ) {
                self.selectedHeader( indexOf );

                // focus selected
                var headerButtonElement = $( ".header button", self.fragment )[indexOf];
                if ( headerButtonElement ) {
                    headerButtonElement.focus();
                }
            }

            doScrollToItem();
        };

        /**
         * Click list item handler
         * @param {Object} listItem List item
         */
        this.onClickListItem = function ( listItem ) {
            doSelectItem( listItem );
            doCloseDialog();
        };

        /**
         * On dialog open
         */
        self.onOpenDialog = function () {
            isItemSelected = false;

            // set max height for dialog content according to body height
            var maxHeight = self.hasTabs() ? 110 : 70;
            $( ".body", self.fragment ).css( "max-height", (document.body.offsetHeight - maxHeight) + "px" );

            doSelectHeader();
            doScrollToItem();

            self.selectedListItemOriginal = self.selectedListItem();
        };

        /**
         * On dialog close
         * @param {boolean} isCancel Dialog is canceled
         */
        self.onCloseDialog = function ( isCancel ) {
            // set selected item to original item if dialog is canceled
            if ( isCancel ) {
                self.selectedListItem( self.selectedListItemOriginal );
            }
            // select current selected item if dialog is closed and item is not already selected (close button is probably pressed)
            else if ( !isCancel && !isItemSelected ) {
                doSelectItem( getSelectedItem() );
            }
        };

        self.onBuildingDialog = function ( dialog ) {
            if ( dialog.id ) {
                self.id( dialog.id );
            }
        };

        /**
         * Enable view, if given
         */
        function doEnableView() {
            if ( self.isViewDisabled ) {
                self.isViewDisabled( false );
            }
        }

        /**
         * Select item.
         *
         * - Enables view
         * - Calls onSelectItem callback
         * @param {Object} selectedItem Selected item
         */
        function doSelectItem( selectedItem ) {
            if ( !selectedItem ) {
                return;
            }

            if ( !isItemSelected ) {
                self.selectedListItem( selectedItem.value );

                doEnableView();
                doCallSelectItem( selectedItem );
            }

            isItemSelected = true;
        }

        /**
         * Call selected item
         * @param {Object} selectedItem Selected item
         * @private
         */
        function doCallSelectItem( selectedItem ) {
            if ( self.onSelectItem ) {
                self.onSelectItem( selectedItem.item );
            }
        }

        /**
         * Closes dialog after timeout (closeDialogTimeout > 0), closes dialog immediatly (closeDialogTimeout = 0), or does not close dialog (closeDialogTimeout = null)
         * @private
         */
        function doCloseDialog() {
            var closeDialog = function () {
                if ( self.dialog ) {
                    self.dialog.doClose();
                }
            };

            if ( self.closeDialogTimeout > 0 ) {
                setTimeout( closeDialog, self.closeDialogTimeout );
            }
            else if ( self.closeDialogTimeout === 0 ) {
                closeDialog();
            }
        }

        /**
         * Set selected header according to selected item
         * @private
         */
        function doSelectHeader() {
            self.selectedHeader( getSelectedItemHeaderIndex() );
        }

        /**
         * Scroll list to active item if item is hidden above or bellow scroll field
         */
        function doScrollToItem() {
            var $activeItem = $( ".item.active", self.fragment ),
                $scroller = $( ".body", self.fragment );

            if ( $activeItem.length === 0 ) {
                return;
            }

            var activeItemPosition = $activeItem.position(),
                scrollerPosition = $scroller.position(),
                bottomScrollDiff = activeItemPosition.bottom - scrollerPosition.bottom,
                topScrollDiff = Math.abs( scrollerPosition.top - activeItemPosition.top );

            if ( bottomScrollDiff > 0 ) {
                $scroller.element().scrollTop = $scroller.element().scrollTop + bottomScrollDiff;
            }
            else if ( activeItemPosition.top <= scrollerPosition.top ) {
                $scroller.element().scrollTop = $scroller.element().scrollTop - topScrollDiff;
            }
        }

        function shouldSelectNextOrPreviousItem( event ) {
            var isUpKey = constants.UP_KEY === event.which,
                isDownKey = constants.DOWN_KEY === event.which;

            return isUpKey || isDownKey;
        }

        function doSelectNextOrPreviousItem( isUp, itemElement, listElement ) {
            listElement = listElement || (itemElement && itemElement.parentElement);

            if ( !listElement ) {
                return;
            }

            var nextOrPreviousItem = null;

            if ( isUp ) {
                nextOrPreviousItem = (itemElement && itemElement.previousElementSibling) || listElement.lastChild;
            }
            else if ( !isUp ) {
                nextOrPreviousItem = (itemElement && itemElement.nextElementSibling) || listElement.firstChild;
            }

            if ( nextOrPreviousItem ) {
                var item = getItemFromId( nextOrPreviousItem.getAttribute( "id" ) );

                if ( item ) {
                    self.selectedListItem( item.value );
                    nextOrPreviousItem.focus();
                }
            }
        }

        /**
         * Handle content keyboard event
         * @param {Event} event Keyboard event
         * @private
         */
        this.onKeyItem = function ( item, event ) {
            if ( shouldSelectItemFromKeyboard( event ) ) {
                event.preventDefault();
                doSelectItem( item );
                doCloseDialog();
            }
            else if ( shouldSelectNextOrPreviousItem( event ) ) {
                event.preventDefault();
                doSelectNextOrPreviousItem( event.which === constants.UP_KEY, event.target );
            }
            return true;
        };

        this.onFormSubmit = function ( element, event ) {
            event.preventDefault();
        };

        // /FUNCTIONS

    }

    return ListContent;

} );
