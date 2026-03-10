import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip,
} from 'chart.js';
import { useTheme } from '@/context/ThemeContext';
import { CHART_DATA } from '@/utils/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const RANGES = [
  { key: 'week',  label: 'Week'  },
  { key: 'month', label: 'Month' },
  { key: 'year',  label: 'Year'  },
];

export default function AnalyticsChart() {
  const { isDark } = useTheme();
  const [range, setRange] = useState('week');

  const ds = CHART_DATA[range];

  const chartData = useMemo(() => {
    const c1 = document.createElement('canvas').getContext('2d');
    const c2 = document.createElement('canvas').getContext('2d');
    const g1 = c1?.createLinearGradient(0, 0, 0, 140);
    g1?.addColorStop(0, isDark ? 'rgba(78,124,246,.3)' : 'rgba(59,108,245,.2)');
    g1?.addColorStop(1, 'rgba(78,124,246,0)');
    const g2 = c2?.createLinearGradient(0, 0, 0, 140);
    g2?.addColorStop(0, 'rgba(248,113,113,.22)');
    g2?.addColorStop(1, 'rgba(248,113,113,0)');

    const primary = isDark ? '#4E7CF6' : '#3B6CF5';
    const ptBorder = isDark ? '#111827' : '#fff';

    return {
      labels: ds.labels,
      datasets: [
        {
          label: 'Income',
          data: ds.income,
          borderColor: primary,
          backgroundColor: g1 || 'rgba(78,124,246,.15)',
          borderWidth: 2.2,
          tension: 0.4,
          fill: true,
          pointRadius: 3.5,
          pointBackgroundColor: primary,
          pointBorderColor: ptBorder,
          pointBorderWidth: 2,
        },
        {
          label: 'Expense',
          data: ds.expense,
          borderColor: '#F87171',
          backgroundColor: g2 || 'rgba(248,113,113,.12)',
          borderWidth: 2.2,
          tension: 0.4,
          fill: true,
          pointRadius: 3.5,
          pointBackgroundColor: '#F87171',
          pointBorderColor: ptBorder,
          pointBorderWidth: 2,
        },
      ],
    };
  }, [range, isDark]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500, easing: 'easeInOutQuart' },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#192136' : '#fff',
        titleColor:      isDark ? '#E8EDF8' : '#0D1526',
        bodyColor:       isDark ? '#7A8BAD' : '#55647E',
        borderColor:     isDark ? '#1E2D45' : '#D0D9F0',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ₦${(ctx.parsed.y / 1000).toFixed(0)}k`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(30,45,69,.5)' : 'rgba(208,217,240,.5)', drawBorder: false },
        ticks: { color: isDark ? '#7A8BAD' : '#55647E', font: { family: "'Outfit',sans-serif", size: 11 } },
      },
      y: {
        grid: { color: isDark ? 'rgba(30,45,69,.5)' : 'rgba(208,217,240,.5)', drawBorder: false },
        ticks: {
          color: isDark ? '#7A8BAD' : '#55647E',
          font: { family: "'JetBrains Mono',monospace", size: 10 },
          callback: (v) => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : (v / 1000).toFixed(0) + 'k',
        },
      },
    },
  }), [isDark]);

  return (
    <div>
      {/* Range tabs */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            style={{
              padding: '5px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              border: `1px solid ${range === r.key ? 'var(--primary)' : 'var(--border)'}`,
              background: range === r.key ? 'var(--primary)' : 'transparent',
              color: range === r.key ? '#fff' : 'var(--text-s)',
              cursor: 'pointer',
              transition: 'all .18s',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: 155, position: 'relative' }}>
        <Line key={`${range}-${isDark}`} data={chartData} options={options} />
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
        {[
          { dot: 'var(--primary)', label: 'Income' },
          { dot: 'var(--red)',    label: 'Expense' },
        ].map((l) => (
          <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-s)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.dot, display: 'inline-block' }} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
