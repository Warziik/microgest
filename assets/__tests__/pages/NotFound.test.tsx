import { render as rtlRender, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Router from "../../navigation/Router";

const render = (ui: JSX.Element, {route = '/'} = {}) => {
    window.history.pushState({}, 'Test page', route)
  
    return rtlRender(ui, {wrapper: BrowserRouter})
}

test("render not found page", () => {
    render(<Router />, {route: "/random"});

    expect(screen.getByText("La page demandée n'a pu être trouvée.")).toBeInTheDocument();
})