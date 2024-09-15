// src/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GQL_API_URL, // Your GraphQL endpoint URL from environment variables
  }),
  cache: new InMemoryCache(),
});

export default client;
