import * as CustomerService from "../../services/CustomerService";
import fetchMock from "jest-fetch-mock";
import {CustomerFormData} from "../../types/Customer";

fetchMock.enableMocks();

describe("CustomerService", () => {
    const allCustomersData = {
        "hydra:member": []
    };

    const customerData: CustomerFormData = {
        type: "PERSON",
        firstname: "Foo",
        lastname: "Bar",
        email: "foo@bar.dev",
        phone: null,
        company: null,
        siret: null,
        address: "119 avenue Aléatoire",
        city: "Paris",
        postalCode: 75000,
        country: "FRA"
    }

    it("should returns all the Customers", async () => {
        fetchMock.mockResponse(JSON.stringify(allCustomersData));
        expect(await CustomerService.fetchAllCustomers()).toStrictEqual([true, allCustomersData]);
    });

    it("should create a Customer", async () => {
        fetchMock.mockResponse(JSON.stringify(customerData));
        expect(await CustomerService.createCustomer(customerData)).toStrictEqual([true, customerData]);
    });
});