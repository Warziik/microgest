import React from "react";
import ReactCountryFlag from "react-country-flag";
import {getName as getCountryName, alpha3ToAlpha2} from "i18n-iso-countries";
import {emojiSupport} from "../utils/emojiSupport";

type Props = {
    countryCode: string;
}

export function CountryFlag({countryCode}: Props) {
    return <ReactCountryFlag
        className="countryFlag"
        countryCode={alpha3ToAlpha2(countryCode)}
        aria-label={getCountryName(countryCode, "fr", {select: "official"})}
        title={`Drapeau ${getCountryName(countryCode, "fr", {select: "official"})}`}
        svg={!emojiSupport()}
    />
}