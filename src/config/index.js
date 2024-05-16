import { appOneConfig } from "./appOne";
import { appTwoConfig } from "./appTwo";

const configs = {
  "appone.com": appOneConfig,
  "apptwo.com": appTwoConfig,
};

export default function getConfig() {
  const hostnameEnv = process.env.REACT_APP_HOSTNAME;

  return configs[hostnameEnv] || configs["apptwo.com"];
}
