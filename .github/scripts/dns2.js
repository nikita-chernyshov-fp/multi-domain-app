const axios = require("axios");

// Configurations from environment variables
const config = {
  cloudflareZoneId: process.env.CLOUDFLARE_ZONE_ID,
  cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN,
  cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
  projectName: process.env.CLOUDFLARE_PROJECT_NAME,
  prNumber: process.env.GITHUB_PR_NUMBER,
  branchName: process.env.BRANCH_NAME,
  domain: process.env.DOMAIN,
  normalizedBranchName: process.env.BRANCH_NAME.replace(/\//g, "-")
    .replace(/_/g, "-")
    .toLowerCase(),
  headers: {
    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
    "Content-Type": "application/json",
  },
};

const previewUrl = `${config.normalizedBranchName}.${config.projectName}.pages.dev`;
const recordName = `pr-${config.prNumber}.${config.domain}`;

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

const manageDnsRecord = async (action = "add") => {
  const url = `https://api.cloudflare.com/client/v4/zones/${config.cloudflareZoneId}/dns_records`;

  const record = await fetchResource(`${url}?type=CNAME&name=${recordName}`);

  if (record && action === "add" && record.result.length) {
    console.log("DNS record already exists, no action taken.");
    return;
  }

  if (action === "remove" && record && record.result.length) {
    const recordId = record.result[0].id;

    await fetchResource(`${url}/${recordId}`, "delete");
    console.log("DNS record removed successfully.");

    return;
  }

  if (action === "add") {
    const body = {
      type: "CNAME",
      name: recordName,
      content: previewUrl,
      ttl: 1,
      proxied: true,
    };
    await fetchResource(url, "post", body);
    console.log("DNS record created or updated successfully.");
  }
};

const manageCustomDomain = async (action = "add") => {
  const url = `https://api.cloudflare.com/client/v4/accounts/${config.cloudflareAccountId}/pages/projects/${config.projectName}/domains`;
  const currentDomains = await fetchResource(url);

  if (
    currentDomains &&
    currentDomains.result.some((domain) => domain.name === recordName) &&
    action === "add"
  ) {
    console.log("Custom domain already exists, no action taken.");
    return;
  }

  if (action === "remove") {
    await fetchResource(`${url}/${recordName}`, "delete");
    console.log("Custom domain removed successfully.");
  }

  if (action === "add") {
    await fetchResource(url, "post", { name: recordName });
    console.log("Custom domain added successfully.");
  }
};

const run = async () => {
  const action = process.env.GITHUB_ACTION === "closed" ? "remove" : "add";
  await manageDnsRecord(action);
  await manageCustomDomain(action);
};

run();
