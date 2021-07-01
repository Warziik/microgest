import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Button } from "../../components/Button";

describe("Buttons", () => {
  it("should render a primary button", () => {
    const { getByRole } = render(<Button>My button</Button>);

    expect(getByRole("button")).not.toBeNull();
    expect(getByRole("button")).toHaveTextContent("My button");
  });

  it("should render a secondary button", () => {
    const { getByRole } = render(
      <Button type="contrast">My secondary button</Button>
    );

    expect(getByRole("button")).toBeInTheDocument();
    expect(
      getByRole("button").classList.contains("btn-contrast--primary--normal")
    ).toBeTruthy();
  });

  it("should render a button with an icon", () => {
    const { getByRole } = render(
      <Button icon="user-plus">My button with an icon</Button>
    );

    expect(getByRole("button")).toBeInTheDocument();
  });

  it("should trigger a function on click", () => {
    const handleClick = jest.fn();
    const { getByRole } = render(
      <Button onClick={handleClick}>My button with an action</Button>
    );

    fireEvent.click(getByRole("button"));

    expect(getByRole("button")).toBeInTheDocument();
    expect(handleClick.mock.calls.length).toBe(1);
  });
});
