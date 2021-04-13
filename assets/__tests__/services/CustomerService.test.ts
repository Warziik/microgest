import * as CustomerService from "../../services/CustomerService";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("CustomerService", () => {
    const allCustomersData = {};

    const customerData = {
        firstname: "Foo",
        lastname: "Bar",
        email: "foo@bar.dev",
        company: "Oui"
    }

    it("should returns all the Customers", async () => {
        fetchMock.mockResponse(JSON.stringify(allCustomersData));
        expect(await CustomerService.fetchAllCustomers(1)).toStrictEqual([true, allCustomersData]);
    });

    it("should create a Customer", async () => {
        fetchMock.mockResponse(JSON.stringify(customerData));
        expect(await CustomerService.createCustomer(customerData)).toStrictEqual([true, customerData]);
    });
});