import { Link } from 'react-router-dom'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { useProgress } from '../hooks/useProgress'
import { SECTIONS } from '../content/sections'
import week5Content from '../content/week5.md?raw'

export default function CoursePage() {
  const { progress, toggleSection } = useProgress()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10 flex gap-8">
        {/* 사이드바 */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-6">
            <Link to="/dashboard" className="text-sm text-indigo-600 hover:underline mb-4 block">← 대시보드</Link>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">목차</h3>
            <ul className="space-y-2">
              {SECTIONS.map(section => (
                <li key={section.id}>
                  <a
                    href={`#${section.anchor}`}
                    className={`text-sm block py-1 hover:text-indigo-600 transition ${
                      progress[section.id] ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    {progress[section.id] ? '✓ ' : ''}{section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* 본문 */}
        <main className="flex-1 min-w-0">
          <MarkdownRenderer content={week5Content} />

          {/* 섹션 완료 체크 */}
          <div className="mt-12 border-t pt-8">
            <h3 className="font-semibold text-gray-700 mb-4">섹션 완료 체크</h3>
            <div className="space-y-2">
              {SECTIONS.map(section => (
                <label key={section.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={progress[section.id] ?? false}
                    onChange={e => toggleSection(section.id, e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{section.title}</span>
                </label>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
