/**
 * @name Templates
 * @exports templates
 *
 * @description The graphics module loads svg into memory and delivers them on demand as string,
 * DOM element or base64 encoded url string
 */

"use strict";

define( [
        "dom"
    ], function templates( $ ) {

        var collectTypeAttribute = "data-collect-type",
            collectAsAttribute = "data-collect-as";

        /**
         * Parse html string in a document fragment
         * @privat
         * @param html {String}
         * @param [clean] {Boolean}
         * @param [documentContext] {Document} Owner document
         * @returns {DocumentFragment}
         */
        function parseStr( html, clean, documentContext ) {

            documentContext = documentContext || window.document;

            var fragment = documentContext.createDocumentFragment(),
                div = documentContext.createElement( 'div' ),
                collection = {};

            // Remove unwanted whitespace from templates
            html = html.replace(/\n/g, "")
                .replace(/[\t\s]+</g, "<")
                .replace(/>[\t\s]+</g, "><")
                .replace(/>[\t\s]+$/g, ">");

            // Convert html string to elements
            div.innerHTML = html;

            // Get elements to collect
            var returnElements = div.querySelectorAll( "[" + collectAsAttribute + "]" );

            // Collect elements to return
            var length = returnElements.length;
            for ( var i = 0; i < length; i++ ) {

                var rel = returnElements[i];

                var type = rel.getAttribute( collectTypeAttribute );
                var name = rel.getAttribute( collectAsAttribute );

                if ( type === "array" ) {

                    if ( !collection[name] ) {

                        collection[name] = [];

                    } else {

                        if ( typeof collection[name].push !== "function" ) {

                            // Already declared as an element
                            throw new Error( "Error in template collection! Duplicate declaration: '" + name + "'." );

                        }

                    }

                    collection[name].push( rel );

                } else if ( !collection[name] ) {

                    rel.clone = clone;
                    collection[name] = rel;

                } else {

                    // Already declared
                    throw new Error( "Error in template collection! Duplicate declaration: '" + name + "'." );

                }

                if ( clean ) {
                    rel.removeAttribute( collectTypeAttribute );
                    rel.removeAttribute( collectAsAttribute );
                }
            }

           // Move elements to document fragment
            while ( div.firstChild ) {
                fragment.appendChild( div.firstChild );
            }

            // Fetch collection to document fragment
            for ( var el in collection ) {

                if ( collection.hasOwnProperty( el ) ) {

                    fragment[el] = collection[el];

                }

            }

            return fragment;

        }

        function clone() {
            /*jshint validthis:true */
            return parseStr( this.outerHTML, true );
        }

        /**
         * This object wil hold all svg dependencies by key name
         * @type {Object}
         */
        var templates = {};

        /**
         * templates : Auto injected by jake build:assets
         */
        var strTemplates = {};
        //<autoconf>
        strTemplates.btn = "<div class=\"button_icon_wrapper\" data-collect-as=\"buttonIcon\"> <button class=\"buttonIcon\" data-bind=\" visible: isVisible, css: { \'nooutline\': nooutline, \'disabled\': isDisabledOrInvalid, \'active\': $data.isActive, \'pageback\': isPageBack }, attr: { id : id, title: title, \'data-type\': type, \'disabled\': isDisabled, \'aria-disabled\': isDisabledOrInvalid, \'type\': buttonType, \'tabindex\': $data.tabIndex, \'aria-pressed\': $data.isActive, \'aria-expanded\': $data.isExpanded, \'aria-haspopup\': $data.hasPopup, \'aria-label: $data.ariaLabel }, click: onClick \"> <span class=\"label\" data-bind=\"text: label, visible: label\"></span><img alt=\"\" class=\"svg\" data-bind=\"attr: {src : src, \'data-svg\': svg}\"/> </button></div> <div class=\"buttonGroup\" data-collect-as=\"buttonGroup\" data-bind=\"hidden: $data.isHidden, attr: { \'data-type\': $data.type, \'data-visible-children\': $data.numVisibleChildren ? $data.numVisibleChildren : 0 }, css: {active: isActive}\" data-container></div> <div class=\"document_zoom_controller\" data-collect-as=\"document-zoom-controller\"> <button class=\"reduce\" data-bind=\"click: reduce.onClick, attr: { title: reduce.title, tabindex: tabIndex, disabled: disabled }\"> <img data-bind=\"attr: { src: reduce.src }\"/></button> <button class=\"overview\" data-bind=\"click: overview.onClick, attr: { title: overview.title, tabindex: tabIndex, disabled: disabled }\"> <span data-bind=\"with: overview.icon\"> <span class=\"overview_page\" data-bind=\"attr: {\'style\': pageStyle}\"> <span class=\"overview_viewport\" data-bind=\"attr: {\'style\': viewportStyle}\"></span> </span> </span> </button> <button class=\"enlarge\" data-bind=\"click: enlarge.onClick, attr: { title: enlarge.title, tabindex: tabIndex, disabled: disabled }\"> <img data-bind=\"attr: { src: enlarge.src }\"/></button></div> <button type=\"button\" data-type=\"helpIcon\" data-collect-as=\"helpIcon\" aria-haspopup=\"true\" data-bind=\"attr:{ \'data-type\': svg, title: title, disabled: $data.disabled, tabindex: $data.tabIndex, \'aria-expanded\': $data.isExpanded }, click: $root.onClick\"> <img alt=\"\" data-bind=\"attr: { src: src, \'class\': svg, \'data-svg\': svg }\"/></button> <button type=\"button\" data-type=\"\" data-collect-as=\"button\" data-bind=\"attr: { \'data-type\': type, title: $data.title, tabindex: $data.tabIndex }, click: onClick, text: text\"></button>";
        strTemplates.form = "<form class=\"form_wrapper\" data-bind=\"submit: $data.onSubmit, attr: { data-info-has-content: $data.hasInfoContent, data-message-has-content: $data.hasMessageContent }\" data-collect-as=\"form\" data-container autocomplete=\"off\"></form> <div class=\"content_wrapper\" data-collect-as=\"contentWrapper\" data-container></div> <div class=\"content_wrapper broad\" data-collect-as=\"contentWrapperBroad\" data-container></div> <div class=\"row label\" data-bind=\"hidden: isHidden()\" data-collect-as=\"rowLabel\"> <label data-bind=\"text: text, attr: {\'for\': id}\"></label> <div class=\"help_wrapper\" data-container=\"help\"></div></div> <div class=\"row form\" data-collect-as=\"rowPid\" data-container></div><div class=\"row form multiple\" data-collect-as=\"rowMultiple\" data-container></div> <div class=\"input_wrapper\" data-collect-as=\"inputWrapper\" data-bind=\"hidden: isHidden()\"> <div class=\"label\" data-bind=\"css: {error: $data.err, active: hasFocus, disabled: disabled }, attr: {\'for\': id, \'aria-disabled\': disabled}\" data-container></div></div> <div class=\"input_wrapper multiple\" data-collect-as=\"multipleInputWrapper\" data-container data-bind=\"css: { active: hasFocus, error: isError }\"></div> <div class=\"label\" data-validate=\"\" data-type=\"\" data-bind=\"css: {error: $data.err}, attr: {\'for\': id, \'data-validate\': validate, \'data-type\': dataType, \'title\': $data.label_title}\" data-collect-as=\"label\" data-container></div> <div class=\"icon\" data-bind=\"visible: src\" data-collect-as=\"icon\"> <div> <img alt=\"\" data-bind=\"attr: { src: src, title: $data.title }\"/> </div></div> <div class=\"input input_password_wrapper\" data-collect-as=\"inputPasswordWrapper\" data-bind=\"css: { disabled: disabled, padding_on_right_side: hasPaddingOnRightSide }, attr: {\'data-type\': type}\"> <label class=\"visible-hidden\" data-bind=\"text: label, visible: label, attr: {\'for\': id}\"></label> <div class=\"wrp\" data-bind=\"visible: isModeText, if: isModeText\"> <input type=\"text\" data-type=\"text\" data-bind=\" attr: { id: id, maxlength: maxlength, \'data-type\': dataType, disabled: disabled, \'aria-disabled\': disabled, \'pattern\': pattern, \'max\': $data.max, \'min\': $data.min, \'step\': $data.step, \'tabindex\': $data.tabIndex, \'aria-invalid\': isInvalid }, value: val, valueUpdate: valueUpdate, css: { error: $data.err, hasFocus: hasFocus, hideCaret: $data.hideCaret, hasValue: hasValue }, event: { focus: onFocus, blur: onBlur } \" autocomplete=\"off\" autocapitalize=\"off\" autocorrect=\"off\" formnovalidate required> <div aria-hidden=\"true\" class=\"placeholder\" data-bind=\"text: placeholder\"></div> </div> <input type=\"password\" value=\"void\" style=\"display: none\" aria-hidden=\"true\"> <input type=\"password\" value=\"bid\" style=\"display: none\" aria-hidden=\"true\"> <div class=\"wrp\" data-bind=\"visible: isModePassword, if: isModePassword\"> <input type=\"password\" data-type=\"\" data-bind=\" attr: { id: id, maxlength: maxlength, \'data-type\': dataType, disabled: disabled, \'aria-disabled\': disabled, \'pattern\': pattern, \'max\': $data.max, \'min\': $data.min, \'step\': $data.step, \'tabindex\': $data.tabIndex, \'aria-invalid\': isInvalid }, value: val, valueUpdate: valueUpdate, css: { error: $data.err, hasFocus: hasFocus, hideCaret: $data.hideCaret, hasValue: hasValue }, event: { focus: onFocus, blur: onBlur } \" autocomplete=\"off\" autocapitalize=\"off\" autocorrect=\"off\" formnovalidate required> <div aria-hidden=\"true\" class=\"placeholder\" data-bind=\"text: placeholder\"></div> </div></div> <div class=\"input\" data-collect-as=\"input\" data-bind=\"css: { disabled: disabled, padding_on_right_side: $data.hasPaddingOnRightSide }\"> <div class=\"wrp\"> <input data-type=\"\" data-bind=\" attr: { maxlength: maxlength, type: type, id: id, \'data-type\': dataType, disabled: disabled, \'aria-disabled\': disabled, \'pattern\': pattern, \'max\': $data.max, \'min\': $data.min, \'step\': $data.step, \'tabindex\': $data.tabIndex, \'aria-invalid\': isInvalid, \'aria-label\': label }, value: val, valueUpdate: valueUpdate, css: { error: $data.err, hasFocus: hasFocus, hideCaret: $data.hideCaret, hasValue: hasValue }, event: { focus: onFocus, blur: onBlur }\" autocomplete=\"off\" autocapitalize=\"off\" autocorrect=\"off\" formnovalidate required> <div aria-hidden=\"true\" class=\"placeholder\" data-bind=\"text: placeholder\"></div> </div></div> <div class=\"input_button_wrapper\" data-collect-as=\"inputButton\"> <button type=\"button\" class=\"input_button\" aria-haspopup=\"true\" data-bind=\"attr: { title : titleButton, disabled: $data.disabledButton, \'tabindex\': $data.tabIndex, \'data-type\': $data.dataType }, click : onClick\"> <div class=\"main\"> <img alt=\"\" data-bind=\"attr: { src: src }\"/> </div> </button></div> <div class=\"row message\" data-bind=\"visible: text, css: {error: $data.err}\" data-collect-as=\"rowMessage\"> <span data-bind=\"html: text\"></span></div> <div class=\"row message\" data-bind=\"visible: text, css: {error: $data.err}\" data-collect-as=\"rowMessageLink\"> <button type=\"button\" class=\"link\" aria-haspopup=\"true\" data-bind=\"click: onClick, attr: { title: $data.title, disabled: $data.disabled, \'aria-disabled\': $data.disabled, tabindex: $data.tabIndex, \'aria-label\': $data.label }\"> <span class=\"text\" data-bind=\"text: text\"></span> <span class=\"icon\" data-bind=\"if: $data.icon\"><img alt=\"\" data-bind=\"attr: { src: $data.icon }\"/></span> </button></div> <div class=\"row info\" data-bind=\"visible: text()\" data-collect-as=\"rowInfo\"> <span data-bind=\"text: text\"></span></div> <div class=\"password_display\" data-collect-as=\"passwordDisplay\" data-bind=\"click: onClick\"> <h1 data-bind=\"visible: title, text: title\"></h1> <p data-bind=\"text: text\"></p></div> <div class=\"input_spinner\" data-bind=\"attr: { \'data-spinner\': spinner }, visible: spinner\" data-collect-as=\"inputSpinner\"> <div> <div> <img class=\"spinner\" src=\"\" data-bind=\"attr: {src: src, alt: $data.title, title: $data.title }\"/> </div> </div></div> <div class=\"show_psw_wrapper\" data-bind=\"css: { visible: visible }\" data-collect-as=\"buttonDisplayPassword\"> <button type=\"button\" class=\"show_psw\" data-bind=\"text: shortText, attr: { disabled: disabled, title: text, tabindex: $data.tabIndex, \'aria-label\': text}, click: onClick\"> </button></div> <div class=\"checkbox_wrapper\" data-collect-as=\"checkboxWrapper\" data-bind=\"hidden: $data.isHidden\"> <input type=\"checkbox\" data-bind=\"attr: {id: id, disabled: disabled, \'aria-disabled: disabled, tabindex: $data.tabIndex }, checked: checked\"/> <label class=\"confirm\" data-bind=\"html: text, attr: { \'for\': id, disabled: disabled, \'aria-disabled: disabled, title: $data.label_title }\"></label></div>";
        strTemplates.img = "<div class=\"logo_wrapper\" data-collect-as=\"bidlogo\" data-bind=\"css: { \'crop\': $data.crop }\"> <div class=\"img_wrapper\"> <img data-bind=\"attr: {src: src, \'data-svg\': svg, alt: title, title: title}\"/> </div></div> <img class=\"icon\" data-collect-as=\"icon\" src=\"\" alt=\"\" title=\"\" data-bind=\"attr: {src: src, alt: title, title: title}\"/>";
        strTemplates.layout = "<div class=\"layout\" data-collect-as=\"layout\"> <header class=\"header\" data-collect-as=\"header\" data-bind=\"attr: {\'data-layout\': header}\"> <div class=\"viewport\" data-container=\"header_left\" data-collect-as=\"vp_header_left\"></div> <div class=\"viewport\" data-container=\"header_right\" data-collect-as=\"vp_header_right\"></div> </header> <main class=\"body\" role=\"main\" data-collect-as=\"body\"> <div class=\"viewport animate\" data-container=\"body\" data-collect-as=\"vp_body\"> </div> </main> <footer class=\"footer\" data-collect-as=\"footer\" data-bind=\"attr: {\'data-layout\': footer}\"> <div class=\"viewport\" data-container=\"footer_left\" data-collect-as=\"vp_footer_left\"></div> <div class=\"viewport\" data-container=\"footer_right\" data-collect-as=\"vp_footer_right\"></div> </footer></div> <div class=\"full_width_height\" data-collect-as=\"mainbody\"></div> <div class=\"scroller padding block_vertical_center full_width_height lm_view\" data-collect-as=\"view\" data-bind=\"css: { lm_left: $data.outOfView }, attr: { \'data-type\': $data.type, tabindex: $data.tabIndex }\"> <div data-container></div></div> <div class=\"lm_view block_vertical_center\" data-collect-as=\"view_component\" data-bind=\"css: { lm_left: $data.outOfView }\" data-container></div> <div class=\"lm_view padding block_vertical_center\" data-collect-as=\"view_noscroll\" data-bind=\"css: { lm_left: $data.outOfView }, attr: { \'data-type\': $data.type }\"> <div data-container></div></div> <div class=\"scroller padding full_width_height lm_view\" data-collect-as=\"view_flow\" data-bind=\"css: { lm_left: $data.outOfView }, attr: { \'data-type\': $data.type, tabindex: $data.tabIndex }\"> <div data-container></div></div> <div class=\"scroller padding full_width_height lm_view scroll_indicator2\" data-collect-as=\"view_flow_indicator\" data-bind=\"css: { lm_left: $data.outOfView }, attr: { \'data-type\': $data.type, tabindex: $data.tabIndex }\"> <div data-container></div></div> <div class=\"full_width_height content_layout lm_view\" data-collect-as=\"viewHeaderBodyFooterLayout\" data-bind=\"css: { lm_left: $data.outOfView }, attr: { \'data-has-header\': header.isVisible, \'data-has-footer\': footer.isVisible, \'data-type\': $data.type }\"> <div class=\"view full_width_height\"> <div class=\"content header\" data-bind=\"visible: header.isVisible\" data-container=\"header\"></div> <div class=\"full_width content body scroll_indicator\"> <div class=\"full_width_height block_vertical_center\"> <div class=\"full_width\" data-container=\"body\"></div> </div> </div> <div class=\"content footer\" data-bind=\"visible: footer.isVisible\"> <div class=\"document_presentation\" data-container=\"footer\"></div> </div> </div></div> <div class=\"full_width_height lm_view\" data-collect-as=\"view_flow_nopadding\" data-bind=\"css: { lm_left: $data.outOfView }, attr: { \'data-type\': $data.type, \'aria-labelledby\': id }\"> <div data-container></div></div> <div class=\"title_wrapper\" data-bind=\"if: text\" data-collect-as=\"title\"> <h1 class=\"block_vertical_center\" data-bind=\" attr: { id: $data.id, tabindex: $data.tabIndex }, css: { double: subtext } \"> <div> <span class=\"title\" data-bind=\"text: text\"></span> <span class=\"subtitle\" data-bind=\"text: subtext, visible: subtext\"></span> </div> </h1></div> <div class=\"signature\" data-collect-as=\"signature\" data-bind=\"hidden: $data.hidden\"> <div class=\"title\" data-bind=\"text: title\"></div> <div class=\"text\" data-bind=\"text: text\"></div></div> <div class=\"container\" data-container=\"\" data-collect-as=\"container\" data-bind=\"css: { lm_left: $data.outOfView }\"></div><div data-container=\"\" data-collect-as=\"wrapper_empty\" data-bind=\"css: { lm_left: $data.outOfView }\"></div> <div data-bind=\"attr: { \'class\': className }\" data-collect-as=\"lm_view2\"> <div> <div class=\"center_vertical padding lm_view_content\"></div> </div></div> <div class=\"full_width_height lm_view lm_right\" data-bind=\" attr: { \'data-type\': $data.type, \'data-document-footer-toolbar\': $data.hasDocumentFooterToolbar, \'data-document-footer-understanding\': $data.hasDocumentFooterUnderstanding } \" data-collect-as=\"view-document\" data-container></div> <div class=\"full_width_height document_presentation\" data-bind=\" attr: { \'data-type\': $data.type, \'data-document-footer-toolbar\': $data.hasDocumentFooterToolbar, \'data-document-footer-understanding\': $data.hasDocumentFooterUnderstanding } \" data-collect-as=\"view-document-wrapper\" data-container></div> <div class=\"confirm_text_wrapper\" data-collect-as=\"layoutDocumentConfirmText\"> <div class=\"confirm_text\" data-bind=\"text: text\"></div></div>";
        strTemplates.popover = "<div class=\"popover_wrapper\" data-popover=\"\" data-position=\"\" data-bind=\"attr: {\'data-position\': getPosition(), \'data-popover\': type}\" data-collect-as=\"popover\"> <div class=\"popover arrow_box\"> <div class=\"arrow\"> <div class=\"border\"></div> <div class=\"fill\"></div> </div> <div class=\"wrapper\"> <div class=\"header\" data-bind=\"visible: title\"> <h2 class=\"title\" data-bind=\"text: title\"></h2> </div> <div class=\"popover_container\" data-container></div> <div class=\"button_close\" data-bind=\"visible: closeButton\"></div> </div> </div></div> <div class=\"infobubble_wrapper\" data-type=\"\" data-position=\"\" data-bind=\"attr: {\'data-position\': getPosition(), \'data-type\': type}\" data-collect-as=\"infoBubble\"> <div class=\"infobubble_container\"> <div class=\"infobubble\" data-bind=\"attr: { tabindex: $data.tabIndex }\" role=\"alert\"> <div class=\"arrow\"> <div class=\"border\"></div> <div class=\"fill\"></div> </div> <div class=\"wrapper\"> <img class=\"icon\" data-bind=\"attr: { src: icon.src }\"/> <span class=\"text\" data-bind=\"text: text\"></span> </div> </div> </div></div> <div class=\"popover_wrapper_broadcast\" data-popover=\"\" data-position=\"\" data-bind=\"attr: {\'data-position\': getPosition(), \'data-popover\': type}\" data-collect-as=\"popoverBroadcast\"> <div class=\"popover arrow_box\"> <div class=\"arrow\"> <div class=\"border\"></div> <div class=\"fill\"></div> </div> <div class=\"wrapper\"> <div class=\"header\" data-bind=\"visible: title\"> <div class=\"title\" data-bind=\"text: title\"></div> </div> <div class=\"popover_container\" data-container></div> <div class=\"button_close\" data-bind=\"visible: closeButton\"></div> </div> </div></div>   <div class=\"popover_contents\" data-collect-as=\"popoverContents\" data-container></div> <div role=\"menu\" class=\"popover_contents menu\" data-bind=\"foreach: items\" data-collect-as=\"popoverContentsMenu\"> <button role=\"menuitem\" class=\"menu_item item\" data-bind=\"attr: { disabled : $data.disabled, \'aria-disabled\': $data.disabled, tabindex: $parent.tabIndex }, click: $data.onClick\"> <span data-bind=\"text: text\"></span> </button></div> <div role=\"menu\" class=\"popover_contents\" data-collect-as=\"popoverContentsDynamic\" data-bind=\"foreach: $root\"> <button role=\"menuitem\" class=\"item link_item\" data-bind=\"click: $root.onClick, attr: { title: $root.title, tabindex: $root.tabIndex }\"> <span class=\"icon\" data-bind=\"if: $root.icon\"> <img alt=\"\" data-bind=\"attr: {src: $root.icon.src}\"/> </span> <span data-bind=\"text: text\"></span> </button></div> <div class=\"link_item\" data-collect-as=\"linkItem\"> <a href=\"javascript:;\" data-bind=\"click: onClick\"> <span data-bind=\"text: text\"></span> </a></div> <div class=\"info_item\" data-bind=\"html: text\" data-collect-as=\"infoItem\" tabindex=\"-1\" role=\"alert\"></div> <div role=\"menu\" class=\"menu history_content\" data-collect-as=\"historyContent\"> <button class=\"item\" role=\"menuitem\" data-bind=\"click: onClick, attr: { title: title, tabindex: $data.tabIndex, disabled: $data.disabled, \'aria-disabled\': $data.disabled }\"> <div data-bind=\"foreach: histories\"> <div class=\"history_item\" data-bind=\"attr: { \'data-type\': $data.type }\"> <div class=\"icon_date_wrapper\"> <span class=\"icon_wrapper\" data-bind=\"with: icon\"> <img class=\"icon\" data-bind=\"attr: { src: src, title: title, alt: title }\"/> </span> <time class=\"date\" data-bind=\"text: date, attr: { \'datatime\': date }\"></time> </div> <div class=\"error_merchant_wrapper\"> <span class=\"error\" data-bind=\"text: $data.error, visible: $data.error\"></span> <span class=\"merchant\" data-bind=\"text: merchant\"></span> </div> </div> </div> <span class=\"read_more_wrapper\" data-bind=\"with: readMore, attr: { \'data-histories\': historiesLength }\"> <img class=\"read_more\" data-bind=\"attr: { src: src }\"/> </span> </button></div> <div role=\"menu\" class=\"popover_contents broadcast\" data-collect-as=\"broadcastContents\"> <button role=\"menuitem\" class=\"item\" data-bind=\"click: onClick, attr: { title: linkTitle, tabindex: $data.tabIndex, disabled: $data.isDisabled, \'aria-disabled\': $data.isDisabled }\"> <div class=\"title\"> <p data-bind=\"text: title\"></p> </div> <div class=\"ingress\" data-bind=\"html: ingress\"></div> <img alt=\"\" data-bind=\"attr: {src: icon.src }\"/> </button></div>";
        strTemplates.dialog = "<div class=\"dialog\" data-collect-as=\"dialog\" role=\"dialog\" data-bind=\"attr: { \'aria-labelledby\': id }\"> <div class=\"wrapper row\"> <div class=\"wrapper cell\"> <div class=\"wrapper center\"> <div class=\"dialog_content_wrapper\" data-container=\"content\"></div> <div class=\"button_close\"></div> </div> </div> </div></div>  <div class=\"list content\" data-bind=\"css : { tabs: hasTabs }\" data-collect-as=\"listContent\"> <h2 class=\"headline\" data-bind=\"attr: { id: id, tabindex: $data.headerTabIndex }, event: { keydown: $root.onKeyHeadline }\"> <span data-bind=\"text : title\"></span> </h2> <div class=\"header_wrapper\" data-bind=\"if: hasTabs\"> <div class=\"header\" data-bind=\"foreach: header, visible: hasTabs\" role=\"tablist\"> <button class=\"head\" role=\"tab\" data-bind=\" click: $root.onClickHeader, css : { active : $root.isSelectedHeader($index()) }, attr: { id: tabId, title : $root.headerTitle, tabindex: $root.tabIndexHead, \'aria-selected\': isSelected, \'aria-controls\': listId }, event: { keydown: $root.onKeyTab } \"> <span data-bind=\"text: title\"></span> </button> </div> </div> <div class=\"body\"> <form class=\"lists\" data-bind=\"submit: $root.onFormSubmit, foreach: list\"> <ul class=\"list\" role=\"radiogroup\" data-bind=\"attr: { id: listId, \'aria-labelledby\': tabId, \'aria-hidden\': isNotSelected }, css: { active : isSelected }, foreach: $data\"> <li class=\"item\" role=\"radio\" data-bind=\" text: title, click: $root.onClickListItem, css: { active: isSelected }, attr: { \'aria-checked\': isSelected, id: id, value: value, title: $root.itemTitle, tabindex: $root.tabIndexItem }, event: { keydown: $root.onKeyItem }\" > </li> </ul> </form> </div></div> <div class=\"text content\" data-type=\"\" data-collect-as=\"txtContent\" data-bind=\"attr: { \'data-type\': type }\"> <h2 class=\"headline\" data-bind=\"attr: { id: id, tabindex: $data.headerTabIndex }\"> <span data-bind=\"text : header\"></span> </h2> <div class=\"body\" data-bind=\"html: text, attr: { tabindex: $data.tabIndex }\"></div> <div class=\"footer\"></div></div>";
        strTemplates.content = "<div class=\"content error\" data-collect-as=\"error\"> <div class=\"message\" data-bind=\"html: message\"></div> <div class=\"call_to_action_wrapper\" data-bind=\"hidden: c2aHidden\" data-container=\"c2a\"></div></div> <div class=\"content info\" data-collect-as=\"infoContent\"> <div class=\"message\" data-bind=\"html: message\"></div> <div class=\"call_to_action_wrapper\" data-bind=\"hidden: c2aHidden\" data-container=\"c2a\"></div></div> <div class=\"content important\" data-collect-as=\"important\"> <div class=\"message\" data-bind=\"html: message\"></div> <div class=\"link_wrapper\"> <a class=\"link\" href=\"javascript:;\" data-bind=\"click: onClickLink, css: { disabled: $data.isDisabled }, attr: { tabindex: $data.tabIndex }\"><span data-bind=\"text: link\"></span></a> </div></div> <div class=\"content broadcast\" data-collect-as=\"contentBroadcast\"> <div class=\"message\"> <h2 data-bind=\"text: title\"></h2> <p data-bind=\"text: ingress\"></p> <div data-bind=\"html: body\"></div> </div></div> <div class=\"content histories\" data-collect-as=\"contentHistories\" data-bind=\"foreach: histories\"> <div class=\"history\" data-bind=\"attr: { \'data-type\': type }\"> <span class=\"icon_wrapper\" data-bind=\"with: icon\"><img alt=\"\" data-bind=\"attr: { src: src }\"/></span> <h2 class=\"title\" data-bind=\"text: title\"></h2> <time class=\"date\" data-bind=\"text: date, attr: { \'datatime\': date }\"></time> <div class=\"merchant\" data-bind=\"text: merchant\"></div> <div class=\"error\" data-bind=\"visible: $data.error, text: $data.error\"></div> </div></div> <div class=\"content info_page\" data-collect-as=\"contentIdleScreen\"> <div class=\"table\"> <div class=\"row\"> <div class=\"title-reference-wrapper\"> <div class=\"title label\"> <h2 data-bind=\"text: title, attr: { tabindex: $data.tabIndex, \'data-type\': type }, event: { \'blur\': onTitleBlur }\"></h2> <div class=\"help_wrapper\" data-container=\"help\"></div> </div> <div class=\"title reference\" data-bind=\"visible: reference\"> <span data-bind=\"text: reference\"></span> </div> </div> <div class=\"illustration\" data-bind=\"attr: { \'data-type\': type }\"> <div class=\"wrapper\" data-bind=\"attr: { title: illustrationTitle }\"> <img class=\"icon\" data-bind=\"attr: { src: src }\" alt=\"\"/> <img alt=\"\" class=\"spinner\" data-bind=\"attr: { src: src_spinner }, if: src_spinner\"/> </div> </div> </div> </div> <div class=\"row instructions\"> <span data-bind=\"text: instructions\"></span> </div></div> <div class=\"content certificate_view\" data-collect-as=\"contentCertificateView\"> <div class=\"tabs_wrapper\"> <div class=\"tabs_container\"> <div class=\"tabs\" data-bind=\"foreach: contents\" role=\"tablist\"> <button class=\"tab\" role=\"tab\" data-bind=\" click: $root.onClickTab, css : { active : isSelected }, attr: { id: $data.idTab, tabindex: $root.tabIndexHead, \'aria-selected\': isSelected, \'aria-controls\': $data.idContent }, event: { keydown: $root.onKeyTab } \"> <span data-bind=\"text: title\"></span> </button> </div> </div> </div> <div class=\"contents_wrapper\" data-bind=\"attr: { tabindex: $data.tabIndex }\"> <div class=\"contents\" data-bind=\"foreach: contents\"> <div class=\"content\" role=\"tabpanel\" data-bind=\"foreach: data, css: { \'active\' : isSelected }, attr: { id: $data.$data.idContent, \'aria-labelledby\': $data.idTab, \'aria-hidden\': isNotSelected }\"> <div class=\"data\"> <h2 class=\"title\" data-bind=\"text: title\"></h2> <div class=\"value\" data-bind=\"html: value\"></div> </div> </div> </div> </div></div> <div class=\"content policy_page\" data-collect-as=\"contentPolicyPage\" data-bind=\"html: text\"></div> <div class=\"content-header\" data-collect-as=\"contentHeader\" data-bind=\"css: {\'hidden\': $data.isHidden}\"> <div class=\"wrapper\"> <div class=\"inner\"> <div> <h2 data-bind=\"text: title, attr: { tabindex: $data.tabIndex }\"></h2> <div class=\"help_wrapper\" data-container=\"help\"></div> </div> </div> </div></div> <div class=\"content-body\" data-collect-as=\"contentBody\"> <div class=\"wrapper\"> <div class=\"inner\" data-bind=\"attr: { tabindex: $data.tabIndex }\" data-container></div> </div></div> <div class=\"content-list bank-list\" data-collect-as=\"bankList\"> <div class=\"lists_wrapper\"> <ul role=\"list\" class=\"list\" data-bind=\"foreach: items\"> <li class=\"item\" data-bind=\"attr: { \'data-icon-type\': $root.itemSupportIcon.type }\"> <button role=\"listitem\" data-bind=\" attr: { \'tabindex\': $root.itemTabIndex }, click: $root.onItemClick, disable: $root.isDisabled \"> <span class=\"support\" data-bind=\"with: $root.itemSupportIcon\"> <img alt=\"\" data-bind=\"attr: { src: src, alt: title }\"/> </span> <span class=\"label\" data-bind=\"text: name\"></span> </button> </li> </ul> </div></div> <div class=\"content-list otp-list\" data-collect-as=\"haList\"> <div class=\"tab-list_wrapper\" data-bind=\"visible: hasTabs\"> <div class=\"tab-list\" data-bind=\"foreach: tabs\" role=\"tablist\"> <button class=\"tab\" role=\"tab\" data-bind=\" click: $root.onTabClick, css : { \'active\': isSelected }, attr: { \'id\': tabId, \'title\': $root.tabTitle, \'tabindex\': $root.tabTabIndex, \'aria-selected\': isSelected, \'aria-controls\': listId }, event: { \'keydown\': $root.onTabKeyDown } \"> <span data-bind=\"text: title\"></span> </button> </div> </div> <div class=\"lists_wrapper\" data-bind=\"foreach: lists\"> <ul class=\"list\" data-bind=\" attr: { \'id\': listId, \'aria-labelledby\': tabId, \'aria-hidden\': isNotSelected }, css: { \'active\': isSelected }, foreach: items \"> <li class=\"item\" data-bind=\" attr: { \'data-icon-type\': $root.itemSupportIcon.type, \'data-is-unused\': $data.isUnused } \"> <button data-bind=\" attr: { \'tabindex\': $root.itemTabIndex }, click: $root.onItemClick, disable: $root.isDisabled \"> <span class=\"support\" data-bind=\"with: $root.itemSupportIcon\"> <img alt=\"\" data-bind=\"attr: { src: src }\"/> </span> <span class=\"visible-hidden support_text\" data-bind=\"text: $root.itemSupportText\"></span> <span class=\"label\" data-bind=\"text: name\"></span> <span class=\"visible-hidden\" data-bind=\"visible: $data.isUnused\">, </span> <span class=\"unused\" data-bind=\"text: $root.unusedText, visible: $data.isUnused, attr: { \'aria-hidden\': $data.isNotUnused }\"></span> </button> </li> </ul> </div></div>  <div class=\"content document_body\" data-collect-as=\"content-document-body\" data-bind=\" attr: { \'tabindex\': $data.tabIndex, \'data-currentPageIndex\': $data.currentPageIndex }\" data-container></div> <div class=\"content document_footer\" data-collect-as=\"content-document-footer\"> <div class=\"document_footer_toolbar_wrapper\" data-bind=\"visible: hasToolbar\" data-container=\"document-footer-toolbar\"></div> <div class=\"document_footer_understanding_wrapper\" data-bind=\"visible: hasUnderstanding\" data-container=\"document-footer-understanding\"></div></div> <div class=\"document_footer_toolbar\" data-collect-as=\"content-document-footer-toolbar\"> <div class=\"table full_width_height\"> <div class=\"zoom_constrols_wrapper left center_vertical\" data-container=\"document-zoom\"></div> <div class=\"page_count_wrapper center\"> <span data-bind=\"text: pageCount\"></span> </div> <div class=\"download_wrapper right center_vertical\" data-container=\"document-download\"></div> </div></div> <div class=\"document_footer_understanding block_vertical_center\" data-collect-as=\"content-document-footer-understanding\" data-container></div> <div class=\"document_footer_confirm\" data-collect-as=\"content-document-footer-confirm\"> <div class=\"table full_width_height\"> <div class=\"confirm_text\"> <span data-bind=\"text: text\"></span> </div> <div class=\"confirm_button\" data-container=\"c2a\"> </div> </div></div> <div class=\"content document txt\" data-collect-as=\"content-document-txt\" data-bind=\"text: content\"></div> <div class=\"content document xml\" data-collect-as=\"content-document-xml\"> <iframe seamless=\"seamless\" data-bind=\"attr: { tabindex: $data.tabIndex, title: $data.title }\"></iframe></div> <div class=\"content document pdf\" data-collect-as=\"content-document-pdf\"> <div class=\"pages\" data-bind=\"foreach: pages\"> <div class=\"page_wrapper\" data-bind=\"attr: { \'data-document-id\': id, \'data-document-page-number\': number }\"> <div class=\"page\" data-bind=\"style: {height: height, width: width}\"> <img class=\"document_page\" src data-bind=\"attr: { \'src\': src }\"/> <div class=\"loading_wrapper\" data-bind=\"hidden: isLoaded()\"> <img class=\"loading\" src data-bind=\"attr: { src: $parent.loadingSrc }\"/> </div> </div> </div> <br/> </div></div> <div class=\"start_sign header\" data-collect-as=\"startSignHeader\"> <div class=\"wrapper\"> <div class=\"inner\"> <div> <h2 data-bind=\"text: title, attr: { tabindex: $data.tabIndex }\"></h2> <div class=\"help_wrapper\" data-container=\"help\"></div> </div> </div> </div></div> <div class=\"start_sign body\" data-collect-as=\"startSignBody\"> <div class=\"wrapper\"> <div class=\"inner\" data-bind=\"attr: { tabindex: $data.tabIndex }\" data-container></div> </div></div> <div class=\"document_list\" data-bind=\"css: {is_all_signed: isAllSigned}\" data-collect-as=\"documentList\"> <ul data-bind=\"foreach: documents\"> <li data-bind=\"css: icon().cls\" aria-live=\"polite\" aria-relevant=\"all\"> <button data-bind=\"attr: { tabindex: $data.tabIndex }, click: onClick, disable: isDisabled\"> <span class=\"support\" data-bind=\"with: icon()\"> <span class=\"gif_spinner\"></span> <img alt=\"\" data-bind=\"attr: { src: src, alt: title }, css: cls\"/> </span> <span class=\"label\" data-bind=\"text: name\"></span> </button> </li> </ul></div> <div class=\"document_list\" data-collect-as=\"loadingSignDocumentList\"> <ul data-bind=\"foreach: documents\"> <li data-bind=\"css: icon().cls\" aria-live=\"polite\" aria-relevant=\"all\"> <div> <span class=\"support\" data-bind=\"with: icon()\"> <span class=\"gif_spinner\"></span> <img alt=\"\" data-bind=\"attr: { src: src, alt: title }\"/> </span> <span class=\"label\" data-bind=\"text: name\"></span> </div> </li> </ul></div> <div class=\"document_list\" data-collect-as=\"controllerDocument\"> <ul> <li> <button data-bind=\"attr: {title: name, tabindex: document.tabIndex }, click: document.onClick, disable: document.isDisabled\"> <span class=\"label\" data-bind=\"text: document.name\"></span> </button> </li> </ul></div>  <div class=\"document_footer_toolbar_wrapper\" data-bind=\"visible: hasToolbar\" data-container=\"document-footer-toolbar\" style=\"display: none;\"></div><div class=\"document_footer_understanding_wrapper\" data-bind=\"visible: hasUnderstanding\" data-container=\"document-footer-understanding\" style=\"display: none;\"></div>";
        templates.btn = parseStr( strTemplates.btn );
        templates.form = parseStr( strTemplates.form );
        templates.img = parseStr( strTemplates.img );
        templates.layout = parseStr( strTemplates.layout );
        templates.popover = parseStr( strTemplates.popover );
        templates.dialog = parseStr( strTemplates.dialog );
        templates.content = parseStr( strTemplates.content );
    //</autoconf>

        /**
         * Remove footer from the view
         * @public
         * @memberOf templates
         * @return {*} The removed footer
         */
        templates.removeFooter = function () {
            $( this.layout.body ).addClass( "no-footer" );

            var footer = this.layout.footer;

            if ( footer.parentNode ) {
                footer.parentNode.removeChild( footer );
            }

            return footer;
        };

        templates.getFragment = function ( file, id, documentContext ) {
            var html = strTemplates[file];
            var template = parseStr( html, false, documentContext );
            return template[id];
        };

        return templates;

    }
);
