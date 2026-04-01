import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle, ChevronRight, Play } from 'lucide-react'
import { workoutService } from '../../services/workoutService'
import { useCountdown } from '../../hooks/useCountdown'
import type { Workout, WorkoutExercise } from '../../types/workout'

type ExecutionState = 'idle' | 'active' | 'resting' | 'done'

interface Pending {
  exerciseIdx: number
  setIdx: number
}

export function WorkoutExecutionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('workouts')

  const [workout, setWorkout] = useState<Workout | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [state, setState] = useState<ExecutionState>('idle')
  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [setIdx, setSetIdx] = useState(0)
  const [pending, setPending] = useState<Pending | null>(null)

  const pendingRef = useRef(pending)
  pendingRef.current = pending

  useEffect(() => {
    if (!id) return
    workoutService
      .find(id)
      .then(setWorkout)
      .catch(() => navigate('/workouts', { replace: true }))
      .finally(() => setIsLoading(false))
  }, [id, navigate])

  const exercises: WorkoutExercise[] = workout?.exercises ?? []
  const currentExercise = exercises[exerciseIdx]
  const nextExercise = exercises[exerciseIdx + 1] ?? null

  const restSeconds = currentExercise?.rest_seconds ?? 0
  const isResting = state === 'resting'

  function advanceTo(next: Pending | 'done') {
    if (next === 'done') {
      setState('done')
      return
    }
    setExerciseIdx(next.exerciseIdx)
    setSetIdx(next.setIdx)
    setState('active')
  }

  function handleRestDone() {
    const next = pendingRef.current
    if (!next) return
    setPending(null)
    advanceTo(next)
  }

  const remaining = useCountdown(isResting, restSeconds, handleRestDone)

  function handleStart() {
    setState('active')
  }

  function handleCompleteSet() {
    if (!currentExercise) return

    const isLastSet = setIdx >= currentExercise.sets - 1
    const isLastExercise = exerciseIdx >= exercises.length - 1

    const next: Pending | 'done' = !isLastSet
      ? { exerciseIdx, setIdx: setIdx + 1 }
      : !isLastExercise
        ? { exerciseIdx: exerciseIdx + 1, setIdx: 0 }
        : 'done'

    if (restSeconds > 0 && next !== 'done') {
      setPending(next)
      setState('resting')
    } else {
      advanceTo(next)
    }
  }

  function handleSkipRest() {
    handleRestDone()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-400 dark:text-gray-500 text-sm">{t('execution.loading')}</p>
      </div>
    )
  }

  if (!workout) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {state === 'idle' && (
        <IdleScreen
          workout={workout}
          exercises={exercises}
          onStart={handleStart}
          t={t}
        />
      )}

      {state === 'active' && currentExercise && (
        <ActiveScreen
          exercise={currentExercise}
          exerciseIdx={exerciseIdx}
          setIdx={setIdx}
          totalExercises={exercises.length}
          onComplete={handleCompleteSet}
          t={t}
        />
      )}

      {state === 'resting' && (
        <RestScreen
          remaining={remaining}
          totalSeconds={restSeconds}
          nextExercise={pending && pending.exerciseIdx !== exerciseIdx ? nextExercise : null}
          nextSetIdx={pending?.setIdx ?? 0}
          currentExercise={currentExercise}
          onSkip={handleSkipRest}
          t={t}
        />
      )}

      {state === 'done' && (
        <DoneScreen
          workout={workout}
          onFinish={() => navigate('/workouts')}
          t={t}
        />
      )}
    </div>
  )
}

// ─── Sub-screens ─────────────────────────────────────────────────────────────

interface TFunc {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (key: string, opts?: any): string
}

