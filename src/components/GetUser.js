import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";

const GET_USER = gql`
  query User($id: ID!) {
    User(id: $id) {
      firstName
      lastName
      email
    }
  }
`;

export default function GetUser({ id }) {
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id },
  });

  if (id === "") return <div></div>;

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(</p>;

  const { firstName, lastName, email } = data.User;

  return (
    <div>
      <h1>{firstName}</h1>
      <h2>{lastName}</h2>
    </div>
  );
}
