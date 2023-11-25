frappe.ui.toolbar.Toolbar = class Toolbar extends frappe.ui.toolbar.Toolbar {
    constructor() {
        super();
        this.languageList = null;
        this.fetchLanguages();
    }

    fetchLanguages() {
        // Fetch the language list from the server and store it
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Language',
                fields: ['language_name', 'language_code'],
                limit_page_length: 0
            },
            callback: (r) => {
                if (r.message) {
                    this.languageList = r.message;
                    this.make();
                }
            }
        });
    }

    make() {
        super.make();
        // Only proceed if languageList is populated and the dropdown doesn't exist yet
        if (this.languageList && $('#languageDropdown').length === 0) {
            this.add_custom_button();
        }
    }

    add_custom_button() {
        // Only append the new dropdown HTML if it does not already exist
        if ($('#languageDropdown').length === 0) {
            // Create the dropdown HTML with dynamic language list
            const dropdownHtml = $(`
                <div class="dropdown">
                    <button class="dropbtn">Select Language</button>
                    <ul class="dropdown-content" id="languageDropdown"></ul>
                </div>
            `);

            // Append the dropdown to the navbar
            $('.navbar .dropdown').first().before(dropdownHtml);
        }

        // Populate the dropdown with languages only if it's empty
        if ($('#languageDropdown').is(':empty')) {
            let listItemsHtml = this.languageList.map(language =>
                `<li data-lang-code="${language.language_code}">${language.language_name}-${language.language_code}</li>`
            ).join('');

            // Append list items to the dropdown
            $('#languageDropdown').html(listItemsHtml);
        }

        // Event delegation for the dropdown list items
        $('#languageDropdown').on('click', 'li', (event) => {
            const languageCode = $(event.currentTarget).data('lang-code');
            this.set_language(languageCode);
            $('#languageDropdown').removeClass('show');
        });

        // Event handler for the dropdown button
        $('.dropbtn').click(function (event) {
            event.stopPropagation();
            $('#languageDropdown').toggleClass('show');
        });
    }

    set_language(languageCode) {
        // Show the loading overlay
        this.showLoadingOverlay();

        // Debounce the server call if necessary, and then change the language
        frappe.call({
            method: 'frappe.client.set_value',
            args: {
                doctype: 'User',
                name: frappe.session.user,
                fieldname: 'language',
                value: languageCode
            },
            callback: (response) => {
                // Hide the loading overlay
                this.hideLoadingOverlay();

                if (!response.exc) {
                    location.reload();
                } else {
                    console.error("Error changing user language:", response.exc);
                }
            }
        });
    }

    // Function to show the loading overlay
    showLoadingOverlay() {
        $('#loadingOverlay').show();
    }

    // Function to hide the loading overlay
    hideLoadingOverlay() {
        $('#loadingOverlay').hide();
    }
}

// Close the dropdown when clicking outside of it
$(document).click(function (event) {
    if (!$(event.target).closest('.dropdown').length) {
        $('#languageDropdown').removeClass('show');
    }
});

$(document).ready(function () {
    new frappe.ui.toolbar.Toolbar();
    // Add the loading overlay to the DOM if it doesn't already exist
    if ($('#loadingOverlay').length === 0) {
        $('body').append('<div id="loadingOverlay" style="display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(0,0,0,0.5); z-index: 9999;"><div>Loading...</div></div>');
    }
});