import React from 'react';
import {render, screen} from "@testing-library/react";
import Home from "../../pages/Home";

test("it should display the Home title", () => {
    render(<Home />);
    const pageTitle = screen.getByText("Homepage");
    expect(pageTitle).toBeInTheDocument();
})