import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Modal } from "../../components/Modal";

describe("Modal", () => {
    const mockClose = jest.fn();

    beforeEach(() => {
        render(<Modal title="Test modal" onClose={mockClose} isOpen={true}>
            <a href="#">link</a>
            <input type="text" />
            <button>button</button>
        </Modal>);
    });

    afterEach(() => {
        mockClose.mockClear();
    });

    it("should display aria attributes on Modal element", () => {
        const modal = screen.getByRole("dialog");

        expect(modal.getAttribute("aria-labelledby")).toBe("modalTitle");
        expect(modal.getAttribute("aria-hidden")).toBe("false");
        expect(modal.getAttribute("aria-modal")).toBe("true");
    });

    it("should display the Modal title", () => {
        const modalTitle = screen.getByText("Test modal");
        expect(modalTitle).toBeInTheDocument();
        expect(modalTitle.tagName).toBe("H2");
    });

    it("should close the Modal when clicking the close button", () => {
        // Find aria-label attribute on close button.
        fireEvent.click(screen.getByLabelText("Fermer"));

        expect(mockClose.mock.calls.length).toBe(1);
    });

    it("should close the Modal when pressing Escape", () => {
        fireEvent.keyDown(document, { key: "Escape" });

        expect(mockClose.mock.calls.length).toBe(1);
    });

    it("should not close the Modal when pressing something else than Escape", () => {
        fireEvent.keyDown(document, { key: "Enter" });

        expect(mockClose.mock.calls.length).toBe(0);
    });
});