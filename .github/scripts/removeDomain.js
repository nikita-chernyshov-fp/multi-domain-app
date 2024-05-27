const { fetchResource } = require("./utils");

const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const projectName = process.env.CLOUDFLARE_PROJECT_NAME;
const prNumber = process.env.GITHUB_PR_NUMBER;
const domain = process.env.DOMAIN;
const recordName = `pr-${prNumber}.${domain}`;

const removeDomain = async () => {
  const dnsUrl = `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/dns_records`;
  const domainUrl = `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/pages/projects/${projectName}/domains`;

  // Remove DNS Record
  const dnsRecords = await fetchResource(
    `${dnsUrl}?type=CNAME&name=${recordName}`
  );
  if (dnsRecords && dnsRecords.result.length) {
    await fetchResource(`${dnsUrl}/${dnsRecords.result[0].id}`, "delete");
    console.log("DNS record removed successfully.");
  }

  // Remove Custom Domain
  await fetchResource(`${domainUrl}/${recordName}`, "delete");
  console.log("Custom domain removed successfully.");
};

removeDomain();

exports.module = {
  removeDomain,
};
