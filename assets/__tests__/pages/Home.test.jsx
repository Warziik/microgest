import React from 'react';
import {render} from "@testing-library/react";
import {screen} from "@testing-library/dom";
import Home from "../../pages/Home";

test("it should display the Home title", function() {
    render(<Home />);
    const pageTitle = screen.getByText("Homepage");
    expect(pageTitle).toBeInTheDocument();
})