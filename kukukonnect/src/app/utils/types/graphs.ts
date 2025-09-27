export type ChartSectionProps = {
  title: string;
  data: any[];
  dataKey: string;
  yLabel: string;
  yDomain: [number, number];
  yTicks: number[];
  gradientId: string;
  gradientColor: string;
  chartHeight: number;
  chartBoxMinHeight: string;
  valueFormatter: (v: number) => string;
};