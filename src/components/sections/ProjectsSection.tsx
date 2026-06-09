import { useRef } from 'react'
import { motion } from 'framer-motion'
import {  Laptop } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { portfolioData } from '@/data/portfolioData'
import { caseStudiesData } from '@/data/caseStudiesData'
import { projectImages } from '@/assets/projects/projectImages'
import { SectionHeading } from '@/components/shared/SectionHeading'
// import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/shared/ThemeContext'

export function ProjectsSection() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language || 'en'
  // const isRtl = currentLang === 'ar'

  // const slide = (direction: 'left' | 'right') => {
  //   const slider = sliderRef.current
  //   if (!slider) return
  //   const scrollAmount = 340
  //   const multiplier = isRtl ? -1 : 1
  //   slider.scrollBy({
  //     left: direction === 'left' ? -scrollAmount * multiplier : scrollAmount * multiplier,
  //     behavior: 'smooth',
  //   })
  // }

  return (
    <section id="projects" className="relative section-padding" aria-label="Featured Projects">
      <div className="container-wide">
        
        {/* Section Header with Carousel Navigation */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <SectionHeading
            label={t('projects.label')}
            title={t('projects.title')}
            description={t('projects.description')}
            className="mb-0!"
          />
          
          {/* <div className="flex items-center gap-3 mt-6 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => slide('left')}
              className="rounded-full border-border text-muted hover:text-foreground dark:hover:bg-white/5 light:hover:bg-black/5 hover:border-accent/35 transition-colors"
              aria-label="Slide left"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => slide('right')}
              className="rounded-full border-border text-muted hover:text-foreground dark:hover:bg-white/5 light:hover:bg-black/5 hover:border-accent/35 transition-colors"
              aria-label="Slide right"
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div> */}
        </div>

        {/* Grid — single column on mobile, 2-col on md, 3-col on lg */}
        <div
          ref={sliderRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {portfolioData.projects.map((project) => {
            const study = caseStudiesData[currentLang]?.[project.id] || caseStudiesData['en'][project.id];
            const projectLink = currentLang === 'ar' ? `/ar/projects/${project.id}` : `/projects/${project.id}`;

            const images = projectImages.find((p) => p.id === project.id)
            const cardImage = images?.cardGif || images?.cover

            // const MAX_TAGS = 4
            // const displayTags = project.tags.slice(0, MAX_TAGS)
            // const remainingCount = project.tags.length - MAX_TAGS

            return (
              <motion.div
                key={project.id}
                whileHover={{ y: isDark ? -6 : -2 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Link
                  to={projectLink}
                  className="rounded-3xl glass hover:border-accent/30 dark:hover:border-accent/30 light:hover:border-accent/50 transition-all duration-500 overflow-hidden flex flex-col justify-between group block cursor-pointer h-full"
                >
                  {/* Browser Window Mockup Frame */}
                  <div className="w-full flex flex-col bg-alt-background/30 dark:bg-white/[0.01]">
                    {/* Browser Top Bar */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                      </div>
                      <div className="h-4 w-1/2 rounded bg-background/60 flex items-center justify-center text-[9px] text-muted/50 font-mono tracking-wider truncate px-2 border border-border/10">
                        {project.id === 'wms' && 'wms-logistics.com'}
                        {project.id === 'ertiqaa-academy' && 'ertiqaaedu.com'}
                        {project.id === 'web-point-erp' && 'webpoint-erp.com'}
                        {project.id === 'haya-academy' && 'hayaedu.com'}
                        {project.id === 'mrs-ayat-asaad' && 'mrs-ayatasaad.com'}
                      </div>
                      <Laptop className="h-3 w-3 text-muted/30" />
                    </div>

                    {/* Mockup Screen Content */}
                    <div className="relative w-full h-[240px] overflow-hidden border-b border-border bg-black">
                      <div className="w-full h-full transition-transform duration-300 ease group-hover:scale-[1.04]">
                        {cardImage ? (
                          <img
                            src={cardImage}
                            alt={project.title}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : null}
                      </div>

                      {/* Semi-transparent Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="text-white text-xs font-semibold tracking-wider font-display uppercase">
                          {currentLang === 'ar' ? 'عرض دراسة الحالة' : 'View Case Study'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Body */}
                  <div className="p-6 flex flex-col justify-between flex-1 gap-6 text-start">
                    <motion.div
                      key={currentLang}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 flex flex-col h-full justify-between"
                    >
                      <div className="space-y-3 flex-1 flex flex-col">
                        {/* Category Label */}
                        <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
                          {study?.category || 'ENTERPRISE APP'}
                        </span>

                        {/* Project Title */}
                        <h3 className="font-display text-xl font-bold text-foreground transition-colors leading-tight">
                          {project.title}
                        </h3>

                        {/* Single-line Impact Sentence */}
                        <p className="text-xs text-muted leading-relaxed">
                          {study?.tagline || project.tagline}
                        </p>

                        {/* Tech Badges */}
                        {/* <div className="flex flex-wrap gap-1.5 pt-2 mt-auto">
                          {displayTags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase border border-accent/10 bg-accent/5 text-accent"
                            >
                              {tag}
                            </span>
                          ))}
                          {remainingCount > 0 && (
                            <span className="px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase border border-white/10 bg-white/5 text-muted">
                              +{remainingCount} {currentLang === 'ar' ? 'المزيد' : 'more'}
                            </span>
                          )}
                        </div> */}
                      </div>

                      {/* View Case Study arrow */}
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent mt-4">
                        {t('caseStudy.viewCaseStudy').replace(' →', '')}
                        <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 duration-300">
                          {currentLang === 'ar' ? '←' : '→'}
                        </span>
                      </span>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
