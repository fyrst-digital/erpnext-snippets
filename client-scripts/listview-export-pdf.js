/**
 * This Client Script adds a PDF Export action to the list view action menu.
 * It directlly downloads the selected items as PDF. You have to make some adjustments to fit your setup.
 * 
 * - <doc_type>: Replace with the DocType you want to add that action. Some value could be "Sales Invoice"
 * - <print_format>: Replace with your desired print format. Some Value could be "Sales Invoice"
 * - <letterhead>: Replace with your desired letterhead. Some Value could be "MyCompany"
 * - <language>: Replace with your language. Some Value could be "en" or "de"
 */

frappe.listview_settings[<doc_type>] = {
    
    onload: function(listview) {
        
        listview.page.add_actions_menu_item(__('Export as PDF'), function() {
            var selected_items = listview.get_checked_items();
            
            if (selected_items.length > 0) {
                selected_items.forEach(item => {
					const pdfUrl = frappe.urllib.get_full_url(`/api/method/frappe.utils.print_format.download_pdf?
						doctype=${encodeURIComponent(listview.doctype)}
						&name=${encodeURIComponent(item.name)}
						&format=${encodeURIComponent(<print_format>)}
						&letterhead=${encodeURIComponent(<letterhead>>)}
						&lang=${encodeURIComponent(<language>)}`);

					const downloadPDF = (url, filename) => {
						const a = document.createElement('a');
						a.style.display = 'none';
						document.body.appendChild(a);
					
						fetch(url)
							.then(response => response.blob())
							.then(blob => {
								const url = window.URL.createObjectURL(blob);
								a.href = url;
								a.download = filename || 'download.pdf';
								
								a.click();

								window.URL.revokeObjectURL(url);
								document.body.removeChild(a);
							});
					};

					downloadPDF(pdfUrl, `${invoice.name}.pdf`);
                })
            } else {
                frappe.msgprint(__("Bitte wählen Sie mindestens eine Rechnung aus."));
            }
        }, true);
    }
};