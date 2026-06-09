import { useState } from 'react'
import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGithub } from '@/hooks/useGithub'
import type { ContributionDay } from '@/hooks/useGithub'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/shared/ThemeContext'
import { portfolioData } from '@/data/portfolioData'

// Container animation variants for staggered reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function ActivityAndTestimonialsSection() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || 'en'
  const isRtl = currentLang === 'ar'
  
  // Fetch from useGithub hook (using username ibrahimfares511)
  const { data, loading, error } = useGithub('ibrahimfares511')
  
  // Filter list of years from contributions
  const yearsList = Array.from(
    new Set(data.contributions.map((d) => new Date(d.date).getFullYear()))
  ).sort((a, b) => b - a)

  const yearOptions = yearsList

  // Year selector state (defaults to empty string, resolved dynamically to latest active year)
  const [selectedYear, setSelectedYear] = useState<string | number>('')

  const activeYear = selectedYear || yearsList[0] || new Date().getFullYear()

  const intensityColors = isDark
    ? [
        'bg-white/[0.03] border border-white/[0.02]',
        'bg-indigo-500/20 border border-indigo-500/10',
        'bg-indigo-500/45 border border-indigo-500/20',
        'bg-indigo-500/70 border border-indigo-500/30',
        'bg-accent border border-accent/40 shadow-[0_0_10px_rgba(129,140,248,0.4)]',
      ]
    : [
        'bg-slate-100 border border-slate-200/50',
        'bg-violet-100 border border-violet-200/40',
        'bg-violet-300 border border-violet-300/40',
        'bg-violet-500 border border-violet-500/30',
        'bg-violet-700 border border-violet-700/30 shadow-[0_2px_8px_rgba(109,40,217,0.2)]',
      ]

  // Filter and pad contributions for selected year option
  const getDisplayDays = (yearOption: string | number, allDays: ContributionDay[]) => {
    // Specific calendar year filtering (January 1 to December 31)
    const targetYear = typeof yearOption === 'string' ? parseInt(yearOption, 10) : yearOption
    const yearDays = allDays.filter((d) => {
      const date = new Date(d.date)
      return date.getFullYear() === targetYear
    })

    if (yearDays.length === 0) return []

    // Sort ascending
    yearDays.sort((a, b) => a.date.localeCompare(b.date))

    // Pad start: align first day to its Sunday-relative weekday index
    const firstDate = new Date(yearDays[0].date)
    const startDayOfWeek = firstDate.getDay() // 0 = Sunday
    const startPadding: ContributionDay[] = []
    for (let i = startDayOfWeek; i > 0; i--) {
      const d = new Date(firstDate)
      d.setDate(d.getDate() - i)
      startPadding.push({
        date: d.toISOString().split('T')[0],
        count: 0,
        level: 0,
      })
    }

    // Pad end: align last day to the end of the week (Saturday, index 6)
    const lastDate = new Date(yearDays[yearDays.length - 1].date)
    const endDayOfWeek = lastDate.getDay() // 6 = Saturday
    const endPadding: ContributionDay[] = []
    for (let i = 1; i <= (6 - endDayOfWeek); i++) {
      const d = new Date(lastDate)
      d.setDate(d.getDate() + i)
      endPadding.push({
        date: d.toISOString().split('T')[0],
        count: 0,
        level: 0,
      })
    }

    return [...startPadding, ...yearDays, ...endPadding]
  }

  // Filtered days grid
  const activeDays = getDisplayDays(activeYear, data.contributions)

  // Group days into columns (weeks of 7 days)
  const buildHeatmapGrid = (days: ContributionDay[]) => {
    const weeks: ContributionDay[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }
    return weeks
  }

  const weeksGrid = buildHeatmapGrid(activeDays)

  // Helper to extract month names transitions above columns
  const getMonthLabels = (weeks: ContributionDay[][]) => {
    const labels: { index: number; label: string }[] = []
    let lastMonth = ''

    weeks.forEach((week, index) => {
      const firstDay = week[0]
      if (!firstDay) return
      const d = new Date(firstDay.date)
      const monthName = d.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', { month: 'short' })

      if (monthName !== lastMonth) {
        labels.push({ index, label: monthName })
        lastMonth = monthName
      }
    })

    return labels
  }

  const monthLabels = getMonthLabels(weeksGrid)

  // Calculate year contributions dynamically
  const getSelectedYearTotalContributions = () => {
    const targetYear = typeof activeYear === 'string' ? parseInt(activeYear, 10) : activeYear
    if (data.contributions.length > 0 && typeof data.contributions[0] !== 'undefined') {
      return data.contributions.reduce((sum, day) => {
        const d = new Date(day.date)
        return d.getFullYear() === targetYear ? sum + day.count : sum
      }, 0)
    }
    return 0
  }

  const activeContributionsCount = getSelectedYearTotalContributions()

  // Loading state skeleton UI
  if (loading) {
    return (
      <section className="relative section-padding overflow-hidden" aria-label="GitHub loading">
        <div className="container-wide max-w-4xl mx-auto space-y-12">
          {/* Header Skeleton */}
          <div className="flex flex-col items-center text-center space-y-3 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-muted/20" />
            <div className="h-6 w-32 bg-muted/20 rounded" />
            <div className="h-3 w-48 bg-muted/20 rounded" />
          </div>

          {/* Heatmap Skeleton */}
          <div className="glass rounded-3xl p-6 border border-border animate-pulse">
            <div className="h-4 w-40 bg-muted/20 rounded mb-4" />
            <div className="h-28 w-full bg-muted/10 rounded" />
          </div>
        </div>
      </section>
    )
  }

  // Graceful Fallback UI in case of errors
  if (error && data.contributions.length === 0) {
    return (
      <section className="relative section-padding overflow-hidden" aria-label="GitHub offline">
        <div className="container-wide max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 md:p-12 text-center border border-border flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/25">
              <Github className="h-8 w-8" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="font-display text-2xl font-bold">{t('github.title')}</h3>
              <p className="text-sm text-muted">
                {t('github.description')}
              </p>
              <p className="text-xs text-muted/60 pt-2">
                {isRtl ? 'تعذر جلب تغذية المساهمات المباشرة حالياً. يرجى استكشاف ملفي الشخصي مباشرة على GitHub.' : 'Unable to query live contributions feed right now. Please explore my profile directly on GitHub.'}
              </p>
            </div>

            <Button variant="outline" size="lg" className="rounded-full border-border hover:bg-accent/10 hover:border-accent/40" asChild>
              <a href={portfolioData.profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                {t('github.visitProfile')} {isRtl ? '←' : '→'}
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative section-padding overflow-hidden" aria-label="GitHub Activity">
      {/* Dynamic Background Glows */}
      {isDark && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      )}

      <div className="container-wide max-w-4xl mx-auto">
        <motion.div
          key={currentLang}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-12"
        >
          {/* Header Block */}
          <motion.div variants={itemVariants} className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center border border-accent/25 shadow-sm">
              <Github className="h-6 w-6" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="font-display text-3xl font-bold text-foreground">
                {t('github.title')}
              </h2>
              <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                {t('github.description')}
              </p>
            </div>
          </motion.div>

          {/* Grid Layout containing Heatmap Card + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Heatmap Card (Columns 1 to 10 on Desktop) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-10 glass rounded-3xl p-6 md:p-8 border border-border text-start relative overflow-hidden flex flex-col justify-between h-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                    {activeContributionsCount} {activeContributionsCount === 1 ? t('github.contributionsCount_one') : t('github.contributionsCount_other')} {t('github.in')} {activeYear}
                  </span>
                </div>
              </div>

              {/* Grid block with Day Labels on Left and Heatmap + Months inside Scroll Container */}
              <div className="flex items-start mt-6">
                
                {/* Fixed Day Labels Column on Left - Padded by pt-[20px] to align below absolute months */}
                <div className="flex flex-col gap-[4.5px] pe-2 text-[9px] text-muted-secondary select-none font-mono pt-[21px] w-[28px] shrink-0 text-end">
                  <div className="h-[12px] flex items-center justify-end"></div> {/* Sun */}
                  <div className="h-[12px] flex items-center justify-end font-semibold">{isRtl ? 'إثن' : 'Mon'}</div>
                  <div className="h-[12px] flex items-center justify-end"></div> {/* Tue */}
                  <div className="h-[12px] flex items-center justify-end font-semibold">{isRtl ? 'أرب' : 'Wed'}</div>
                  <div className="h-[12px] flex items-center justify-end"></div> {/* Thu */}
                  <div className="h-[12px] flex items-center justify-end font-semibold">{isRtl ? 'جمع' : 'Fri'}</div>
                  <div className="h-[12px] flex items-center justify-end"></div> {/* Sat */}
                </div>

                {/* Horizontal Scroll Wrapper */}
                <div className="overflow-x-auto pb-4 scrollbar-thin flex-1" dir={isRtl ? "rtl" : "ltr"}>
                  
                  {/* Inner relative container with 20px top padding for month titles */}
                  <div className="relative pt-[20px] min-w-max">
                    
                    {/* Absolute Month labels positioned based on column index */}
                    <div className="absolute top-0 left-0 right-0 h-4 text-[9px] text-muted-secondary font-mono select-none pointer-events-none">
                      {monthLabels.map((lbl) => (
                        <span
                          key={lbl.index}
                          className="absolute"
                          style={isRtl ? { right: `${lbl.index * 16.5}px`, left: 'auto' } : { left: `${lbl.index * 16.5}px` }} // 12px square + 4.5px gap = 16.5px width per week
                        >
                          {lbl.label}
                        </span>
                      ))}
                    </div>

                    {/* Heatmap Grid - 12px squares, 4.5px gaps */}
                    <div className="flex gap-[4.5px]">
                      {weeksGrid.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[4.5px]">
                          {week.map((day) => (
                            <div
                              key={day.date}
                              className={`w-[12px] h-[12px] rounded-xs ${intensityColors[day.level]} transition-colors duration-200`}
                              title={`${day.count} Contributions on ${day.date}`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

              </div>

              {/* Legend Row */}
              <div className="flex items-center gap-1.5 justify-end mt-4 text-[10px] text-muted pe-2">
                <span>{t('github.less')}</span>
                {intensityColors.map((colorClass, idx) => (
                  <div key={idx} className={`w-[10px] h-[10px] rounded-xs ${colorClass}`} />
                ))}
                <span>{t('github.more')}</span>
              </div>
            </motion.div>

            {/* Sidebar selection tabs (Columns 11 to 12 on Desktop) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none w-full"
            >
              {yearOptions.map((yearOption) => {
                const isSelected = activeYear === yearOption
                return (
                  <button
                    key={yearOption}
                    onClick={() => setSelectedYear(yearOption)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 w-full text-center lg:text-start cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-accent text-white shadow-[0_4px_15px_rgba(129,140,248,0.3)] border border-accent/25'
                          : 'bg-violet-600 text-white shadow-sm border border-violet-700/20'
                        : isDark
                        ? 'text-muted hover:text-foreground hover:bg-white/5 border border-transparent'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-black/5 border border-transparent'
                    }`}
                  >
                    {yearOption}
                  </button>
                )
              })}
            </motion.div>

          </div>

          {/* Single Premium CTA Button */}
          <motion.div variants={itemVariants} className="pt-4 flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-border text-xs font-bold text-foreground bg-glass hover:bg-accent/10 hover:border-accent/40 transition-all duration-300 shadow-xs animate-pulse hover:animate-none"
              asChild
            >
              <a
                href={portfolioData.profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8"
              >
                {t('github.visitProfile')} {isRtl ? '←' : '→'}
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
