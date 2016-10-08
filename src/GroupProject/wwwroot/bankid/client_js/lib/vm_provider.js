/**
 * Defines constructors for components used throughout the client. Combining instances of these components, along with
 * build scripts, make out the document fragments that are injected into the DOM tree.
 * @namespace vmcomponents
 */

"use strict";

define( [
    "lib/vmcomponents/common.vmcomponent",
    "lib/vmcomponents/button.vmcomponent",
    "lib/vmcomponents/buttonicon.vmcomponent",
    "lib/vmcomponents/textinput.vmcomponent",
    "lib/vmcomponents/buttontextinput.vmcomponent",
    "lib/vmcomponents/label.vmcomponent",
    "lib/vmcomponents/popover.vmcomponent",
    "lib/vmcomponents/infobubble.vmcomponent",
    "lib/vmcomponents/dialog.vmcomponent",
    "lib/vmcomponents/listcontent.vmcomponent",
    "lib/vmcomponents/textcontent.vmcomponent",
    "lib/vmcomponents/tabcontent.vmcomponent",
    "lib/vmcomponents/passworddisplay.vmcomponent",
    "lib/vmcomponents/calltoaction.vmcomponent",
    "lib/vmcomponents/helpdialog.vmcomponent",
    "lib/vmcomponents/textdocumentbody.vmcomponent",
    "lib/vmcomponents/pdfdocumentbody.vmcomponent",
    "lib/vmcomponents/xmldocumentbody.vmcomponent",
    "lib/vmcomponents/viewport.icon",
    "lib/vmcomponents/list.vmcomponent",
    "lib/vmcomponents/ha_list.vmcomponent"
], function VmComponents( commonVmComponents, Button, ButtonIcon, TextInput, ButtonTextInput, Label, Popover, InfoBubble, Dialog, ListContent, TextContent, TabContent, PasswordDisplay, CallToAction, HelpDialog, TextDocumentBody, PdfDocumentBody, XmlDocumentBody, ViewportIcon, List, HaList ) {

    var vmcomponents = {
        Button: Button,
        ButtonIcon: ButtonIcon,
        TextInput: TextInput,
        ButtonTextInput: ButtonTextInput,
        Label: Label,
        Popover: Popover,
        InfoBubble: InfoBubble,
        Dialog: Dialog,
        ListContent: ListContent,
        TextContent: TextContent,
        TabContent: TabContent,
        PasswordDisplay: PasswordDisplay,
        CallToAction: CallToAction,
        HelpDialog: HelpDialog,
        TextDocumentBody: TextDocumentBody,
        PdfDocumentBody: PdfDocumentBody,
        XmlDocumentBody: XmlDocumentBody,
        List: List,
        HaList: HaList,
        ViewportIcon: ViewportIcon,
        animationDuration: commonVmComponents.animationDuration,
        useExitAnimation: commonVmComponents.useExitAnimation
    };

    return vmcomponents;

} );