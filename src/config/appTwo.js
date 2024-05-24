import { HomePageTwo } from "../components/two/HomePageTwo";
import { AboutPageTwo } from "../components/two/AboutPageTwo";

export const appTwoConfig = {
  title: "App Two",
  routes: [
    { path: "/", component: HomePageTwo, exact: true },
    { path: "/about", component: AboutPageTwo, exact: true },
    { path: "/about2", component: AboutPageTwo, exact: true },
  ],
  wrapper: ({ children }) => (
    <div style={{ border: "4px solid red" }}>{children}</div>
  ),
};
