frappe.provide('frappe.ui.toolbar');

frappe.ui.toolbar.Toolbar = class Toolbar extends frappe.ui.toolbar.Toolbar {
    make() {
        super.make();
        this.add_custom_button();
    }

    add_custom_button() {
        $(document).ready(function () {
            var button = $(
                '<li class="custom-toolbar-button"><button class="btn btn-default">Button 2</button></li>');
            $('.navbar .dropdown').last().before(button);

            button.click(function () {
                frappe.msgprint("Select Your Language!");
            });
        });
    }
}

frappe.ui.toolbar.Toolbar = class extends frappe.ui.toolbar.Toolbar {
    make() {
        super.make();
        this.add_language_button();
    }

    add_language_button() {
        const language_button = $(`<button class="btn btn-default">Change Language</button>`);
        language_button.click(() => {
            // Logic to change language goes here
        });
        $('.navbar-right').prepend(language_button);
    }
};
