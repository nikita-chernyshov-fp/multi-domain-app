const axios = require("axios");
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const prNumber = process.env.PR_NUMBER;

const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/pagerules`;

async function createOrUpdateBulkRedirect() {
  const data = {
    // Define the match pattern and forwarding URL
    patterns: [`*://pr-${prNumber}.litl.chat/*`],
    forwards_to: `https://deploy-preview-${prNumber}--fp-test-nikita.netlify.app`,
  };

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log(
      `Bulk redirection created or updated for PR-${prNumber}:`,
      response.data
    );
  } catch (error) {
    console.error(
      `Failed to create or update bulk redirection for PR-${prNumber}:`,
      error.response ? error.response.data : error.message
    );
  }
}

createOrUpdateBulkRedirect();
