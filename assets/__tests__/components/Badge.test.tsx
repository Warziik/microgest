import React from 'react';
import { render } from "@testing-library/react";
import { Badge } from '../../components/Badge';

describe("Badges", () => {
    it("should render a badge with type and message provided", () => {
        const { getByText } = render(<Badge type="success" message="Sucess badge" />);

        expect(getByText("Sucess badge")).toBeInTheDocument();
        expect(getByText("Sucess badge").className).toBe("badge--success");
    });

    it("should render a badge Error as message", () => {
        const { getByText } = render(<Badge />);

        expect(getByText("Erreur")).toBeInTheDocument();
        expect(getByText("Erreur").className).toBe("badge--error");
    });

    it("should render a badge with correct status options", () => {
        const { getByText } = render(<Badge status="SENT" />);

        expect(getByText("Envoyé")).toBeInTheDocument();
        expect(getByText("Envoyé").className).toBe("badge--warning");
    });
});