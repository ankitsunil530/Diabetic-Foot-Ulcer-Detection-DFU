import {
  AlertTriangle,
  ArrowRight,
  Brain,
  ClipboardCheck,
  Eye,
  Gauge,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import HealthStatus from '../components/HealthStatus.jsx'

function FeatureCard({ icon, title, desc }) {
  return (
    <Card className="p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-none">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-primary dark:bg-blue-950/40">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-extrabold">{title}</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {desc}
          </div>
        </div>
      </div>
    </Card>
  )
}

function WorkflowStep({ icon, step, title, desc }) {
  return (
    <Card className="p-5">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-primary dark:bg-blue-950/40">
            {icon}
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {step}
          </span>
        </div>
        <div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            {title}
          </div>
          <div className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {desc}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function HomePage() {
  return (
    <div className="grid gap-8">
      <section className="grid items-start gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950 dark:shadow-none md:grid-cols-[1.3fr_1fr]">
        <div className="grid gap-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-primary dark:bg-blue-950/40">
              Medical AI
            </span>
            Explainable screening support
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
            AI-Based Diabetic Foot Ulcer Detection
          </h1>

          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
            Upload a foot image and receive an interpretable prediction with
            confidence, severity cues, and basic care recommendations.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/analyze">
              <Button size="lg" className="group">
                Start Analysis{' '}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link to="/history">
              <Button size="lg" variant="secondary">
                View History
              </Button>
            </Link>
          </div>

          <div className="pt-1">
            <HealthStatus />
          </div>
        </div>

        <div className="grid gap-3">
          <Card className="p-5">
            <div className="text-sm font-extrabold">Dashboard principles</div>
            <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" /> Trustworthy,
                minimal UI
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> Explainable AI section
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-warning" /> Clear confidence +
                severity cues
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              API endpoints used
            </div>
            <div className="mt-2 grid gap-1 text-sm font-semibold">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs dark:border-slate-800 dark:bg-slate-900/60">
                GET /api/health
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs dark:border-slate-800 dark:bg-slate-900/60">
                POST /api/predict (multipart image)
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="grid gap-1">
          <div className="text-sm font-extrabold text-slate-900 dark:text-white">
            How It Works
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            The screening flow turns a foot image into a clear prediction summary
            through four simple stages.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <WorkflowStep
            icon={<Upload className="h-5 w-5" aria-hidden="true" />}
            step="Step 1"
            title="Upload Image"
            desc="The user uploads a clear foot image for the system to review."
          />
          <WorkflowStep
            icon={<Brain className="h-5 w-5" aria-hidden="true" />}
            step="Step 2"
            title="AI Analysis"
            desc="The model processes the image and extracts relevant visual features."
          />
          <WorkflowStep
            icon={<ClipboardCheck className="h-5 w-5" aria-hidden="true" />}
            step="Step 3"
            title="Prediction Generation"
            desc="The system estimates whether signs of a diabetic foot ulcer are present."
          />
          <WorkflowStep
            icon={<Eye className="h-5 w-5" aria-hidden="true" />}
            step="Step 4"
            title="View Results"
            desc="The prediction, confidence, severity cues, and guidance are displayed."
          />
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
          <AlertTriangle
            className="mt-0.5 h-5 w-5 flex-none"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            This tool is intended for screening and assistance only. It is not a
            substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </section>

      <section className="grid gap-3">
        <div className="text-sm font-extrabold text-slate-900 dark:text-white">
          Features
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <FeatureCard
            icon={<Gauge className="h-5 w-5" aria-hidden="true" />}
            title="Fast Detection"
            desc="Single-image flow optimized for quick triage support and demos."
          />
          <FeatureCard
            icon={<Brain className="h-5 w-5" aria-hidden="true" />}
            title="AI Powered"
            desc="Clean prediction summary with confidence and severity indicators."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
            title="Accurate Results"
            desc="Designed to plug in your trained model via a stable API contract."
          />
        </div>
      </section>
    </div>
  )
}

