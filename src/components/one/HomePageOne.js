import { Block } from "../common/Block";
import { Link } from "react-router-dom";

export const HomePageOne = () => {
  return (
    <div>
      <h2>Home Page One</h2>
      <nav>
        <Link to="about">about</Link>
      </nav>

      <Block />
    </div>
  );
};
