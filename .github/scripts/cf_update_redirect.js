const axios = require("axios");
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const zoneId = process.env.CLOUDFLARE_ZONE_ID;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const prNumber = process.env.GITHUB_PR_NUMBER;

const apiUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/pagerules`;
const listName = "my_redirect_list";

const headers = {
  Authorization: `Bearer ${apiToken}`,
  "Content-Type": "application/json",
};

async function getListIdByName(listName) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/rules/lists`;
  try {
    const response = await axios.get(url, { headers });
    const lists = response.data.result;
    const foundList = lists.find((list) => list.name === listName);
    return foundList ? foundList.id : null; // Returns null if no list is found
  } catch (error) {
    console.error(
      "Failed to retrieve lists:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

async function createRedirectList() {
  let listId = await getListIdByName(listName);

  if (listId) {
    console.log(`List named '${listName}' already exists with ID: ${listId}`);
    return listId; // Use the existing list ID
  }

  // Proceed to create a new list
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/rules/lists`;
  const data = {
    name: listName,
    description: "My redirect list for PR redirects",
    kind: "redirect",
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("Redirect List Created:", response.data);
    return response.data.result.id; // Return the list ID for subsequent use
  } catch (error) {
    console.error(
      "Failed to create redirect list:",
      error.response ? error.response.data : error.message
    );
  }
}

async function addItemsToList(listId) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/rules/lists/${listId}/items`;

  const items = [
    {
      redirect: {
        source_url: `http://pr-${prNumber}.litl.chat/`,
        target_url: `https://deploy-preview-${prNumber}--fp-test-nikita.netlify.app`,
        status_code: 307,
      },
    },
    // Add more redirects as needed
  ];

  try {
    const response = await axios.post(url, items, { headers });
    console.log("Items added to Redirect List:", response.data);
  } catch (error) {
    console.error(
      "Failed to add items to list:",
      error.response ? error.response.data : error.message
    );
  }
}

async function createBulkRedirectRule() {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/rulesets`;
  const data = {
    name: "My redirect ruleset",
    kind: "root",
    phase: "http_request_redirect",
    rules: [
      {
        expression: "http.request.full_uri in $my_redirect_list",
        description: "Bulk Redirect rule",
        action: "redirect",
        action_parameters: {
          from_list: {
            name: listName,
            key: "http.request.full_uri",
          },
        },
      },
    ],
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("Bulk Redirect Rule Created:", response.data);
  } catch (error) {
    console.error(
      "Failed to create bulk redirect rule:",
      error.response ? error.response.data : error.message
    );
  }
}

async function setupBulkRedirection() {
  const listId = await createRedirectList(); // Create list and get ID
  if (listId) {
    await addItemsToList(listId); // Add items to list
    await createBulkRedirectRule(); // Create rule using the list
  }
}

// setupBulkRedirection();
console.log("script ...");
