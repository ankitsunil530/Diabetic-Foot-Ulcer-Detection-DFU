import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'

export default function NotFoundPage() {
  return (
    <Card className="p-8">
      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
        404
      </div>
      <div className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">
        Page not found
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        The page you are looking for doesn’t exist.
      </p>
      <div className="mt-5">
        <Link to="/">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4" /> Go home
          </Button>
        </Link>
      </div>
    </Card>
  )
}