function IdleScreen({
  workout,
  exercises,
  onStart,
  t,
}: {
  workout: Workout
  exercises: WorkoutExercise[]
  onStart: () => void
  t: TFunc
}) {
  return (
    <div className="flex flex-col flex-1 p-6 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-2">
        {workout.name}
      </h1>
      {workout.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{workout.description}</p>
      )}

      <ul className="space-y-2 mb-auto">
        {exercises.map((ex, i) => (
          <li
            key={ex.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
          >
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 w-5 text-center">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {ex.exercise.name}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {ex.sets} × {ex.reps} reps
                {ex.weight ? ` · ${ex.weight} kg` : ''}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={onStart}
        className="cursor-pointer mt-8 w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all"
      >
        <Play size={22} fill="white" />
        {t('actions.start')}
      </button>
    </div>
  )
}

function ActiveScreen({
  exercise,
  exerciseIdx,
  setIdx,
  totalExercises,
  onComplete,
  t,
}: {
  exercise: WorkoutExercise
  exerciseIdx: number
  setIdx: number
  totalExercises: number
  onComplete: () => void
  t: TFunc
}) {
  const sets = Array.from({ length: exercise.sets })

  return (
    <div className="flex flex-col flex-1 items-center justify-between p-6 max-w-lg mx-auto w-full">
      {/* Top: progress */}
      <div className="w-full text-center pt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-1">
          {t('execution.exercise_of', { current: exerciseIdx + 1, total: totalExercises })}
        </p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
          {exercise.exercise.name}
        </h2>
        {exercise.exercise.muscle_groups?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 mt-2">
            {exercise.exercise.muscle_groups.map((mg) => (
              <span
                key={mg.id}
                className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
              >
                {mg.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Middle: set indicator + reps */}
      <div className="flex flex-col items-center gap-6">
        {/* Set dots */}
        <div className="flex gap-2">
          {sets.map((_, i) => (
            <span
              key={i}
              className={[
                'w-3 h-3 rounded-full transition-colors',
                i < setIdx
                  ? 'bg-indigo-600'
                  : i === setIdx
                    ? 'bg-indigo-400 ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-gray-950'
                    : 'bg-gray-200 dark:bg-gray-700',
              ].join(' ')}
            />
          ))}
        </div>

        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {t('execution.set_of', { current: setIdx + 1, total: exercise.sets })}
        </p>

        {/* Reps */}
        <div className="flex flex-col items-center">
          <span className="text-8xl font-black text-gray-900 dark:text-white leading-none">
            {exercise.reps}
          </span>
          <span className="text-lg text-gray-400 dark:text-gray-500 mt-1">reps</span>
        </div>

        {exercise.weight && (
          <p className="text-base font-semibold text-gray-600 dark:text-gray-300">
            {exercise.weight} kg
          </p>
        )}
      </div>

      {/* Bottom: action */}
      <button
        onClick={onComplete}
        className="cursor-pointer w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all"
      >
        {t('actions.complete_set')}
        <ChevronRight size={22} />
      </button>
    </div>
  )
}

function RestScreen({
  remaining,
  totalSeconds,
  nextExercise,
  nextSetIdx,
  currentExercise,
  onSkip,
  t,
}: {
  remaining: number
  totalSeconds: number
  nextExercise: WorkoutExercise | null
  nextSetIdx: number
  currentExercise: WorkoutExercise
  onSkip: () => void
  t: TFunc
}) {
  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0
  const radius = 88
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  const nextInfo = nextExercise
    ? nextExercise.exercise.name
    : `${t('execution.set_of', { current: nextSetIdx + 1, total: currentExercise.sets })} — ${currentExercise.exercise.name}`

  return (
    <div className="flex flex-col flex-1 items-center justify-between p-6 max-w-lg mx-auto w-full">
      <div className="w-full text-center pt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {t('execution.rest_title')}
        </p>
      </div>

      {/* Circular timer */}
      <div className="relative flex items-center justify-center">
        <svg width="220" height="220" className="-rotate-90">
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-200 dark:text-gray-800"
          />
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-indigo-500 transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-6xl font-black text-gray-900 dark:text-white tabular-nums">
            {remaining}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-500">seg</span>
        </div>
      </div>

      {/* Next info */}
      <div className="w-full">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 text-center mb-2">
          {t('execution.rest_next')}
        </p>
        <div className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{nextInfo}</p>
        </div>

        <button
          onClick={onSkip}
          className="cursor-pointer mt-4 w-full py-3 rounded-2xl border-2 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 font-semibold text-base hover:bg-indigo-50 dark:hover:bg-indigo-950 active:scale-[0.98] transition-all"
        >
          {t('actions.skip_rest')}
        </button>
      </div>
    </div>
  )
}

function DoneScreen({
  workout,
  onFinish,
  t,
}: {
  workout: Workout
  onFinish: () => void
  t: TFunc
}) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-6 max-w-lg mx-auto w-full gap-4 text-center">
      <CheckCircle size={72} className="text-emerald-500" strokeWidth={1.5} />
      <h2 className="text-3xl font-black text-gray-900 dark:text-white">
        {t('execution.done_title')}
      </h2>
      <p className="text-base text-gray-500 dark:text-gray-400">{t('execution.done_subtitle')}</p>
      <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400">{workout.name}</p>

      <button
        onClick={onFinish}
        className="cursor-pointer mt-6 w-full py-4 rounded-2xl bg-emerald-600 text-white text-lg font-semibold hover:bg-emerald-700 active:scale-[0.98] transition-all"
      >
        {t('actions.finish')}
      </button>
    </div>
  )
}
