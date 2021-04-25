import React from "react";
import { render, screen } from "@testing-library/react";
import { Spinner } from "../../components/Spinner";

test("render a Spinner", () => {
    render(<Spinner center={true} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveClass("spinner--circle spinner--center");
})