import { Block } from "../common/Block";
import { Link } from "react-router-dom";

export const HomePageTwo = () => {
  return (
    <div>
      <h2>Home Page Two PR5</h2>
      <nav>
        <Link to="about">about</Link>
      </nav>

      <Block />
    </div>
  );
};
