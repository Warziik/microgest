import { render } from "@testing-library/react";
import React from "react";
import Spinner from "../../components/Spinner";

test("render a spinner", () => {
    const {getByTestId} = render(<Spinner type="circle" center={true} />);

    expect(getByTestId("spinner")).toBeInTheDocument();
    expect(getByTestId("spinner").classList.contains("spinner--circle")).toBeTruthy();
    expect(getByTestId("spinner").classList.contains("spinner--center")).toBeTruthy();
})