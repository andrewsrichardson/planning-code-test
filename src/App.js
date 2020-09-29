import React, { useState } from "react";
import "./App.css";
import { ApolloProvider, gql, useQuery } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import OverallTopics from "./components/OverallTopics";
import UserSearch from "./components/UserSearch";
import PostsByMonth from "./components/PostsByMonth";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const client = new ApolloClient({
  uri: "https://fakerql.nplan.io/graphql",
  cache: new InMemoryCache(),
});

function App() {
  const [postCount, setPostCount] = useState(2000);

  function handleChange(e) {
    setPostCount(e.target.value);
  }

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Blog Topic Analysis Dashboard</h1>
        <h2>Total Posts Analysed: {postCount}</h2>
        <FormControl>
          <InputLabel id="demo-simple-select-label">
            Posts to Analyse
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={postCount}
            onChange={handleChange}
          >
            <MenuItem key={0} value={2000}>
              2000
            </MenuItem>{" "}
            <MenuItem key={1} value={5000}>
              5000
            </MenuItem>{" "}
            <MenuItem key={2} value={10000}>
              10000
            </MenuItem>
          </Select>
        </FormControl>
        <div className="top-container">
          <OverallTopics count={postCount} />
          <PostsByMonth count={postCount} />
        </div>
        <UserSearch />
      </div>
    </ApolloProvider>
  );
}

export default App;
