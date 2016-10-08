/**
 * Live regions are WAI-ARIA support that helps screen readers conveying run time updates. This view model makes use of
 * such regions and listens for important messages delivered from any point in the system.
 *
 * @author Flemming Lauritzen, flemming.lauritzen@knowit.no
 */

"use strict";

define( ["dom", "ko", "event_handler"], function ( $, ko, event_handler ) {

    var vmAssertive = {
            text: ko.observable(),
            timeout: null
        },
        vmPolite = {
            text: ko.observable(),
            timeout: null
        };

    function appendOrEmptyText( vm, text ) {
        if ( text ) {
            if ( vm.text() ) {
                text = vm.text() + text;
            }
            vm.text( text + "\n" );

            clearTimeout( vm.timeout );
            vm.timeout = setTimeout( function () {
                appendOrEmptyText( vm, null );
            }, 5000 );
        }
        else {
            vm.text( "" );
        }
    }

    event_handler.on( "assistive_message", function ( message, type ) {
        switch ( type ) {
            case "polite":
                appendOrEmptyText( vmPolite, message );
                break;
            default:
                appendOrEmptyText( vmAssertive, message );
        }
    } );

    ko.applyBindings( vmAssertive, $( ".live_region.assertive" ).element() );
    ko.applyBindings( vmPolite, $( ".live_region.polite" ).element() );

} );