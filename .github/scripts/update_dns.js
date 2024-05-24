const axios = require("axios");

const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const prNumber = process.env.GITHUB_PR_NUMBER;

const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`;

const headers = {
  Authorization: `Bearer ${apiToken}`,
  "Content-Type": "application/json",
};

async function createOrUpdateDNSRecord() {
  const data = {
    type: "CNAME",
    name: `pr-${prNumber}.litl.chat`,
    content: `deploy-preview-${prNumber}--multi-domain-app-test.netlify.app`,
    ttl: 120,
    proxied: false,
  };

  try {
    let response = await axios.post(apiUrl, data, { headers });
    console.log("DNS Update Response:", response.data);
  } catch (error) {
    console.error("Error updating DNS:", error.response.data);
  }
}

if (process.argv[2] === "create") {
  createOrUpdateDNSRecord();
}
