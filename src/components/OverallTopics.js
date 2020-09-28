import React from "react";
import { useQuery, gql } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import { Bar } from "@vx/shape";
import { Group } from "@vx/group";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { scaleBand, scaleLinear } from "@vx/scale";
import { Grid } from "@vx/grid";
import { useTooltip, useTooltipInPortal } from "@vx/tooltip";
import { localPoint } from "@vx/event";

const width = 600;
const height = 400;
const margin = 60;

const x = (d) => d.label;
const y = (d) => d.count;

export default function OverallTopics() {
  const { loading, error, data } = useQuery(gql`
    {
      allPosts(count: 2000) {
        likelyTopics {
          label
          likelihood
        }
      }
    }
  `);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });

  if (loading) return <CircularProgress />;
  if (error) return <p>Error :(</p>;

  const highestLikelyhoodTopics = data.allPosts.map((post) => {
    let highestTopic = { label: "placeholder", likelihood: 0 };
    post.likelyTopics.forEach((topic) => {
      if (topic.likelihood > highestTopic.likelihood) {
        highestTopic.label = topic.label;
        highestTopic.likelihood = topic.likelihood;
      }
    });
    return highestTopic;
  });

  const uniqueTopics = [
    ...new Set(highestLikelyhoodTopics.map((topic) => topic.label)),
  ];

  function average(nums) {
    return nums.reduce((a, b) => a + b) / nums.length;
  }
  const highestFrequencyTopics = [];
  uniqueTopics.forEach((topic) => {
    let count = 0;
    let likelihoodAggregate = [];
    for (let entry of highestLikelyhoodTopics) {
      if (topic === entry.label) {
        count++;
        likelihoodAggregate.push(entry.likelihood);
      }
    }
    highestFrequencyTopics.push({
      label: topic,
      count: count,
      averageLiklihood: average(likelihoodAggregate),
    });
  });

  const xMax = width - margin;
  const yMax = height - margin;

  const xScale = scaleBand({
    domain: [...uniqueTopics], // x-coordinate data values
    range: [0, xMax], // svg x-coordinates, svg x-coordinates increase left to right
  });
  const yScale = scaleLinear({
    domain: [
      0,
      Math.max.apply(
        Math,
        highestFrequencyTopics.map(function (o) {
          return o.count;
        })
      ),
    ],
    range: [yMax, 0],
  });

  const barWidth = xScale.bandwidth() / 2;

  function precise(x) {
    return Number.parseFloat(x).toPrecision(4);
  }

  const handleMouseOver = (datum, event) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: "AVG Likelihood: " + precise(datum.averageLiklihood),
    });
  };

  return (
    <div className="flex flex-col relative">
      <svg width={width} height={height} className="m-auto" ref={containerRef}>
        <rect
          y={10}
          x={margin}
          opacity={0.4}
          fill="#bfd8ff"
          height={yMax}
          width={xMax}
        ></rect>

        <Grid
          top={10}
          left={margin}
          xScale={xScale}
          yScale={yScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.4}
        />
        <Group top={10} left={margin} width={xMax} height={yMax}>
          <AxisLeft scale={yScale} numTicks={10} label="Count" />
          {highestFrequencyTopics.map((d, i) => {
            const height =
              (yMax * d.count) /
              Math.max.apply(
                Math,
                highestFrequencyTopics.map(function (o) {
                  return o.count;
                })
              );
            const barX = xScale(d.label) + barWidth / 2;
            return (
              <>
                <Bar
                  key={i}
                  height={height}
                  width={barWidth}
                  y={0 + (yMax - height)}
                  x={barX}
                  stroke="#fff"
                  strokeWidth={2}
                  fill="#4287f5"
                  onMouseOver={(e) => handleMouseOver(d, e)}
                  onMouseOut={hideTooltip}
                />
              </>
            );
          })}

          <AxisBottom
            scale={xScale}
            label="Topic"
            numTicks={highestFrequencyTopics.length - 2}
            top={yMax}
          />
        </Group>
        {tooltipOpen && (
          <TooltipInPortal
            // set this to random so it correctly updates with parent bounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
          >
            {tooltipData}
          </TooltipInPortal>
        )}
      </svg>
      <p className="text-xs" style={{ maxHeight: "20px" }}></p>
    </div>
  );
}
