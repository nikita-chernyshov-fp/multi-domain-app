const axios = require("axios");
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const prNumber = process.env.PR_NUMBER;

const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/pagerules`;

async function createOrUpdateRedirection() {
  const data = {
    targets: [
      {
        target: "url",
        constraint: {
          operator: "matches",
          value: `*://pr-${prNumber}.litl.chat/*`,
        },
      },
    ],
    actions: [
      {
        id: "forwarding_url",
        value: {
          url: `https://deploy-preview-${prNumber}--fp-test-nikita.netlify.app`,
          status_code: 302,
        },
      },
    ],
    status: "active",
  };

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Redirection Rule Updated:", response.data);
  } catch (error) {
    console.error("Failed to update redirection:", error.response.data);
  }
}

createOrUpdateRedirection();
