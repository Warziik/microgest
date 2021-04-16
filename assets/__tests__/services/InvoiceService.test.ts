import * as InvoiceService from "../../services/InvoiceService";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("Invoice Service", () => {
    const allInvoicesData = {
        "hydra:member": [
            {
                id: 1,
                chrono: "2021-0001",
                amount: 441.7,
                status: "NEW",
                customer: {
                    id: 1,
                    firstname: "Foo",
                    lastname: "Bar"
                },
                sentAt: "2021-03-26T11:48:18+00:00",
                paidAt: null
            },
            {
                id: 2,
                chrono: "2021-0002",
                amount: 20.7,
                status: "NEW",
                customer: {
                    id: 2,
                    firstname: "Bar",
                    lastname: "Foo"
                },
                sentAt: "2021-03-26T11:48:18+00:00",
                paidAt: null
            }
        ]
    };

    const invoiceData = {
        id: 3,
        chrono: "2021-0003",
        amount: 716,
        status: "NEW",
        customer: {
            id: 1,
            firstname: "Foo",
            lastname: "Bar"
        },
        sentAt: "2021-03-26T11:48:18+00:00",
        paidAt: null
    }

    it("should returns all the Invoices of the logged User", async () => {
        fetchMock.mockResponse(JSON.stringify(allInvoicesData));
        expect(await InvoiceService.fetchAllInvoicesOfUser()).toStrictEqual([true, allInvoicesData]);
    });

    it("should create an Invoice", async () => {
        fetchMock.mockResponse(JSON.stringify(invoiceData));
        expect(await InvoiceService.createInvoice(1, "test", 1)).toStrictEqual([true, invoiceData]);
    });
});