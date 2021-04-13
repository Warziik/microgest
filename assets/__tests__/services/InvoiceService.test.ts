import * as InvoiceService from "../../services/InvoiceService";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("InvoiceService", () => {
    const allInvoicesData = {
        "allInvoices": [
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

    it("should returns all the Invoices", async () => {
        fetchMock.mockResponse(JSON.stringify(allInvoicesData));
        expect(await InvoiceService.fetchAllInvoicesOfUser(1)).toStrictEqual([true, allInvoicesData]);
    });
});