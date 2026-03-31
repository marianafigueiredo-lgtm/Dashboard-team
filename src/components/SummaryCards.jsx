import styles from './SummaryCards.module.css'

export default function SummaryCards({ belowCount, aboveCount, totalGap, avgCoverage, target, totalReps }) {
  const cards = [
    {
      label: 'Reps Below Target',
      value: belowCount,
      sub: `out of ${totalReps} reps`,
      color: 'red',
      icon: '⚠️',
    },
    {
      label: 'Reps At Target',
      value: aboveCount,
      sub: `${((aboveCount / totalReps) * 100).toFixed(0)}% coverage rate`,
      color: 'green',
      icon: '✅',
    },
    {
      label: 'Total MRR Gap',
      value: `$${Math.round(totalGap).toLocaleString()}`,
      sub: `avg $${Math.round(totalGap / belowCount).toLocaleString()} per rep below`,
      color: 'orange',
      icon: '📉',
    },
    {
      label: 'Avg Team Coverage',
      value: `${avgCoverage.toFixed(1)}%`,
      sub: `vs $${target.toLocaleString()} target`,
      color: avgCoverage >= 70 ? 'green' : avgCoverage >= 40 ? 'orange' : 'red',
      icon: '📊',
    },
  ]

  return (
    <div className={styles.grid}>
      {cards.map(card => (
        <div key={card.label} className={`${styles.card} ${styles[card.color]}`}>
          <div className={styles.cardIcon}>{card.icon}</div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>{card.value}</div>
            <div className={styles.cardLabel}>{card.label}</div>
            <div className={styles.cardSub}>{card.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
