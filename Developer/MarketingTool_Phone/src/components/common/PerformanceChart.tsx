import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Canvas, Path, Skia, LinearGradient, vec, Group, Rect, Text as SkiaText, useFont } from '@shopify/react-native-skia';
import { Colors, Spacing } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 180;
const CHART_WIDTH = width - Spacing.lg * 2;
const PADDING = 20;

interface DataPoint {
  date: string;
  value: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
  title?: string;
}

const PerformanceChart = ({ data, title = 'Activity Trend' }: PerformanceChartProps) => {
  if (!data || data.length < 2) return null;

  const max = useMemo(() => Math.max(...data.map(d => d.value), 10), [data]);
  const min = useMemo(() => Math.min(...data.map(d => d.value), 0), [data]);

  const points = useMemo(() => {
    const xStep = (CHART_WIDTH - PADDING * 2) / (data.length - 1);
    const yScale = (CHART_HEIGHT - PADDING * 2) / (max - min || 1);

    return data.map((d, i) => ({
      x: PADDING + i * xStep,
      y: CHART_HEIGHT - PADDING - (d.value - min) * yScale,
    }));
  }, [data, max, min]);

  const linePath = useMemo(() => {
    const path = Skia.Path.Make();
    if (points.length === 0) return path;

    path.moveTo(points[0].x, points[0].y);
    
    // Create smooth curve using cubic bezier
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp1y = p0.y;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      const cp2y = p1.y;
      path.cubicTo(cp1x, cp1y, cp2x, cp2y, p1.x, p1.y);
    }
    return path;
  }, [points]);

  const areaPath = useMemo(() => {
    const path = linePath.copy();
    path.lineTo(points[points.length - 1].x, CHART_HEIGHT);
    path.lineTo(points[0].x, CHART_HEIGHT);
    path.close();
    return path;
  }, [linePath, points]);

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Canvas style={{ height: CHART_HEIGHT, width: CHART_WIDTH }}>
          {/* Grid Lines */}
          <Group opacity={0.1}>
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <Rect
                key={p}
                x={PADDING}
                y={PADDING + (CHART_HEIGHT - PADDING * 2) * p}
                width={CHART_WIDTH - PADDING * 2}
                height={1}
                color={Colors.white}
              />
            ))}
          </Group>

          {/* Area under the line */}
          <Path path={areaPath} opacity={0.2}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, CHART_HEIGHT)}
              colors={[Colors.secondary, 'transparent']}
            />
          </Path>

          {/* The line itself */}
          <Path
            path={linePath}
            style="stroke"
            strokeWidth={3}
            strokeCap="round"
            strokeJoin="round"
            color={Colors.secondary}
          />

          {/* Points */}
          {points.map((p, i) => (
            <Group key={i}>
              <Rect
                x={p.x - 4}
                y={p.y - 4}
                width={8}
                height={8}
                color={Colors.white}
              />
            </Group>
          ))}
        </Canvas>
      </View>
      
      <View style={styles.footer}>
        {data.map((d, i) => (
          <Text key={i} style={styles.dateText}>
            {d.date.split('-')[2]}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(22, 24, 36, 0.55)',
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chartWrapper: {
    height: CHART_HEIGHT,
    width: CHART_WIDTH - Spacing.md * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING,
    marginTop: Spacing.sm,
  },
  dateText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
});

export default PerformanceChart;
