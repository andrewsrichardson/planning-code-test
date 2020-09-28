import React from "react";
import { useQuery, gql } from "@apollo/client";
import { CircularProgress } from "material-ui";
import { Bar } from "@vx/shape";
import { Group } from "@vx/group";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@vx/scale";
import { Grid } from "@vx/grid";

export default function TopicByMonth() {
  const { loading, error, data } = useQuery(gql`
    {
      allPosts(count: 2000) {
        createdAt
        likelyTopics {
          label
          likelihood
        }
      }
    }
  `);

  if (loading) return <p>Loading..</p>;
  if (error) return <p>Error :(</p>;

  return <div></div>;
}
