import React from "react";
import { fireEvent, screen } from "@testing-library/dom";
import { render } from "@testing-library/react";
import Tab from "../../../components/tab/Tab";
import Tabs from "../../../components/tab/Tabs";
import { MemoryRouter } from "react-router";

const mockHistoryReplace = jest.fn();

jest.mock('react-router', () => ({
    ...jest.requireActual("react-router") as Record<string, unknown>,
    useHistory: () => ({
        replace: mockHistoryReplace,
    }),
}));

describe("Tab", () => {
    beforeEach(() => {
        const firstRef = React.createRef<HTMLAnchorElement>();
        const secondRef = React.createRef<HTMLAnchorElement>();
        const thirdRef = React.createRef<HTMLAnchorElement>();
        render(<MemoryRouter>
            <Tabs>
                <Tab title={"Tab 1 title"} tabRef={firstRef}>
                    <p>Tab 1 content</p>
                </Tab>
                <Tab title={"Tab 2 title"} url="/tab-2" tabRef={secondRef}>
                    <p>Tab 2 content</p>
                </Tab>
                <Tab title={"Tab 3 title"} tabRef={thirdRef}>
                    <p>Tab 3 content</p>
                </Tab>
            </Tabs>
        </MemoryRouter>);
    });

    it("should render all the tabs", () => {
        expect(screen.getAllByRole("presentation")).toHaveLength(3);
    });

    it("should be keyboard navigable", () => {
        expect(screen.getByText("Tab 1 title")).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Tab 1 content").parentElement).toHaveAttribute("aria-hidden", "false");

        fireEvent.keyDown(screen.getByText("Tab 1 title"), { key: "ArrowRight" });
        expect(screen.getByText("Tab 1 content").parentElement).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByText("Tab 2 title")).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Tab 2 content").parentElement).toHaveAttribute("aria-hidden", "false");

        fireEvent.keyDown(screen.getByText("Tab 2 title"), { key: "ArrowRight" });
        expect(screen.getByText("Tab 2 content").parentElement).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByText("Tab 3 title")).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Tab 3 content").parentElement).toHaveAttribute("aria-hidden", "false");

        fireEvent.keyDown(screen.getByText("Tab 3 title"), { key: "ArrowRight" });
        expect(screen.getByText("Tab 3 content").parentElement).toHaveAttribute("aria-hidden", "true");
        expect(screen.getByText("Tab 1 title")).toHaveAttribute("aria-selected", "true");
        expect(screen.getByText("Tab 1 content").parentElement).toHaveAttribute("aria-hidden", "false");
    });

    it("should replace the URL on keyboard switch", () => {
        fireEvent.keyDown(screen.getByText("Tab 1 title"), { key: "ArrowRight" });
        expect(mockHistoryReplace).toHaveBeenCalledWith("/tab-2");
        expect(mockHistoryReplace.mock.calls.length).toBe(2);
    });

    it("should replace the URL on click", () => {
        fireEvent.click(screen.getByText("Tab 2 title"));
        expect(mockHistoryReplace).toHaveBeenCalledWith("/tab-2");
    });
});