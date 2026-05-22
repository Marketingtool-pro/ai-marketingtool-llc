import { useEffect, useRef, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import * as d3 from 'd3';
import { feature } from 'topojson-client';

// @project
import MainCard from '@/components/MainCard';

const width = 250;
const height = 138;

/***************************  MAP CHART - DATA  ***************************/

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// Mock data for orders by state (this can be replaced with actual data)
const ordersData = {
  '01': { name: 'Alabama', orders: 1200 },
  '02': { name: 'Alaska', orders: 800 },
  '04': { name: 'Arizona', orders: 432 },
  '05': { name: 'Arkansas', orders: 1087 },
  '06': { name: 'California', orders: 600 },
  '08': { name: 'Colorado', orders: 852 },
  '09': { name: 'Connecticut', orders: 455 },
  17: { name: 'Illinois', orders: 5000 }
};

/***************************  CHART - MAP  ***************************/

export default function SaleMappingChart() {
  const theme = useTheme();

  const svgRef = useRef(null);
  const [geoData, setGeoData] = useState(null);

  const mapColors = {
    veryHigh: theme.vars.palette.secondary.light,
    high: theme.vars.palette.secondary.lighter,
    average: theme.vars.palette.grey[200]
  };

  const lists = [
    { title: 'Very high level of orders', color: mapColors.veryHigh },
    { title: 'High level of orders', color: mapColors.high },
    { title: 'Average level of orders', color: mapColors.average }
  ];

  // Function to determine the color based on the number of orders
  const getColorByOrders = (orders) => (orders > 1000 ? mapColors.veryHigh : orders > 500 ? mapColors.high : mapColors.average);

  useEffect(() => {
    const loadGeoData = async () => {
      const res = await fetch(geoUrl);
      const topoData = await res.json();
      const statesGeo = feature(topoData, topoData.objects.states);
      setGeoData(statesGeo);
    };

    loadGeoData();
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const projection = d3.geoAlbersUsa().fitSize([width, height], geoData);
    const pathGenerator = d3.geoPath().projection(projection);

    svg
      .selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', (d) => pathGenerator(d))
      .attr('fill', (d) => {
        const fips = d.id;
        const stateData = ordersData[fips];
        const orders = stateData?.orders || 0;
        return getColorByOrders(orders);
      })
      .attr('stroke', theme.vars.palette.background.default)
      .attr('stroke-width', 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoData, theme]);

  return (
    <MainCard>
      <Stack sx={{ gap: 2.5 }}>
        <Typography variant="h4">Sale Mapping by Country</Typography>
        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Stack sx={{ gap: 1.5, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            {lists.map((list) => (
              <Stack direction="row" key={list.title} sx={{ alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 15, height: 15, minWidth: 15, borderRadius: '50%', backgroundColor: list.color }} />
                <Typography variant="caption">{list.title}</Typography>
              </Stack>
            ))}
          </Stack>
          <Box sx={{ width, height, minWidth: width }}>
            <svg ref={svgRef} width="100%" height="100%" />
          </Box>
        </Stack>
      </Stack>
    </MainCard>
  );
}
