import { ReactElement } from "react";

type Props = {
  name: string;
  children: ReactElement;
};

export function Step({ children }: Props) {
  return children;
}
