import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Cell
} from 'recharts'
import styles from './CoverageChart.module.css'

const CustomTooltip = ({ active, payload, label, target }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipName}>{d.name}</div>
      <div className={styles.tooltipRow}>
        <span>Weighted MRR</span>
        <strong>${d.weighted_mrr.toLocaleString()}</strong>
      </div>
      <div className={styles.tooltipRow}>
        <span>Pipeline MRR</span>
        <strong>${d.total_mrr.toLocaleString()}</strong>
      </div>
      <div className={styles.tooltipRow}>
        <span>Coverage</span>
        <strong style={{ color: d.gap === 0 ? '#22c55e' : '#ef4444' }}>{d.coverage_pct}%</strong>
      </div>
      {d.gap > 0 && (
        <div className={styles.tooltipGap}>
          Gap: ${d.gap.toLocaleString()} missing
        </div>
      )}
    </div>
  )
}

export default function CoverageChart({ reps, target }) {
  const data = [...reps]
    .sort((a, b) => b.weighted_mrr - a.weighted_mrr)
    .slice(0, 30)
    .map(r => ({
      ...r,
      shortName: r.name.split(' ').slice(0, 2).join(' '),
    }))

  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>Weighted Pipeline MRR by Rep</h2>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.dotGreen} /> At/Above target
          </span>
          <span className={styles.legendItem}>
            <span className={styles.dotRed} /> Below target
          </span>
          <span className={styles.legendItem}>
            <span className={styles.lineTarget} /> $17k target
          </span>
        </div>
      </div>
      <p className={styles.sub}>Top 30 reps by weighted pipeline · Stage probability × MRR</p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 80 }} barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2535" vertical={false} />
          <XAxis
            dataKey="shortName"
            tick={{ fill: '#64748b', fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            interval={0}
            tickLine={false}
            axisLine={{ stroke: '#1e2535' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip target={target} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine
            y={target}
            stroke="#f97316"
            strokeDasharray="6 3"
            strokeWidth={1.5}
            label={{ value: '$17k', fill: '#f97316', fontSize: 11, position: 'insideTopRight' }}
          />
          <Bar dataKey="weighted_mrr" radius={[4, 4, 0, 0]}>
            {data.map(d => (
              <Cell
                key={d.id}
                fill={d.gap === 0 ? '#22c55e' : '#6366f1'}
                opacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
