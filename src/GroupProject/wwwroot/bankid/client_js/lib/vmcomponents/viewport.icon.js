"use strict";

define( [
        "ko",
        "dom"
    ], function ( ko, $ ) {

        function ViewportIcon( options ) {

            var self = this;

            var currentPage = ko.computed( function () {
                try {
                    return $( options.$pages()[options.index()] );
                } catch ( err ) {
                }
            } );

            var currentDimensions = ko.computed( function () {
                var index = options.index();
                try {
                    return options.dimensions[index];
                } catch ( err ) {
                }
            } );

            this.viewportStyle = ko.observable( "" );

            function updateViewportStyle() {
                var v = options.$viewport();
                var d = currentPage();
                if ( !v || !d ) {
                    return "";
                }
                var vp = v.position();
                var dp = d.position();

                var styles = [];

                var l = vp.left - dp.left;
                l = l / dp.width * 100;
                l = Math.max( l, 0 );
                styles.push( "left:" + l + "%" );

                var r = dp.right - vp.right;
                r = r / dp.width * 100;
                r = Math.max( r, 0 );
                styles.push( "right:" + r + "%" );

                var t = vp.top - dp.top;
                t = t / dp.height * 100;
                t = Math.max( t, 0 );
                styles.push( "top:" + t + "%" );

                var b = dp.bottom - vp.bottom;
                b = b / dp.height * 100;
                b = Math.max( b, 0 );
                styles.push( "bottom:" + b + "%" );

                self.viewportStyle( styles.join( ";" ) );
            }

            this.pageStyle = ko.observable();

            function updatePageStyle() {
                var dimensions = currentDimensions();
                if ( !dimensions ) {
                    return "";
                }
                var styles = [];
                var w = dimensions[0];
                var h = dimensions[1];
                var size, margin;
                if ( w <= h ) {
                    size = w / h * 100;
                    margin = (100 - size) / 2;
                    styles.push( "margin:0 " + margin + "%" );
                    styles.push( "height:100%" );
                    styles.push( "width:" + size + "%" );
                } else {
                    size = h / w * 100;
                    margin = (100 - size) / 2;
                    styles.push( "margin:" + margin + "% 0" );
                    styles.push( "width:100%" );
                    styles.push( "height:" + size + "%" );
                }
                self.pageStyle( styles.join( ";" ) );
            }

            this.update = function () {
                updatePageStyle();
                updateViewportStyle();
            };
        }

        return ViewportIcon;
    }
);
