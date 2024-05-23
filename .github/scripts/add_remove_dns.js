const axios = require("axios");

// Set your environment variables or pass them as arguments
const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;
const prNumber = process.env.GITHUB_PR_NUMBER;
const branchName = process.env.BRANCH_NAME;

// Normalize branch name
const normalizedBranchName = branchName
  .replace(/\//g, "-")
  .replace(/_/g, "-")
  .toLowerCase();
const previewUrl = `https://${normalizedBranchName}.multi-domain-app.pages.dev`;
const recordName = `pr-${prNumber}.litl.chat`;
console.log("previewUrl", previewUrl);
console.log("recordName", recordName);

const headers = {
  Authorization: `Bearer ${cloudflareApiToken}`,
  "Content-Type": "application/json",
};
console.log("headers", headers);

// Function to update DNS record
async function updateDnsRecord() {
  console.log(
    `Creating or updating DNS record for ${recordName} to ${previewUrl}`
  );

  const body = {
    type: "CNAME",
    name: recordName,
    content: previewUrl,
    ttl: 1,
    proxied: true,
  };
  const url = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records`;

  const response = await axios.post(url, body, { headers });

  console.log(response?.data); // Log the response from the Cloudflare API
}

// Function to remove DNS record
async function removeDnsRecord() {
  console.log(`Removing DNS record for ${recordName}`);

  // Fetch DNS record ID
  const getUrl = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records?name=${recordName}`;
  const getResponse = await axios.get(getUrl, { headers });

  const recordId = getResponse.data.result[0]?.id;

  if (recordId) {
    // Delete DNS record
    const deleteUrl = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records/${recordId}`;
    const deleteResponse = await axios.delete(deleteUrl, {
      headers,
    });

    console.log(deleteResponse?.data);
  } else {
    console.log("No DNS record found to delete.");
  }
}

// Determine action based on environment variable or argument
try {
  if (process.argv[2] === "remove") {
    removeDnsRecord();
  } else {
    updateDnsRecord();
  }
} catch (error) {
  console.log("error", error);
}
