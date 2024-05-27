const { fetchResource } = require("./utils");

const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const projectName = process.env.CLOUDFLARE_PROJECT_NAME;
const prNumber = process.env.GITHUB_PR_NUMBER;
const domain = process.env.DOMAIN;
const normalizedBranchName = process.env.BRANCH_NAME.replace(/\//g, "-")
  .replace(/_/g, "-")
  .toLowerCase();

const previewUrl = `${normalizedBranchName}.${projectName}.pages.dev`;
const recordName = `pr-${prNumber}.${domain}`;

const addDomain = async () => {
  const dnsUrl = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records`;
  const domainUrl = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/pages/projects/${projectName}/domains`;

  // Add DNS Record
  const dnsBody = {
    type: "CNAME",
    name: recordName,
    content: previewUrl,
    ttl: 1,
    proxied: true,
  };
  await fetchResource(dnsUrl, "post", dnsBody);
  console.log("DNS record created successfully.");

  // Add Custom Domain
  await fetchResource(domainUrl, "post", { name: recordName });
  console.log("Custom domain added successfully.");
};

addDomain();

exports.module = {
  addDomain,
};
