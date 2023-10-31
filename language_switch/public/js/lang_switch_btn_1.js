frappe.provide('language_switch.ui.toolbar');

language_switch.ui.toolbar.Toolbar = class LanguageSwitch extends frappe.ui.toolbar.AwesomeBar {
    make() {
        super.make();
        this.add_custom_button();
    }

    add_custom_button() {
        $(document).ready(function () {
            var button = $(
                '<li class="custom-toolbar-button"><button class="btn btn-default">Button 1</button></li>');
            $('.navbar .dropdown').last().before(button);

            button.click(function () {
                frappe.msgprint("Select Your Language!");
            });
        });
    }
}
