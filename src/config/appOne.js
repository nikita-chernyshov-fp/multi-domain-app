import { HomePageOne } from "../components/one/HomePageOne";
import { AboutPageOne } from "../components/one/AboutPageOne";

export const appOneConfig = {
  title: "App One",
  routes: [
    { path: "/", component: HomePageOne, exact: true },
    { path: "/about", component: AboutPageOne, exact: true },
  ],
  wrapper: ({ children }) => (
    <div style={{ border: "4px solid blue" }}>{children}</div>
  ),
};

