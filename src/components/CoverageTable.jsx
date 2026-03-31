import styles from './CoverageTable.module.css'

function SortIcon({ active, dir }) {
  return (
    <span className={styles.sortIcon}>
      {active ? (dir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  )
}

function ProgressBar({ pct, atTarget }) {
  const fill = atTarget ? '#22c55e' : pct > 60 ? '#f97316' : pct > 30 ? '#eab308' : '#ef4444'
  return (
    <div className={styles.progressTrack}>
      <div
        className={styles.progressFill}
        style={{ width: `${Math.min(pct, 100)}%`, background: fill }}
      />
    </div>
  )
}

function StatusBadge({ atTarget, pct }) {
  if (atTarget) return <span className={`${styles.badge} ${styles.badgeGreen}`}>✓ On Track</span>
  if (pct >= 75) return <span className={`${styles.badge} ${styles.badgeOrange}`}>Near</span>
  if (pct >= 40) return <span className={`${styles.badge} ${styles.badgeYellow}`}>At Risk</span>
  return <span className={`${styles.badge} ${styles.badgeRed}`}>Below</span>
}

const COLS = [
  { key: 'name', label: 'Rep Name' },
  { key: 'deal_count', label: 'Deals' },
  { key: 'total_mrr', label: 'Pipeline MRR' },
  { key: 'weighted_mrr', label: 'Weighted MRR' },
  { key: 'coverage_pct', label: 'Coverage' },
  { key: 'gap', label: 'Gap to Target' },
]

export default function CoverageTable({ reps, target, sort, onSort }) {
  if (!reps.length) {
    return <div className={styles.empty}>No reps found</div>
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>#</th>
            {COLS.map(col => (
              <th
                key={col.key}
                className={`${styles.th} ${styles.sortable}`}
                onClick={() => onSort(col.key)}
              >
                {col.label}
                <SortIcon active={sort.key === col.key} dir={sort.dir} />
              </th>
            ))}
            <th className={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {reps.map((rep, i) => (
            <tr key={rep.id} className={`${styles.row} ${rep.at_target ? styles.rowGreen : ''}`}>
              <td className={`${styles.td} ${styles.num}`}>{i + 1}</td>
              <td className={`${styles.td} ${styles.name}`}>{rep.name}</td>
              <td className={`${styles.td} ${styles.center}`}>{rep.deal_count}</td>
              <td className={styles.td}>${rep.total_mrr.toLocaleString()}</td>
              <td className={styles.td}>
                <span className={styles.weighted}>${rep.weighted_mrr.toLocaleString()}</span>
              </td>
              <td className={styles.td}>
                <div className={styles.coverageCell}>
                  <span className={styles.pct}>{rep.coverage_pct}%</span>
                  <ProgressBar pct={rep.coverage_pct} atTarget={rep.at_target} />
                </div>
              </td>
              <td className={styles.td}>
                {rep.gap > 0 ? (
                  <span className={styles.gap}>
                    -${rep.gap.toLocaleString()}
                  </span>
                ) : (
                  <span className={styles.surplus}>+${(rep.weighted_mrr - target).toLocaleString()}</span>
                )}
              </td>
              <td className={styles.td}>
                <StatusBadge atTarget={rep.at_target} pct={rep.coverage_pct} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
