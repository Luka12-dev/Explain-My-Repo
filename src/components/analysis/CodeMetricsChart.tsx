import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { CodeAnalysis } from '@/types';

interface CodeMetricsChartProps {
  codeAnalysis: CodeAnalysis;
}

const CodeMetricsChart: React.FC<CodeMetricsChartProps> = ({ codeAnalysis }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const data = [
      { label: 'Code', value: codeAnalysis.codeLines, color: '#1a80ff' },
      { label: 'Comments', value: codeAnalysis.commentLines, color: '#4ade80' },
      { label: 'Blank', value: codeAnalysis.blankLines, color: '#94a3b8' },
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    let currentAngle = -Math.PI / 2;

    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, labelX, labelY);

      const percentage = ((item.value / total) * 100).toFixed(1);
      ctx.font = '12px Arial';
      ctx.fillText(`${percentage}%`, labelX, labelY + 18);

      currentAngle += sliceAngle;
    });
  }, [codeAnalysis]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Code Distribution
      </h3>
      <div className="flex flex-col items-center">
        <canvas ref={canvasRef} width={300} height={300} />
        <div className="mt-6 grid grid-cols-3 gap-4 w-full">
          <div className="text-center">
            <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-1"></div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {codeAnalysis.codeLines.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Code Lines</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-green-400 rounded mx-auto mb-1"></div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {codeAnalysis.commentLines.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Comments</div>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-gray-400 rounded mx-auto mb-1"></div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {codeAnalysis.blankLines.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Blank Lines</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CodeMetricsChart;
