// @ts-check

const config = {
    endpoint: "https://gyaan.documents.azure.com:443/",
    key: "v3hc6IMb4ugHaL5t1h7FOOMvE1aMi3KjvUsnSBqYGNGIy9zGxL4UNmGJpZCVktTa8dTqNGjbVBJ0ACDbNfXkMA==",
    databaseId: "Gyaan-Setu",
    containerId: "Items",
    partitionKey: { kind: "Hash", paths: ["/category"] }
};

module.exports = config;