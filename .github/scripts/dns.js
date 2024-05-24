const axios = require("axios");

// Environment variables
const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;
const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const projectName = process.env.CLOUDFLARE_PROJECT_NAME;
const prNumber = process.env.GITHUB_PR_NUMBER;
const branchName = process.env.BRANCH_NAME;

// Project configuration
const normalizedBranchName = branchName
  .replace(/\//g, "-")
  .replace(/_/g, "-")
  .toLowerCase();
const previewUrl = `${normalizedBranchName}.multi-domain-app.pages.dev`;
const recordName = `pr-${prNumber}.litl.chat`;

const headers = {
  Authorization: `Bearer ${cloudflareApiToken}`,
  "Content-Type": "application/json",
};

// Logs
console.log("previewUrl:", previewUrl);
console.log("recordName:", recordName);
console.log("headers:", headers);

async function checkDnsRecordExists() {
  const url = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records?type=CNAME&name=${recordName}`;
  try {
    const response = await axios.get(url, { headers });
    const records = response.data.result;
    return records.length > 0 ? records[0] : null;
  } catch (error) {
    console.error(
      "Error checking DNS record:",
      error.response ? error.response.data : error.message
    );
    process.exit(1);
  }
}
async function checkCustomDomainExists() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/pages/projects/${projectName}/domains`;
  try {
    const response = await axios.get(url, { headers });
    const domains = response.data.result;
    return domains.find((domain) => domain.name === recordName) ? true : false;
  } catch (error) {
    console.error(
      "Error checking custom domain:",
      error.response ? error.response.data : error.message
    );
    process.exit(1);
  }
}

async function addCustomDomain() {
  const exists = await checkCustomDomainExists();
  if (exists) {
    console.log("Custom domain already exists, skipping addition...");
    return;
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/pages/projects/${projectName}/domains`;
  try {
    const response = await axios.post(url, { name: recordName }, { headers });
    console.log("Custom domain added successfully:", response.data);
  } catch (error) {
    console.error(
      "Error adding custom domain:",
      error.response ? error.response.data : error.message
    );
    process.exit(1);
  }
}

async function removeCustomDomain() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/pages/projects/${projectName}/domains/${recordName}`;

  try {
    const response = await axios.delete(url, { headers });
    console.log("Custom domain removed successfully:", response.data);
  } catch (error) {
    console.error(
      "Error removing custom domain:",
      error.response ? error.response.data : error.message
    );
    process.exit(1);
  }
}

async function updateDnsRecord() {
  const existingRecord = await checkDnsRecordExists();
  if (existingRecord) {
    console.log("DNS record already exists, updating if necessary...");
    // Compare and decide if update is needed based on `existingRecord.content` and other properties
    return;
  }

  const body = {
    type: "CNAME",
    name: recordName,
    content: previewUrl,
    ttl: 1,
    proxied: true,
  };
  const url = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records`;

  try {
    const response = await axios.post(url, body, { headers });
    console.log("DNS record created successfully:", response.data);
  } catch (error) {
    console.error(
      "Error creating DNS record:",
      error.response ? error.response.data : error.message
    );
    process.exit(1);
  }
}

async function removeDnsRecord() {
  const url = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records?name=${recordName}`;

  try {
    const getResponse = await axios.get(url, { headers });
    const recordId = getResponse.data.result[0]?.id;

    if (recordId) {
      const deleteUrl = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records/${recordId}`;
      const deleteResponse = await axios.delete(deleteUrl, { headers });
      console.log("DNS record removed successfully:", deleteResponse.data);
    } else {
      console.log("No DNS record found to delete.");
      process.exit(1);
    }
  } catch (error) {
    console.error(
      "Error fetching DNS record ID:",
      error.response ? error.response.data : error.message
    );
    process.exit(1);
  }
}

const run = async () => {
  try {
    if (process.argv[2] === "remove") {
      await removeDnsRecord();
      await removeCustomDomain();
    } else {
      await updateDnsRecord();
      await addCustomDomain();
    }
  } catch (error) {
    console.error("Unhandled error:", error);
    process.exit(1);
  }
};

run();
