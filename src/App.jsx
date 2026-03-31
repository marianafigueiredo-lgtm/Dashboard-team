import { useState, useMemo } from 'react'
import coverageData from './data/coverage.json'
import SummaryCards from './components/SummaryCards.jsx'
import CoverageTable from './components/CoverageTable.jsx'
import CoverageChart from './components/CoverageChart.jsx'
import styles from './App.module.css'

export default function App() {
  const [view, setView] = useState('below') // 'below' | 'all'
  const [sort, setSort] = useState({ key: 'coverage_pct', dir: 'asc' })
  const [search, setSearch] = useState('')

  const { target, month, reps, total_deals } = coverageData

  const filtered = useMemo(() => {
    let data = view === 'below' ? reps.filter(r => r.gap > 0) : reps
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(r => r.name.toLowerCase().includes(q))
    }
    return [...data].sort((a, b) => {
      const v = sort.dir === 'asc' ? 1 : -1
      if (typeof a[sort.key] === 'string') return v * a[sort.key].localeCompare(b[sort.key])
      return v * (a[sort.key] - b[sort.key])
    })
  }, [reps, view, sort, search])

  const belowCount = reps.filter(r => r.gap > 0).length
  const aboveCount = reps.filter(r => r.gap === 0).length
  const totalGap = reps.reduce((sum, r) => sum + r.gap, 0)
  const avgCoverage = reps.reduce((sum, r) => sum + r.coverage_pct, 0) / reps.length

  function handleSort(key) {
    setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }))
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>RP</div>
            <div>
              <h1 className={styles.title}>Coverage Gap Dashboard</h1>
              <p className={styles.subtitle}>{month} · Target: ${target.toLocaleString()} MRR per rep · {total_deals} deals tracked</p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.badge}>Live Data</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <SummaryCards
          belowCount={belowCount}
          aboveCount={aboveCount}
          totalGap={totalGap}
          avgCoverage={avgCoverage}
          target={target}
          totalReps={reps.length}
        />

        <div className={styles.chartSection}>
          <CoverageChart reps={reps} target={target} />
        </div>

        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${view === 'below' ? styles.tabActive : ''}`}
                onClick={() => setView('below')}
              >
                Below Target
                <span className={`${styles.tabBadge} ${view === 'below' ? styles.tabBadgeActive : ''}`}>
                  {belowCount}
                </span>
              </button>
              <button
                className={`${styles.tab} ${view === 'all' ? styles.tabActive : ''}`}
                onClick={() => setView('all')}
              >
                All Reps
                <span className={`${styles.tabBadge} ${view === 'all' ? styles.tabBadgeActive : ''}`}>
                  {reps.length}
                </span>
              </button>
            </div>
            <input
              className={styles.search}
              type="text"
              placeholder="Search rep..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <CoverageTable
            reps={filtered}
            target={target}
            sort={sort}
            onSort={handleSort}
          />
        </div>
      </main>
    </div>
  )
}
