declare module "react-country-flag" {
    import * as React from 'react';

    export interface ReactCountryFlagProps {
        className: string;
        cdnSuffix?: string;
        cdnUrl?: string;
        countryCode: string;
        svg?: boolean;
        style?: React.CSSProperties;
        title?: string;
        "aria-label"?: string;
    }

    export default class ReactCountryFlag extends React.Component<ReactCountryFlagProps, any> {
    }
}