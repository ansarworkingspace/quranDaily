'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Verse {
  chapter: number
  verse: number
  text: string
}

interface QuranVerse {
  arabic:Verse,
  english:Verse,
  malayalam:Verse
}

export default function Home() {
  const [verses, setVerses] = useState<QuranVerse[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchConsecutiveVerses = async () => {
    try {
      setLoading(true)
      
      const [arabicEdition, englishEdition, malayalamEdition] = await Promise.all([
        fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranacademy.min.json').then(res => res.json()),
        fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-abdelhaleem.min.json').then(res => res.json()),
        fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/mal-abdulhameedmada.min.json').then(res => res.json())
      ]);

      // Generate random chapter (1-114)
      const chapter = Math.floor(Math.random() * 114) + 1;
      
      // Get verses for the selected chapter
      const arabicChapter = arabicEdition.quran.filter((verse: Verse) => verse.chapter === chapter);
      const englishChapter = englishEdition.quran.filter((verse: Verse) => verse.chapter === chapter);
      const malayalamChapter = malayalamEdition.quran.filter((verse: Verse) => verse.chapter === chapter);

      // Get random starting verse number from the chapter (leaving room for 3 verses)
      const maxStartIndex = Math.max(0, arabicChapter.length - 3);
      const startIndex = Math.floor(Math.random() * maxStartIndex);

      // Get three consecutive verses if they exist
      const consecutiveVerses = Array.from({ length: 3 }).map((_, i) => {
        const index = startIndex + i;
        if (index < arabicChapter.length) {
          return {
            arabic: arabicChapter[index],
            english: englishChapter[index],
            malayalam: malayalamChapter[index]
          };
        }
        return null;
      }).filter(Boolean) as QuranVerse[];

      setVerses(consecutiveVerses);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching verses:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConsecutiveVerses()
  }, [])

  const nextVerse = () => setCurrentIndex((prev) => (prev + 1) % verses.length)
  const prevVerse = () => setCurrentIndex((prev) => (prev - 1 + verses.length) % verses.length)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 mt-12 md:mt-6 to-teal-100 p-4  md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.header 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-emerald-800">DAILY QURAN VERSES</h1>
          <p className="text-emerald-600/80">Seek guidance and inspiration from the Holy Quran</p>
        </motion.header>

        {verses.length > 0 && (
          <div className="relative">
            <div className="flex items-center">
              <button
                onClick={prevVerse}
                className="absolute left-0 z-10 -translate-x-5 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                disabled={verses.length <= 1}
              >
                ←
              </button>

              <AnimatePresence mode="wait">
                // Update the verse card styles
                <motion.div 
                  key={currentIndex}
                  className="verse-card bg-[#fffbf4] backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 w-full relative border border-emerald-100 before:absolute before:inset-0 before:bg-paper-texture before:opacity-20 before:pointer-events-none"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Update Arabic text container */}
                  <motion.div 
                    className="arabic-text text-2xl md:text-3xl mb-8 text-center leading-relaxed text-emerald-900 font-bold relative"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-emerald-100/50 rounded-full blur-xl"></div>
                    {verses[currentIndex].arabic.text}
                  </motion.div>
                
                  {/* Update translation cards */}
                  <div className="space-y-4">
                    <motion.div className="translation-card bg-white/80 rounded-xl p-4 shadow-sm border border-emerald-50">
                      <h2 className="font-semibold mb-2 text-emerald-800">English Translation</h2>
                      <p className="text-emerald-700 font-bold">{verses[currentIndex].english.text}</p>
                    </motion.div>
                
                    <motion.div className="translation-card bg-white/80 rounded-xl p-4 shadow-sm border border-emerald-50">
                      <h2 className="font-semibold mb-2 text-emerald-800">Malayalam Translation</h2>
                      <p className="text-emerald-700 font-bold">{verses[currentIndex].malayalam.text}</p>
                    </motion.div>
                
                    <motion.div className="text-center text-emerald-600/70 text-sm mt-6">
                      <span className="bg-emerald-50 px-4 py-1 rounded-full">
                        Surah {verses[currentIndex].arabic.chapter}, Verse {verses[currentIndex].arabic.verse}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={nextVerse}
                className="absolute right-0 z-10 translate-x-5 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
                disabled={verses.length <= 1}
              >
                →
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {verses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-emerald-600' : 'bg-emerald-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={fetchConsecutiveVerses}
            className="bg-emerald-600 text-white px-8 py-3 rounded-full hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Get More Verses
          </button>

          <div className="text-sm text-emerald-600/70">
            <p>
              Developed by{' '}
              <a 
                href="https://muhammedansaren.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-emerald-800"
              >
                Muhammed Ansar EN
              </a>{' '}
              • API provided by{' '}
              <a 
                href="https://github.com/fawazahmed0/quran-api"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-emerald-800"
              >
                Quran API (fawazahmed0)
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}