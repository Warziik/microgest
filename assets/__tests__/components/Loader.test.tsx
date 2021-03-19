import { render } from "@testing-library/react";
import React from "react";
import { Loader } from "../../components/Loader";

test("render a loader", () => {
    const { getByTestId } = render(<Loader type="circle" center={true} />);

    expect(getByTestId("loader")).toBeInTheDocument();
    expect(getByTestId("loader").classList.contains("loader--circle")).toBeTruthy();
    expect(getByTestId("loader").classList.contains("loader--center")).toBeTruthy();
})