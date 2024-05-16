import { FC } from "react";

export type BlockProps = {
  name: string;
};

export const Block: FC<BlockProps> = ({ name = "name" }) => {
  return <div>{`Common - Block: ${name}`}</div>;
};
