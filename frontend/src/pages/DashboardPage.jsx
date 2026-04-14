import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProgress } from '../hooks/useProgress'
import { SECTIONS } from '../content/sections'

export default function DashboardPage() {
  const { user } = useAuth()
  const { progress, toggleSection, completedCount } = useProgress()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">안녕하세요, {user?.name}님!</h1>
          <p className="text-gray-500 mt-1">5주차 학습을 시작하세요.</p>
        </div>

        {/* 진도 바 */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-gray-700">학습 진도</span>
            <span className="text-sm text-indigo-600 font-medium">{completedCount} / {SECTIONS.length} 완료</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / SECTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 섹션 목록 */}
        <div className="space-y-3">
          {SECTIONS.map(section => (
            <div key={section.id} className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-4">
              <input
                type="checkbox"
                checked={progress[section.id] ?? false}
                onChange={e => toggleSection(section.id, e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
              />
              <Link
                to={`/course/week5#${section.anchor}`}
                className="flex-1 font-medium text-gray-800 hover:text-indigo-600 transition"
              >
                {section.title}
              </Link>
              {progress[section.id] && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">완료</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/course/week5"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            강의 열기 →
          </Link>
        </div>
      </div>
    </div>
  )
}
