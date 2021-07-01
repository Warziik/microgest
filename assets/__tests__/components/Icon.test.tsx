import React from "react";
import { render } from "@testing-library/react";
import { Icon } from "../../components/Icon";

test("display an icon", () => {
  render(<Icon name="user-plus" className="userIcon" />);

  const icon: SVGElement | null = document.querySelector("svg");
  let xlink = icon?.querySelector("use")?.getAttribute("xlink:href");
  xlink = xlink?.split("#")[1];

  expect(icon).toBeInTheDocument();
  expect(xlink).toBe("icon-user-plus");
  expect(icon).toHaveClass("userIcon");
});
