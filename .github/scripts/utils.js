const axios = require("axios");

// Configurations from environment variables
// const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;
//const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
// const projectName = process.env.CLOUDFLARE_PROJECT_NAME;
// const domain = process.env.DOMAIN;

const headers = {
  Authorization: `Bearer ${cloudflareApiToken}`,
  "Content-Type": "application/json",
};

const handleError = (error, message) => {
  console.error(message, error.response ? error.response.data : error.message);
  process.exit(1);
};

const fetchResource = async (url, method = "get", data = null) => {
  try {
    const response = await axios({
      method,
      url,
      headers,
      data,
    });

    return response.data;
  } catch (error) {
    handleError(error, `Error during "${method}" request to "${url}"`);
  }
};

module.exports = { fetchResource, handleError, headers };
