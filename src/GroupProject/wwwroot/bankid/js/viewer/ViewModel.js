/**
 * @description The global view model for the UDD Viewer.
 * @author Flemming Lauritzen (flemming.lauritzen@knowit.no)
 */

"use strict";

define( ['dom', 'ko', 'viewerConfig', 'uc', 'dimension', 'gfx', 'templateGenerator', 'tmpl!../templates/popover.html!viewerPopover', 'utils', 'mousetrap'], function ( $, ko, viewerConfig, uc, dimension, gfx, tg, popoverTemplate, utils, Mousetrap ) {

        function setCookie( c_name, value, exdays ) {

            var exdate = new Date();

            // unless defined exdays = one day
            exdays = isNaN( exdays ) ? 1 : exdays;

            exdate.setDate( exdate.getDate() + exdays );
            var c_value = window.escape( value ) + ((exdays === null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;

        }

        function getCookie( c_name, def ) {
            def = def || null;
            var c_value = window.document.cookie;
            var c_start = c_value.indexOf( " " + c_name + "=" );
            if ( c_start === -1 ) {
                c_start = c_value.indexOf( c_name + "=" );
            }
            if ( c_start === -1 ) {
                c_value = def;
            }
            else {
                c_start = c_value.indexOf( "=", c_start ) + 1;
                var c_end = c_value.indexOf( ";", c_start );
                if ( c_end === -1 ) {
                    c_end = c_value.length;
                }
                c_value = window.unescape( c_value.substring( c_start, c_end ) );
            }
            return c_value;
        }

        function Popover( vm, $btn, type ) {

            var self = this;

            type = type || 'popover';

            var _popoverTemplate = popoverTemplate[type].cloneNode( true );

            ko.applyBindings( vm, _popoverTemplate );

            $( 'body' ).append( _popoverTemplate );

            var posTmpl = $( _popoverTemplate ).position();
            //var posBtn = $btn.position();
            //var posHeader = $('header').position();

            var elBtn = $btn[0];
            var elHeader = $( 'header' )[0];

            var boundsBtn = elBtn.getBoundingClientRect();
            var boundsHeader = elHeader.getBoundingClientRect();

            self.open = ko.observable( true );

            /**
             * Place popover
             */
            function placePopover() {
                var css = {
                    left: ( (boundsBtn.left + boundsBtn.width / 2) - (posTmpl.width / 2 ) ) + 'px',
                    top: (boundsHeader.top + boundsHeader.height - 4) + 'px'
                };

                $( _popoverTemplate ).css( css );
            }

            /**
             * Remove popover
             */
            function remove() {
                $( _popoverTemplate ).remove();
                $( window ).unbind( 'click', remove );
                $( window ).unbind( 'resize', placePopover );
                $( "body" ).element().onkeydown = null;
                self.open( false );
            }

            /**
             * Filter items in list
             * @param filter
             */
            function filterList( filter ) {
                var items = $( ".list .item", _popoverTemplate ),
                    filterReg = new RegExp( ".*" + filter + ".*", "i" ),
                    item = null,
                    itemId = null
                    ;

                $( ".list .item.hide" ).removeClass( "hide" );

                if ( filter === "" ) {
                    return;
                }

                var ids = [];
                if ( vm.filterFunc ) {
                    ids = vm.filterFunc( filter );
                }

                for ( var i = 0; i < items.length; i++ ) {
                    item = items[i];
                    var text = item.innerText || item.textContent;
                    if ( text ) {
                        text = text.replace( /[^\w]/g, " " ).replace( /\s{2,}/g, " " );
                        itemId = item.getAttribute( "data-id" );
                        if ( !filterReg.test( text ) && ids.indexOf( itemId ) === -1 ) {
                            $( item ).addClass( "hide" );
                        }
                    }
                }
            }

            /**
             * Move active item in list
             * @param directionUp
             */
            function moveInList( directionUp ) {
                var items = $( ".list .item:NOT(.hide)", _popoverTemplate ),
                    activeIndex = -1,
                    nextIndex = -1,
                    currentIndex = -1;

                if ( items.length === 0 ) {
                    return;
                }

                utils.each( items, function ( item, i ) {
                    var _item = $( item );
                    if ( _item.hasClass( "active" ) ) {
                        activeIndex = parseInt( i, 10 );
                    }
                    if ( _item.hasClass( "current" ) ) {
                        currentIndex = parseInt( i, 10 );
                    }
                } );

                if ( activeIndex === -1 && currentIndex === -1 ) {
                    nextIndex = directionUp ? items.length - 1 : 0;
                }
                else {
                    if ( activeIndex === -1 && currentIndex !== -1 ) {
                        activeIndex = currentIndex;
                    }
                    nextIndex = directionUp ? (activeIndex === 0 ? items.length - 1 : activeIndex - 1) : (activeIndex + 1) % items.length;
                }

                $( ".list .item.active", _popoverTemplate ).removeClass( "active" );
                $( items[nextIndex] ).addClass( "active" );
                $( items[nextIndex] ).element().focus();
            }

            /**
             * On key
             * @param event
             */
            function onKey( event ) {
                // key up/down
                if ( event.which === 38 || event.which === 40 ) {
                    event.preventDefault();
                    moveInList( event.which === 38 );
                }
                // key enter/space
                else if ( event.which === 13 || event.which === 32 ) {
                    var activeItem = $( ".list .item.active:NOT(.hide)", _popoverTemplate )[0];
                    if ( !activeItem ) {
                        activeItem = $( ".list .item:NOT(.hide)", _popoverTemplate )[0];
                    }
                    if ( activeItem ) {
                        event.preventDefault();
                        vm.onSelect( activeItem.attribute( "data-id" ) );
                        if ( event.which === 13 ) {
                            remove();
                        }
                    }
                }
                // key backspace a-Z 0-9
                else if ( vm.filterEnabled && (event.which === 8 || event.which === 27 || (event.which >= 48 && event.which <= 122)) ) {
                    var filterInput = $( "input.filter", _popoverTemplate ).element(),
                        value = filterInput.value;
                    if ( filterInput !== document.activeElement ) {
                        // backspace
                        if ( event.which === 8 ) {
                            event.preventDefault();
                            value = value.substr( 0, value.length - 1 );
                        }
                        else {
                            value = value + String.fromCharCode( event.which ).toLowerCase();
                        }
                    }
                    // esc
                    if ( event.which === 27 ) {
                        value = "";
                        if ( vm.filter() === "" ) {
                            remove();
                        }
                    }
                    vm.filter( value );
                }
                // key esc
                else if ( event.which === 27 ) {
                    remove();
                }
            }

            setTimeout( function () {
                $( window ).bind( 'click', remove );
                $( "body" ).element().onkeydown = onKey;
            }, 50 );

            $( window ).bind( 'resize', placePopover );

            placePopover();

            if ( vm.filterEnabled ) {
                $( "input.filter", _popoverTemplate ).element().focus();
                vm.filter.subscribe( function ( val ) {
                    filterList( val );
                } );
                filterList( vm.filter() );
            }

        }

        return function () {

            var self = this;

            /**
             * @param {boolean} init True if first call
             */
            function onHashChange( init ) {

                var hash = location.hash.substring( 1 );

                // retrieve udd from hash
                utils.each( _udd.uddsAll(), function ( udd ) {
                    if ( udd.id === hash ) {
                        _udd.current( udd );
                    }
                } );

                // if not found we'll use the first in list
                if ( !_udd.current() ) {
                    _udd.current( _udd.udds()[0] );
                }

                if ( hash === '' ) {
                    // replace url to prevent current page to be added to history
                    // (instead of simply setting the src-attribute)
                    if ( init ) {
                        location.replace( "#" + _udd.current().id );
                    }
                    // set location hash
                    else {
                        location.hash = _udd.current().id;
                    }
                }

                //                // open in new window
                //                if ( _udd.current().tags && _udd.current().tags.indexOf( "window" ) > -1 ) {
                //                    var height = window.screen.height,
                //                        width = window.screen.width,
                //                        heightDef = 600,
                //                        widthDef = 470,
                //                        deltaHeight = height < heightDef ? height : heightDef,
                //                        deltaWidth = width < widthDef ? width : widthDef,
                //                        top = Math.round( (height - deltaHeight) / 2 ),
                //                        left = Math.round( (width - heightDef) / 2 ),
                //                        url
                //                        ;
                //                    if ( _udd.current().bidm ) {
                //                        url = '/bidm/' + _udd.current().bidm + (_language.current().id === "en" ? "_en" : "") + ".html";
                //                    }
                //                    else if ( _udd.current().errorpage ) {
                //                        url = '/errorpages/' + _udd.current().errorpage + ".html";
                //                    }
                //                    else if ( _udd.current().loadingpage ) {
                //                        url = '/errorpages/' + _udd.current().loadingpage + ".html";
                //                    }
                //                    else {
                //                        url = 'udd.html?udd=' + _udd.current().id + '&locale=' + _language.current().id;
                //                    }
                //                    window.open( url, '_blank', 'location=0,menubar=0,status=0,titlebar=0,toolbar=0,resizable=1,top=' + top + ',left=' + left + ',width=' + deltaWidth + ',height=' + deltaHeight );
                //                }
            }

            function setHash( uddId ) {
                location.hash = uddId;
            }

            // name spaces
            var _udd = {},
                _language = {},
                _client = {},
                _description = {},
                _devices = {},
                _debug = {},
                _notify = {}
                ;

            // ------------------------------------------------------------------
            // _language
            // ------------------------------------------------------------------
            // Everything that has with the (current) language (list).

            _language.languages = ko.observableArray( viewerConfig.language );
            _language.current = ko.observable();

            if ( getCookie( 'language' ) ) {
                utils.each( _language.languages(), function ( language ) {
                    if ( language.id === getCookie( 'language' ) ) {
                        _language.current( language );
                    }
                } );
            }
            if ( !_language.current() ) {
                _language.current( _language.languages()[0] );
            }

            _language.vm = {
                onSelect: function ( obj ) {
                    if ( utils.isObject( obj ) ) {
                        // select language from object
                        _language.current( obj );
                        setCookie( 'language', _language.current().id );
                    }
                    else if ( typeof obj === "string" ) {
                        // select language from language id
                        utils.each( _language.languages(), function ( language ) {
                            if ( language.id === obj ) {
                                _language.current( language );
                            }
                        } );
                    }
                },
                list: _language.languages,
                heading: 'Språk',
                current: _language.current,
                filter: null,
                filterEnabled: false
            };

            _language.onClick = function () {
                new Popover( _language.vm, $( '#btnLanguage' ) );
            };

            // ------------------------------------------------------------------
            // _udd
            // ------------------------------------------------------------------
            // Everything that has with the (current) udd (list).

            _udd.getName = function ( udd ) {
                return udd.name || udd.id;
            };

            // array of udds
            _udd.uddsAll = ko.observableArray( viewerConfig.udd );

            // array of udds, filter out ignored UDDs
            _udd.udds = ko.observableArray( _udd.uddsAll().filter( function ( udd ) {
                return !udd.ignore;
            } ) );

            // current udd
            _udd.current = ko.observable();

            // update the udd / hash
            onHashChange( true );

            // make sure we're listening to any further changes (when udd changes)
            window.onhashchange = onHashChange;

            _udd.vm = {
                onSelect: function ( obj ) {
                    var str;

                    if ( utils.isObject( obj ) ) {

                        str = obj.id;

                        setHash( str );

                    }
                    else if ( typeof obj === "string" && obj ) {

                        str = obj;

                        setHash( str );
                    }

                },
                list: _udd.udds,
                heading: 'UDD',
                current: _udd.current,
                filter: ko.observable( "" ),
                filterEnabled: true,
                filterFunc: function ( filter ) {
                    var ids = [],
                        regex = new RegExp( "^" + utils.map( filter.split( " " ), function ( arg ) {
                            return "(?=.*\\b.*" + arg + ".*\\b)";
                        } ).join( "" ) + ".+", "i" );
                    utils.each( _udd.udds(), function ( udd ) {
                        if ( udd.tags && regex.test( udd.tags.join( " " ) ) ) {
                            ids.push( udd.id );
                        }
                    } );
                    return ids;
                }
            };

            _udd.onClick = function () {
                _udd.popover = new Popover( _udd.vm, $( '#btnUDDs' ) );
            };

            // ------------------------------------------------------------------
            // _client
            // ------------------------------------------------------------------
            // Everything that has with the client (iframe) is defined in the _client namespace.

            // the source to the UDD (needed for the a/href linking to own window)
            _client.src = ko.observable( '' );

            // variables for client's dimensions
            _client.w = ko.observable( 396 );
            if ( getCookie( 'width' ) ) {
                _client.w( Number( getCookie( 'width' ) ) );
            }

            _client.h = ko.observable( 280 );
            if ( getCookie( 'height' ) ) {
                _client.h( Number( getCookie( 'height' ) ) );
            }

            // minimum width and height
            _client.minWidth = 320;
            _client.minHeight = 150;

            _client.width = ko.computed( {
                read: function () {
                    return _client.w();
                },
                write: function ( value ) {
                    var val = Math.max( value, _client.minWidth );
                    setCookie( 'width', val );
                    _client.w( val );
                }
            } );

            _client.height = ko.computed( {
                read: function () {
                    return _client.h();
                },
                write: function ( value ) {
                    var val = Math.max( value, _client.minHeight );
                    setCookie( 'height', val );
                    _client.h( val );
                }
            } );

            _client.widthString = ko.computed( function () {
                return _client.width() + 'px';
            } );

            _client.heightString = ko.computed( function () {
                return _client.height() + 'px';
            } );

            _client.resizeCalc = new dimension.ResizeCalc( {
                fnWidth: _client.width,
                fnHeight: _client.height,
                factor: 2
            } );

            _client.resizeW = _client.resizeCalc.resizeW;
            _client.resizeH = _client.resizeCalc.resizeH;
            _client.resize = _client.resizeCalc.resize;

            _client.switchDimensions = function () {
                var _h = _client.height();
                _client.height( _client.width() );
                _client.width( _h );
            };

            // ------------------------------------------------------------------
            // _description (left column)
            // ------------------------------------------------------------------

            _description.visible = ko.observable( getCookie( 'visibleMenu', "true" ) === "true" );
            _description.toggleVisible = function () {
                _description.visible( !_description.visible() );
            };
            _description.visible.subscribe( function ( val ) {
                setCookie( 'visibleMenu', val );
            } );

            _description.w = ko.observable( 350 );
            if ( getCookie( 'columnLeftwidth' ) ) {
                _description.w( getCookie( 'columnLeftwidth' ) );
            }
            _description.width = ko.computed( {
                read: function () {
                    return _description.w();
                },
                write: function ( val ) {
                    setCookie( 'columnLeftwidth', val );
                    _description.w( val );
                }
            } );
            _description.widthString = ko.computed( function () {
                return _description.width() + 'px';
            } );
            _description.resizeCalc = new dimension.ResizeCalc( {
                fnWidth: _description.width,
                minx: 250
            } );

            _description.resizeW = _description.resizeCalc.resizeW;

            _description.uddName = ko.computed( function () {
                return _udd.current().name;
            } );

            _description.description = ko.observable( "" );
            _description.descriptionUU = ko.observable( "" );
            _description.design = ko.observable( "" );

            _description.accordionOpen = ko.observable( false );
            _description.contentHeights = {
                description: ko.observable(),
                design: ko.observable(),
                udd: ko.observable()
            };

            _description.configureAccordion = function () {
                var $liOpen = $( '.container_description' ).find( '.heading.open' );
                _description.accordionOpen( Boolean( $liOpen.element( 0 ) ) );
                configureContentHeight();

            };

            function configureContentHeight() {
                $( '.container_description .heading.open + .content > div' ).each( function () {
                    var style = $( this ).element( 0 ).style;
                    style.height = 'auto';
                } );

                setTimeout( function () {
                    $( '.container_description .heading.open + .content' ).each( function () {

                        var liHeight = this.offsetHeight;
                        var $div = $( 'div', this );
                        var style = $div.element( 0 ).style;
                        style.height = liHeight + 'px';
                    } );
                }, 1 );
            }

            configureContentHeight();
            window.onresize = configureContentHeight;

            _description.configureAccordion();

            _description.onClickAccordion = function ( data, event ) {
                var parent = event.target.parentNode;

                while ( !(/li/i.test( parent.tagName )) ) {
                    parent = parent.parentNode;
                }

                $( parent ).toggleClass( "open" );

                _description.configureAccordion();
            };

            // open the UDD description
            _description.onClickAccordion( null, {
                target: $( '.accordion li:first-child h1' ).element()
            } );

            // ------------------------------------------------------------------
            // _devices
            // ------------------------------------------------------------------

            _devices.onClick = function ( obj ) {

                // prepare the grouped list (grouped on OS)
                var listGroup = [];

                utils.each( obj.listGroup, function ( val, key ) {

                    var group = {};
                    group.heading = key;
                    group.list = val;
                    listGroup.push( group );
                } );

                var vm = {
                    onSelect: function ( obj ) {
                        _client.width( obj.width );
                        _client.height( obj.height );
                    },
                    list: listGroup
                };

                new Popover( vm, $( '#btn_' + obj.id ), 'popover_group' );

            };

            _devices.types = viewerConfig.deviceType;

            // ------------------------------------------------------------------
            // Update of iframes
            // ------------------------------------------------------------------

            function updateUrls() {

                var udd = _udd.current();
                var urlIframe = (function () {
                    if ( udd.bidm ) {
                        return 'bidm/' + udd.bidm + (_language.current().id === "en" ? "_en" : "") + ".html";
                    }
                    else if ( udd.errorpage ) {
                        return 'errorpages/' + udd.errorpage + ".html";
                    }
                    else if ( udd.loadingpage ) {
                        return udd.loadingpage + ".html";
                    }
                    else {
                        return 'udd.html';
                    }
                })();

                // --- udd ---

                // prepare GET parameters
                var params = [];
                params.push( 'udd=' + udd.id );
                params.push( 'locale=' + _language.current().id );
                params.push( 'autoFocus=' + _debug.autoFocus() );
                if ( _debug.editPassword() ) {
                    params.push( 'editPassword=' + _debug.editPassword() );
                }
                if ( _debug.challengeResponse() ) {
                    params.push( 'challengeResponse=' + _debug.challengeResponse() );
                }
                if ( _debug.passwordDelay() ) {
                    params.push( 'passwordDelay=' + _debug.passwordDelay() );
                }
                if ( udd.bidm ) {
                    params.push( 'udd=true' );
                }

                // add parameters
                urlIframe += '?' + params.join( '&' );

                _client.src( urlIframe );

                //var iframeUrl = $( ".container_main iframe" ).element().contentWindow.location.href;

                //                if (
                //                        iframeUrl.indexOf( udd.id + '&' ) < 0 ||
                //                        iframeUrl.indexOf( _language.current().id ) < 0
                //                    ) {
                var $uddIframe = $( ".container_main iframe" ).element();
                $uddIframe.contentWindow.location.replace( urlIframe );
                //                }

                // --- descriptions ---

                // descriptions make use of the following path
                var prefix = 'description/';

                //                var urlDescription = prefix + udd.id + '.html';

                var urlDescription = prefix + 'udd_description.html?cacheBuster=' + Math.random() + '&' + params.join( '&' ) + '#' + udd.id;

                var urlUU = prefix + 'uu.html?udd=' + udd.id;

                var locationDescription = $( "#iframe_description" ).element().contentWindow.location;
                // we'll only update if the url has changed (ie. not when only language has changed)
                if ( locationDescription.href.indexOf( urlDescription ) < 0 ) {
                    locationDescription.replace( urlDescription );
                }

                var locationUU = $( "#iframe_uu" ).element().contentWindow.location;
                // we'll only update if the url has changed (ie. not when only language has changed)
                if ( locationUU.href.indexOf( urlUU ) < 0 ) {
                    locationUU.replace( urlUU );
                }

                // notify focus
                if ( _debug.notifyFocus() && _debug.autoFocus() ) {
                    setTimeout( function () {
                        var text = udd.id + " auto focus:";
                        var element = $uddIframe.contentWindow.document.activeElement.outerHTML.replace( /<\s*(\w+).*?>/g, '<$1>' );
                        doNotify( text, element );
                    }, 2000 );
                }
            }

            // ------------------------------------------------------------------
            // Notify
            // ------------------------------------------------------------------

            _notify.visible = ko.observable( false );
            _notify.text = ko.observable( "" );
            _notify.element = ko.observable( "" );
            _notify.timeout = null;
            _notify.pause = doPauseNotifyHide;
            _notify.delay = doHideNotifyAfterDelay;

            function doNotify( text, element ) {
                _notify.visible( true );
                _notify.text( text );
                _notify.element( element );
                doHideNotifyAfterDelay();
            }

            function doPauseNotifyHide() {
                clearTimeout( _notify.timeout );
            }

            function doHideNotifyAfterDelay() {
                clearTimeout( _notify.timeout );
                _notify.timeout = setTimeout( function () {
                    _notify.visible( false );
                }, 5000 );
            }

            // ------------------------------------------------------------------
            // Debug
            // ------------------------------------------------------------------

            _debug.$debugList = $( "#debugList" );

            // active
            _debug.active = ko.observable( false );
            _debug.active.subscribe( function ( val ) {
                if ( val ) {
                    setTimeout( function () {
                        $( "body" ).bind( "click", _debug.handleClick );
                    }, 10 );
                }
                else {
                    $( "body" ).unbind( "click", _debug.handleClick );
                }
            } );

            // click
            _debug.onClick = function () {
                _debug.active( !_debug.active() );
            };
            _debug.handleClick = function ( event ) {
                if ( event.target && !$( event.target ).hasParent( _debug.$debugList.element() ) ) {
                    _debug.active( false );
                }
            };

            // auto focus
            _debug.autoFocus = ko.observable( getCookie( 'autofocus', "true" ) === "true" );
            _debug.autoFocus.subscribe( function ( val ) {
                updateUrls();
                setCookie( 'autofocus', val );
            } );

            // notify focus
            _debug.notifyFocus = ko.observable( getCookie( 'notifyfocus', "false" ) === "true" );
            _debug.notifyFocus.subscribe( function ( val ) {
                updateUrls();
                setCookie( 'notifyfocus', val );
            } );

            // edit password
            _debug.editPassword = ko.observable( getCookie( 'editpassword', "false" ) === "true" );
            _debug.editPassword.subscribe( function ( val ) {
                updateUrls();
                setCookie( 'editpassword', val );
            } );

            // challenge response
            _debug.challengeResponse = ko.observable( getCookie( 'challengeResponse', "" ) );
            var _crTimeout = null;
            _debug.challengeResponse.subscribe( function () {
                _debug.challengeResponse( _debug.challengeResponse().replace( /[^0-9]/g, "" ) );
                clearTimeout( _crTimeout );
                _crTimeout = setTimeout( function () {
                    updateUrls();
                    setCookie( 'challengeResponse', _debug.challengeResponse() );
                }, 500 );
            } );

            // password delay
            _debug.passwordDelay = ko.observable( getCookie( 'passwordDelay', "" ) );
            var _pwdTimeout = null;
            _debug.passwordDelay.subscribe( function () {
                _debug.passwordDelay( _debug.passwordDelay().replace( /[^0-9]/g, "" ) );
                clearTimeout( _pwdTimeout );
                _pwdTimeout = setTimeout( function () {
                    updateUrls();
                    setCookie( 'passwordDelay', _debug.passwordDelay() );
                }, 500 );
            } );

            // ------------------------------------------------------------------
            // Keyboard interaction
            // ------------------------------------------------------------------

            // pageup/pagedown selects prev/next UDD
            Mousetrap.bind( ['pageup', 'pagedown', 'alt+up', 'alt+down'], function ( event ) {
                var uddCurrent = _udd.current(),
                    uddCurrentIndex = -1,
                    uddNext = null,
                    uddNextIndex = -1;

                utils.each( _udd.udds(), function ( udd, i ) {
                    if ( uddCurrent.id === udd.id ) {
                        uddCurrentIndex = parseInt( i, 10 );
                    }
                } );

                if ( uddCurrentIndex > -1 ) {
                    if ( event.which === 34 || event.which === 40 ) {
                        uddNextIndex = (uddCurrentIndex + 1) % _udd.udds().length;
                    }
                    else {
                        uddNextIndex = uddCurrentIndex !== 0 ? uddCurrentIndex - 1 : _udd.udds().length - 1;
                    }

                    uddNext = _udd.udds()[uddNextIndex];
                    _udd.vm.onSelect( uddNext );
                }

                _debug.active( false );
            }, 'keyup' );

            // open UDD list
            Mousetrap.bind( ['alt+u', 'space+u'], function () {
                _udd.onClick();
            }, 'keyup' );

            // open language list
            Mousetrap.bind( ['alt+l', 'space+l'], function () {
                _language.onClick();
            }, 'keyup' );

            // ------------------------------------------------------------------
            //
            // ------------------------------------------------------------------

            // whenever the udd changes we'll update the urls...
            _language.current.subscribe( updateUrls );
            _udd.current.subscribe( updateUrls );

            // ...let's update them right away!
            updateUrls( _udd.current() );

            var $title = document.querySelector( "title" );
            $title.textContent = $title.textContent + " - " + uc.buildnr;

            // ------------------------------------------------------------------
            // Public
            // ------------------------------------------------------------------

            self.appString = uc.toString(); // UDD Viewer major.minor (buildnr)

            self.udd = _udd;
            self.client = _client;
            self.description = _description;
            self.language = _language;
            self.devices = _devices;

            self.debug = _debug;

            self.notify = _notify;

            // an observable telling whether we're performing some sort of drag operation
            // (so that we can put an overlay on the iframe preventing hijacking of any mouse movement)
            self.isDragging = ko.observable( false );

        };

    }
);
