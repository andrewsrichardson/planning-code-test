import React from "react";
import "./App.css";
import { ApolloProvider, gql } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import OverallTopics from "./components/OverallTopics";

const client = new ApolloClient({
  uri: "https://fakerql.nplan.io/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Blog Topic Analysis Dashboard</h1>
        <h2>Total Posts Analysed: {}</h2>
        <OverallTopics />
      </div>
    </ApolloProvider>
  );
}

export default App;
