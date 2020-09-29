import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import GetUser from "./GetUser";

export default function UserSearch() {
  const { loading, error, data } = useQuery(
    gql`
      {
        allPosts(count: 100) {
          author {
            id
          }
        }
      }
    `
    // { fetchPolicy: "cache-only" }
  );

  const [currentUser, setCurrentUser] = useState("");
  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(</p>;

  const uniqueUsers = [...new Set(data.allPosts.map((post) => post.author.id))];
  const menuItems = uniqueUsers.map((userID, index) => {
    return (
      <MenuItem key={index} value={userID}>
        User {index + 1}
      </MenuItem>
    );
  });

  function handleChange(e) {
    setCurrentUser(e.target.value);
  }
  return (
    <div>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Select User </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentUser}
          onChange={handleChange}
        >
          {menuItems}
        </Select>
      </FormControl>
      <GetUser id={currentUser} />
    </div>
  );
}
