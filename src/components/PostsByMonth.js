import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { Group } from "@vx/group";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { scaleBand, scaleLinear } from "@vx/scale";
import { LinePath } from "@vx/shape";
import { GridColumns } from "@vx/grid";
import { localPoint } from "@vx/event";
import { useTooltip, useTooltipInPortal } from "@vx/tooltip";
import { curveBasis } from "@vx/curve";
import dayjs from "dayjs";

//dimensions for graph
const width = 600;
const height = 400;
const margin = 60;
const monthsQuery = gql`
  query getMonths($count: Int!) {
    allPosts(count: $count) {
      createdAt
    }
  }
`;
//string versions of months
const monthStrings = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
//data accessors
const x = (d) => d.month;
const y = (d) => d.count;

export default function OverallTopics({ count }) {
  const [monthData, setMonthData] = useState(null);
  const { loading, error, data } = useQuery(monthsQuery, {
    variables: {
      count,
    },
    fetchPolicy: "no-cache",
  });

  //tooltip setup
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();
  //tooltip in portal as we are client side rendering
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });

  //set the return data into state
  if (data && data !== monthData) {
    setMonthData(data);
    //return progress bar for this re-render
    return <CircularProgress />;
  }

  if (loading) return <CircularProgress />;
  if (error) return <p>Error</p>;

  //lazy create months loop
  let months = [];
  for (let index = 0; index < 12; index++) {
    months.push({ month: index, count: 0 });
  }

  monthData.allPosts.forEach((post) => {
    //parse the date and return the month from day js, increment count for each post found
    const month = parseInt(dayjs(post.createdAt).format("M") - 1);
    months[month].count = months[month].count + 1;
  });

  //remap the labels to strings ready for graph
  months.forEach((month, index) => {
    month.month = monthStrings[index];
  });

  //inner width of graph
  const xMax = width - margin;
  const yMax = height - margin;

  //scales for chart
  const xScale = scaleBand({
    domain: [...monthStrings], // x-coordinate data values
    range: [0, xMax], // svg x-coordinates, svg x-coordinates increase left to right
  });
  const yScale = scaleLinear({
    domain: [
      0,
      //find max of 1.5x count of y vals
      Math.max.apply(
        Math,
        months.map(function (o) {
          return 1.5 * o.count;
        })
      ),
    ],
    range: [yMax, 0],
  });

  //mouse over for tooltip
  const handleMouseOver = (datum, event) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum.count,
    });
  };

  return (
    <div className="graph-container">
      <h3>
        Total Number of posts per month
        <span style={{ fontWeight: "100", fontSize: "9px" }}>
          {" "}
          (Year not accounted for)
        </span>
      </h3>

      <svg width={width} height={height} ref={containerRef}>
        <Group top={10} left={60}>
          <rect width={xMax} height={yMax} fill="#bfd8ff" />
          <AxisLeft scale={yScale} numTicks={8} hideAxisLine label="Count" />
          <AxisBottom
            scale={xScale}
            label="Month"
            numTicks={12}
            top={yMax}
            tickLabelProps={() => ({
              fill: "#292929",
              fontSize: 11,
              textAnchor: "middle",
            })}
          />
          <GridColumns
            scale={xScale}
            height={yMax}
            numTicks={12}
            stroke="#222222"
            fill="#222222"
            strokeDasharray="4,4"
            strokeOpacity="0.4"
            left={xScale.bandwidth() / 2}
          />
          <LinePath
            data={months}
            curve={curveBasis}
            x={(d) => xScale(x(d)) + xScale.bandwidth() / 2}
            y={(d) => yScale(y(d))}
            stroke="#222"
            strokeWidth={1.5}
            strokeOpacity={0.8}
            strokeDasharray="1,2"
          />
          {months.map((d, pointIndex) => (
            <circle
              key={d.label + " " + pointIndex}
              r={5}
              cx={xScale(x(d)) + xScale.bandwidth() / 2}
              cy={yScale(y(d))}
              stroke="#222222"
              fill="#D81E5B"
              onMouseOver={(e) => handleMouseOver(d, e)}
              onMouseOut={hideTooltip}
            />
          ))}
        </Group>
        {tooltipOpen && (
          <TooltipInPortal
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
          >
            {tooltipData}
          </TooltipInPortal>
        )}
      </svg>
    </div>
  );
}
