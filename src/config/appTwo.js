import { HomePageTwo } from "../components/two/HomePageTwo";
import { AboutPageTwo } from "../components/two/AboutPageTwo";

export const appTwoConfig = {
  title: "App Two",
  theme: "theme-two",
  apiBaseUrl: "https://api.two.com",
  routes: [
    { path: "/", component: HomePageTwo, exact: true },
    { path: "/about", component: AboutPageTwo, exact: true },
  ],
};
