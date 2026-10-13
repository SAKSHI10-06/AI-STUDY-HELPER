import React, { useEffect, useRef } from 'react';
// Crucial Fix: Import specific ESM build to prevent "tty/os" build errors in Vite
import mermaid from 'mermaid/dist/mermaid.esm.min.mjs';

const MermaidChart = ({ chartDefinition }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartDefinition) return;

    // Initialize mermaid settings
    mermaid.initialize({ 
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#e0e7ff', // Indigo-100
        primaryTextColor: '#3730a3', // Indigo-800
        primaryBorderColor: '#6366f1', // Indigo-500
        lineColor: '#6366f1',
        secondaryColor: '#ffedd5',
        tertiaryColor: '#fff',
      },
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      if (chartRef.current) {
        try {
          chartRef.current.innerHTML = ''; // Clear previous
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chartDefinition);
          chartRef.current.innerHTML = svg;
        } catch (error) {
          console.error("Mermaid Render Error:", error);
          chartRef.current.innerHTML = '<p class="text-red-400 text-sm">Unable to render chart. Data might be complex.</p>';
        }
      }
    };

    renderChart();
  }, [chartDefinition]);

  return (
    <div className="w-full overflow-x-auto flex justify-center p-6 bg-white rounded-xl">
      <div ref={chartRef} className="mermaid-graph" />
    </div>
  );
};

export default MermaidChart;