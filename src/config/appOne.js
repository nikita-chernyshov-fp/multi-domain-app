import { HomePageOne } from "../components/one/HomePageOne";
import { AboutPageOne } from "../components/one/AboutPageOne";

export const appOneConfig = {
  title: "App One",
  theme: "theme-one",
  apiBaseUrl: "https://api.one.com",
  routes: [
    { path: "/", component: HomePageOne, exact: true },
    { path: "/about", component: AboutPageOne, exact: true },
  ],
};
