export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartConfig {
  width: number;
  height: number;
  padding: number;
  colors: string[];
}

export class ChartHelper {
  static generatePieChart(data: ChartDataPoint[], config: ChartConfig) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let currentAngle = -Math.PI / 2;

    return data.map((point, index) => {
      const percentage = (point.value / total) * 100;
      const sliceAngle = (point.value / total) * 2 * Math.PI;
      const color = point.color || config.colors[index % config.colors.length];

      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      currentAngle = endAngle;

      return {
        ...point,
        percentage,
        startAngle,
        endAngle,
        color,
      };
    });
  }

  static generateBarChart(data: ChartDataPoint[], config: ChartConfig) {
    const maxValue = Math.max(...data.map((d) => d.value));
    const barWidth = (config.width - config.padding * 2) / data.length;

    return data.map((point, index) => {
      const height = (point.value / maxValue) * (config.height - config.padding * 2);
      const x = config.padding + index * barWidth;
      const y = config.height - config.padding - height;
      const color = point.color || config.colors[index % config.colors.length];

      return {
        ...point,
        x,
        y,
        width: barWidth * 0.8,
        height,
        color,
      };
    });
  }

  static generateLineChart(data: ChartDataPoint[], config: ChartConfig) {
    const maxValue = Math.max(...data.map((d) => d.value));
    const stepX = (config.width - config.padding * 2) / (data.length - 1);

    return data.map((point, index) => {
      const x = config.padding + index * stepX;
      const y =
        config.height -
        config.padding -
        (point.value / maxValue) * (config.height - config.padding * 2);

      return {
        ...point,
        x,
        y,
      };
    });
  }

  static interpolatePath(points: Array<{ x: number; y: number }>): string {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;

      path += ` Q ${cpx} ${prev.y}, ${cpx} ${(prev.y + curr.y) / 2}`;
      path += ` Q ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return path;
  }
}
