import { appOneConfig } from "./appOne";
import { appTwoConfig } from "./appTwo";

const configs = {
  "appone.com": appOneConfig,
  "apptwo.com": appTwoConfig,
};

export default function getConfig() {
  //const hostname = window.location.hostname; // appone.com / apptwo.com / any-other.com
  const hostnameEnv = process.env.REACT_APP_HOSTNAME || "appone.com";

  return configs[hostnameEnv];
}
