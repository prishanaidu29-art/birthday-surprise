'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function BirthdayPage() {
  const router = useRouter()

  useEffect(() => {
    const authenticated = sessionStorage.getItem('birthday_authenticated')

    if (authenticated !== 'true') {
      router.push('/')
    }
  }, [router])

  const sections = [
    {
      number: '01',
      title: 'THE MEMORIES',
      description: 'photos & places ',
      link: '/birthday/memories',
    },
    {
      number: '02',
      title: 'THE MESSAGES',
      description: 'things people wanted you to know',
      link: '/birthday/messages',
    },
    {
      number: '03',
      title: 'THE SOUNDTRACK',
      description: 'songs about you ',
      link: '/birthday/playlist',
    },
    {
      number: '04',
      title: 'THE CHAOS',
      description: 'shits and giggles ',
      link: '/birthday/games',
    },
    {
      number: '05',
      title: 'THE QUIZ',
      description: "let's see how well you actually know us",
      link: '/birthday/quiz',
    },
    {
      number: '06',
      title: 'THE JOURNEY',
      description: 'everywhere, somehow, led to here',
      link: '/birthday/journey',
    },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem('birthday_authenticated')
    router.push('/')
  }

  return (
    <main className="min-h-screen bg-[#111111] text-[#e8e3d9] overflow-x-hidden">

      {/* subtle grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-50"
        style={{
          backgroundImage:
            'url("https://grainy-gradients.vercel.app/noise.svg")',
        }}
      />

      {/* top bar */}
      <header className="px-6 sm:px-10 pt-6 flex justify-between items-center">
        <div className="text-[10px] sm:text-xs tracking-[0.3em] text-[#8d8880]">
          PRIVATE ARCHIVE
        </div>

        <button
          onClick={handleLogout}
          className="text-[10px] sm:text-xs tracking-[0.2em] text-[#77736d] hover:text-[#e8e3d9] transition-colors"
        >
          EXIT ↗
        </button>
      </header>

      {/* hero */}
      <section className="px-6 sm:px-10 pt-20 sm:pt-28 pb-20 max-w-6xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-10 bg-[#7d252d]" />
          <span className="text-[10px] tracking-[0.35em] text-[#9b9590]">
            ARCHIVE 001
          </span>
        </div>

        <div className="grid md:grid-cols-[1fr_260px] gap-12 items-end">

          <div>
            <p className="text-xs tracking-[0.25em] text-[#77736d] mb-5">
              19 / 11 / 04
            </p>

            <h1 className="text-6xl sm:text-8xl md:text-[9rem] leading-[0.8] tracking-[-0.07em] font-serif">
              CLAR
            </h1>

            <p className="mt-8 max-w-xl text-sm sm:text-base leading-7 text-[#9d9890]">
              You made it this far.
              <br />
              Unfortunately, there is no turning back now.
            </p>
          </div>

          <div className="border border-[#373532] p-5 rotate-2 bg-[#171717]">
            <div className="aspect-[4/5] bg-[#292826] flex items-center justify-center">
              <span className="text-[9px] tracking-[0.25em] text-[#68645e] text-center px-5">
                PHOTO
                <br />
                COMING
                <br />
                SOON
              </span>
            </div>

            <p className="mt-4 text-[9px] tracking-[0.2em] text-[#77736d]">
              FIG. 001 — CLAR
            </p>
          </div>

        </div>
      </section>

      {/* intro note */}
      <section className="px-6 sm:px-10 pb-24 max-w-6xl mx-auto">

        <div className="border-y border-[#302f2c] py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#7d252d] mb-3">
              CLASSIFIED
            </p>

            <p className="font-serif italic text-xl sm:text-2xl text-[#d6d0c5]">
              a collection of memories, bad decisions
              <br className="hidden sm:block" />
              & things we probably shouldn't publish.
            </p>
          </div>

          <div className="text-[9px] tracking-[0.2em] text-[#66625d]">
            DO NOT DISTRIBUTE
          </div>

        </div>
      </section>

      {/* navigation */}
      <section className="px-6 sm:px-10 pb-24 max-w-6xl mx-auto">

        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[#77736d] mb-2">
              CONTENTS
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl">
              Open the archive.
            </h2>
          </div>

          <span className="hidden sm:block text-[9px] tracking-[0.2em] text-[#55524d]">
            06 FILES
          </span>
        </div>

        <div className="border-t border-[#373532]">

          {sections.map((section) => (
            <Link
              key={section.number}
              href={section.link}
              className="group border-b border-[#373532] py-7 flex items-center gap-5 sm:gap-8 hover:bg-[#181817] transition-all duration-300 px-2"
            >

              <span className="text-[10px] tracking-[0.2em] text-[#625e59] w-8">
                {section.number}
              </span>

              <div className="flex-1">

                <h3 className="text-lg sm:text-2xl tracking-[0.04em] group-hover:text-[#a63b45] transition-colors">
                  {section.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#706c66] mt-1">
                  {section.description}
                </p>

              </div>

              <span className="text-[#625e59] group-hover:text-[#a63b45] group-hover:translate-x-1 transition-all text-lg">
                →
              </span>

            </Link>
          ))}

        </div>
      </section>

      {/* bottom message */}
      <section className="px-6 sm:px-10 pb-20 max-w-6xl mx-auto">

        <div className="bg-[#171716] border border-[#302f2c] p-8 sm:p-12 relative overflow-hidden">

          <div className="absolute top-0 right-0 text-[7rem] sm:text-[10rem] font-serif text-[#201f1d] leading-none select-none">
            ♡
          </div>

          <p className="relative text-[9px] tracking-[0.3em] text-[#7d252d] mb-5">
            FILE NOTE // 19.11
          </p>

          <p className="relative font-serif text-2xl sm:text-4xl leading-tight max-w-3xl">
            Happy birthday to the person who somehow managed to become
            such a massive part of my life.
          </p>

          <p className="relative mt-6 text-xs sm:text-sm text-[#77736d] max-w-xl leading-6">
            This website is basically an unnecessarily elaborate way of saying
            that you're loved. So... enjoy.
          </p>

        </div>
      </section>

      {/* footer */}
      <footer className="px-6 sm:px-10 pb-8 max-w-6xl mx-auto flex justify-between text-[8px] tracking-[0.25em] text-[#504d48]">
        <span>DVA / CLAR</span>
        <span>19 • 11 • 04</span>
        <span>ARCHIVE CLOSED</span>
      </footer>

    </main>
  )
}
