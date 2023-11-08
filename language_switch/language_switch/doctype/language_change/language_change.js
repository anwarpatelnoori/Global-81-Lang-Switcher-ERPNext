// Copyright (c) 2023, Noori and contributors
// For license information, please see license.txt

frappe.ui.form.on('Language Change', {
    refresh: function (frm) {
        // Assuming 'Select Language' is the text on your button
        // and the button has been rendered in the form
        $(`button:contains('Select Language')`).on('click', function () {
            // Call the function to populate the child table
            populate_languages(frm);
        });
    }
});

function populate_languages(frm) {
    // Make an API call to get all languages
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Language',
            fields: ['language_name', 'language_code'],
            limit_page_length: 81
        },
        callback: function (r) {
            if (r.message) {
                // Clear the child table before adding new rows
                frm.clear_table('language_list');
                console.log(`First Language Name: ${r.message[0].language_name}, First Language Code: ${r.message[0].language_code}`);


                // Loop through the results and add them to the child table
                r.message.forEach(function (language) {
                    var child = frm.add_child('language_list');
                    child.language_name = language.language_name;
                    child.language_abbr = language.language_code;
                    // console.log(language.language_name, language.language_code)
                });

                // Refresh the child table to show the new rows
                frm.refresh_field('language_list');
            }
        }
    });
}
