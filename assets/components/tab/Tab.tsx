import { ReactElement, Ref } from "react";

type Props = {
    title: string;
    url?: string;
    children: ReactElement;
    tabRef: Ref<HTMLAnchorElement>;
}

export default function Tab({ children }: Props) {
    return children;
}