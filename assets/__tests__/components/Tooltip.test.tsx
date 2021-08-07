import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "../../components/Button";
import { Tooltip } from "../../components/Tooltip";

test("show a tooltip", () => {
  render(
    <Tooltip content="Tooltip bottom!" position="bottom">
      <Button>Show tooltip</Button>
    </Tooltip>
  );

  fireEvent.mouseOver(screen.getByRole("button"));

  const tooltip: HTMLElement = screen.getByRole("tooltip");

  expect(tooltip).toHaveClass("tooltip__content tooltip__content--bottom");
  expect(tooltip).toHaveTextContent("Tooltip bottom!");
});
