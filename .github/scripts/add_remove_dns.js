const axios = require("axios");

// Set your environment variables or pass them as arguments
const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;
const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const prNumber = process.env.GITHUB_PR_NUMBER;
const branchName = process.env.BRANCH_NAME;

// Custom const
const projectName = "multi-domain-app"; // cloudflare pages => project name

// Normalize branch name
const normalizedBranchName = branchName
  .replace(/\//g, "-")
  .replace(/_/g, "-")
  .toLowerCase();
const previewUrl = `${normalizedBranchName}.multi-domain-app.pages.dev`;
const recordName = `pr-${prNumber}.litl.chat`;
console.log("previewUrl", previewUrl);
console.log("recordName", recordName);

const headers = {
  Authorization: `Bearer ${cloudflareApiToken}`,
  "Content-Type": "application/json",
};
console.log("headers", headers);

async function addCustomDomain() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/pages/projects/${projectName}/domains`;

  try {
    const response = await axios.post(
      url,
      { hostname: recordName },
      {
        headers,
      }
    );

    // Log the response from Cloudflare
    console.log("Success:", response.data);
  } catch (error) {
    // Handle errors here
    console.error(
      "Error adding domain:",
      error.response ? error.response.data : error.message
    );
  }
}

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

  console.log("body", body);
  console.log("url", url);

  try {
    const response = await axios.post(url, body, { headers });

    console.log(response?.data); // Log the response from the Cloudflare API

    await addCustomDomain();
  } catch (error) {
    console.log("error", JSON.stringify(error));
  }
}

// Function to remove DNS record
async function removeDnsRecord() {
  console.log(`Removing DNS record for ${recordName}`);

  // Fetch DNS record ID
  const url = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records?name=${recordName}`;
  const getResponse = await axios.get(url, { headers });

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
