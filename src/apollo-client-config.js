import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getAuth } from "firebase/auth";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GQL_API_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      const token = await user.getIdToken();

      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
  }

  // Return the headers without an authorization token if there's no user
  return { headers };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
