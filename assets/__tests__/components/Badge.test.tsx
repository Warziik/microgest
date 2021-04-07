import React from 'react';
import { render } from "@testing-library/react";
import { Badge } from '../../components/Badge';

describe("Badges", () => {
    it("should render a badge", () => {
        const { getByText } = render(<Badge type="success" message="Sucess badge" />);

        expect(getByText("Sucess badge")).not.toBeNull();
        expect(getByText("Sucess badge").className).toBe("badge--success");
    })
})