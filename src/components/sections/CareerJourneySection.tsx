import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import { portfolioData } from '@/data/portfolioData'
import { SectionHeading } from '@/components/shared/SectionHeading'

gsap.registerPlugin(ScrollTrigger)

export function CareerJourneySection() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || 'en'
  const isRtl = currentLang === 'ar'

  useEffect(() => {
    const line = lineRef.current
    const section = timelineRef.current
    if (!line || !section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  // Map career journey with translations, keeping roles and companies in English
  const journeySteps = portfolioData.careerJourney.map((step, idx) => {
    const localList = t('journey.journeyList', { returnObjects: true }) as Array<{
      period: string
      location: string
      description: string
      highlights: string[]
    }> | null

    const localStep = localList && localList[idx] ? localList[idx] : null

    return {
      ...step,
      period: localStep?.period || step.period,
      location: localStep?.location || step.location,
      description: localStep?.description || step.description,
      highlights: localStep?.highlights || step.highlights,
    }
  })

  return (
    <section id="journey" className="relative section-padding" style={{ overflowX: 'clip' }} aria-label="Career Journey">
      <div className="container-wide">
        <SectionHeading
          label={t('journey.label')}
          title={t('journey.title')}
          description={t('journey.description')}
        />

        <div ref={timelineRef} className="relative max-w-3xl mx-auto">
          {/* Animated line - left-6/right-6 on mobile, md:left-1/2 on desktop */}
          <div className="absolute start-6 md:start-1/2 top-0 bottom-0 w-px md:-translate-x-px">
            <div className="absolute inset-0 dark:bg-white/10 light:bg-black/10" />
            <div
              ref={lineRef}
              className="absolute inset-0 bg-gradient-to-b from-accent via-accent-secondary to-accent-tertiary origin-top"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          <motion.div
            key={currentLang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {journeySteps.map((step, i) => {
              const isEven = i % 2 === 0
              const initialX = isRtl ? (isEven ? 40 : -40) : (isEven ? -40 : 40)
              
              return (
                <motion.div
                  key={`${step.role}-${step.company}`}
                  initial={{ opacity: 0, x: initialX }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative flex items-start gap-8 mb-10 last:mb-0 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Dot — use opposite translate direction in RTL to center over right-anchored line */}
                  <div className={`absolute start-6 md:start-1/2 z-10 ${isRtl ? 'translate-x-1/2' : '-translate-x-1/2'}`}>
                    <motion.div
                      whileInView={{ scale: [0, 1.2, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                      className="w-4 h-4 rounded-full bg-accent shadow-[0_0_20px_rgba(129,140,248,0.6)]"
                    />
                  </div>

                  {/* Content */}
                  <div className={`ms-14 md:ms-0 md:w-[calc(50%-2rem)] text-start ${
                    isEven
                      ? isRtl ? 'md:pe-8' : 'md:pe-8'
                      : 'md:ps-8'
                  }`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-accent tracking-wider">{step.period}</span>
                      <span className="text-[10px] text-muted">| {step.location}</span>
                    </div>
                    <h3 className="mt-1 font-display text-lg md:text-xl font-bold leading-tight">{step.role}</h3>
                    <p className="text-xs font-bold text-accent-secondary/90 mt-0.5">{step.company}</p>
                    <p className="mt-2 text-xs text-muted leading-relaxed">{step.description}</p>
                    
                    {/* Bullet list — dot always first in DOM:
                        LTR: flex-row renders left-to-right → dot on LEFT for all entries.
                        RTL: flex-row renders right-to-left → dot on RIGHT (logical start). */}
                    <ul className={`mt-3 space-y-1.5 text-xs text-muted/85 ${
                      isEven && !isRtl ? 'md:text-start' : ''
                    }`}>
                      {step.highlights.map((highlight, idx) => (
                        <li key={idx} className="leading-relaxed flex items-start gap-1.5">
                          <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-accent" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
