import {DataAccess} from "../utils/dataAccess";
import {DEVIS_URI, INVOICES_URI} from "../config/entrypoints";

/**
 * Send a GET request to get the PDF file of the Invoice
 *
 * @param resourceType The resource type
 * @param id The resource identifier
 */
export async function downloadExportableDocument(resourceType: 'invoice' | 'devis', id: number): Promise<boolean> {
    let uri: string;
    switch (resourceType) {
        case 'invoice':
            uri = INVOICES_URI;
            break;
        case 'devis':
            uri = DEVIS_URI;
            break;
        default:
            uri = "";
            break;
    }

    const [isSuccess, data] = await DataAccess.request(`${uri}/${id}/export`, {
        method: "GET",
    }, false, true);

    if (isSuccess) {
        const filename: string = data[1].get("Content-Disposition").split("filename=")[1];
        const url = window.URL.createObjectURL(new Blob([data[0]]))

        const link = document.createElement("a");
        document.body.appendChild(link);
        link.href = url;
        link.setAttribute("download", filename);
        link.click();
        document.body.removeChild(link);
    }

    return isSuccess;
}