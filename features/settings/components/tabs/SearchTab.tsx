'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon, BoltIcon } from '@heroicons/react/24/outline';

interface CoverageResponse {
  success: true;
  coverage: { total: number; withEmbedding: number; withoutEmbedding: number; percent: number };
  pgvector: { installed: boolean; version: string | null };
  embedding: { model: string; dimensions: number; apiKeyConfigured: boolean };
}

interface JobState {
  status: 'idle' | 'running' | 'completed' | 'failed';
  mode: 'missing' | 'force' | null;
  processed: number;
  succeeded: number;
  failed: number;
  total: number;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  error: string | null;
}

interface JobResponse { success: true; job: JobState }

const POLL_MS = 1500;

export function SearchTab() {
  const [coverage, setCoverage] = useState<CoverageResponse | null>(null);
  const [job, setJob] = useState<JobState | null>(null);
  const [actionLoading, setActionLoading] = useState<'missing' | 'force' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCoverage = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/search/embeddings/status');
      const data = (await res.json()) as CoverageResponse | { success: false; error: string };
      if (!res.ok || !('coverage' in data)) {
        setError('error' in data ? data.error : 'Erreur de chargement');
        return;
      }
      setCoverage(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const fetchJob = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/search/reindex');
      const data = (await res.json()) as JobResponse;
      if (data.success) setJob(data.job);
    } catch {
      // silencieux : le polling reprendra
    }
  }, []);

  // Initial load + poll while a job is running
  useEffect(() => {
    fetchCoverage();
    fetchJob();
  }, [fetchCoverage, fetchJob]);

  useEffect(() => {
    if (job?.status === 'running') {
      if (!pollRef.current) {
        pollRef.current = setInterval(() => { fetchJob(); }, POLL_MS);
      }
    } else {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      if (job?.status === 'completed' || job?.status === 'failed') {
        // Le job vient de finir → refresh des stats
        fetchCoverage();
      }
    }
    return () => {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };
  }, [job?.status, fetchJob, fetchCoverage]);

  const startReindex = async (mode: 'missing' | 'force') => {
    if (mode === 'force' && !confirm('Réindexer TOUTES les propriétés ? Ça consomme des tokens OpenAI proportionnellement au nombre de biens.')) {
      return;
    }
    setActionLoading(mode);
    setError(null);
    try {
      const res = await fetch('/api/admin/search/reindex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });
      const data = (await res.json()) as JobResponse | { success: false; error: string };
      if (!res.ok || !('job' in data)) {
        setError('error' in data ? data.error : 'Démarrage impossible');
        return;
      }
      setJob(data.job);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setActionLoading(null);
    }
  };

  const percent = coverage?.coverage.percent ?? 0;
  const runningPercent = job?.status === 'running' && job.total > 0
    ? Math.round((job.processed / job.total) * 100)
    : null;
  const isRunning = job?.status === 'running';

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">Recherche sémantique (pgvector)</h3>
      <p className="text-sm text-muted-foreground mb-6">
        La recherche utilise un index vectoriel <code className="px-1 py-0.5 bg-muted rounded">pgvector</code> calculé à partir des champs textuels de chaque propriété.
        Réindexe quand tu modifies en masse des biens hors UI (import SQL, seed, dump…), ou si la couverture est incomplète.
      </p>

      {/* Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <HealthCard
          label="pgvector"
          value={coverage?.pgvector.installed ? `v${coverage.pgvector.version}` : 'non installé'}
          ok={Boolean(coverage?.pgvector.installed)}
        />
        <HealthCard
          label="Clé OpenAI"
          value={coverage?.embedding.apiKeyConfigured ? 'configurée' : 'manquante'}
          ok={Boolean(coverage?.embedding.apiKeyConfigured)}
        />
        <HealthCard
          label="Modèle"
          value={coverage ? `${coverage.embedding.model} (${coverage.embedding.dimensions}d)` : '—'}
          ok={Boolean(coverage)}
        />
      </div>

      {/* Coverage */}
      <div className="p-5 bg-muted/50 rounded-xl mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <h4 className="font-semibold text-foreground">Couverture des embeddings</h4>
          <span className="text-sm text-muted-foreground">
            {coverage ? `${coverage.coverage.withEmbedding} / ${coverage.coverage.total}` : '—'}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all ${percent === 100 ? 'bg-green-500' : 'bg-primary-500'}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{percent}% indexé</span>
          {coverage && coverage.coverage.withoutEmbedding > 0 && (
            <span className="text-amber-600 dark:text-amber-400">
              {coverage.coverage.withoutEmbedding} bien{coverage.coverage.withoutEmbedding > 1 ? 's' : ''} sans embedding
            </span>
          )}
        </div>
      </div>

      {/* Job status */}
      {job && job.status !== 'idle' && (
        <div className={`p-5 rounded-xl mb-6 border ${
          job.status === 'running' ? 'bg-primary-50 dark:bg-primary-950/30 border-primary-200 dark:border-primary-900' :
          job.status === 'completed' ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900' :
          'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {job.status === 'running' && <ArrowPathIcon className="w-5 h-5 text-primary-600 animate-spin" />}
            {job.status === 'completed' && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
            {job.status === 'failed' && <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />}
            <h4 className="font-semibold text-foreground">
              {job.status === 'running' && `Réindexation en cours (mode: ${job.mode})`}
              {job.status === 'completed' && `Réindexation terminée (mode: ${job.mode})`}
              {job.status === 'failed' && 'Réindexation échouée'}
            </h4>
          </div>

          {job.status === 'running' && (
            <>
              <div className="w-full bg-primary-100 dark:bg-primary-900/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-primary-600 transition-all" style={{ width: `${runningPercent ?? 0}%` }} />
              </div>
              <p className="text-sm text-primary-900 dark:text-primary-200 mt-2">
                {job.processed} / {job.total} traités · {job.succeeded} OK · {job.failed} échecs
              </p>
            </>
          )}

          {job.status === 'completed' && (
            <p className="text-sm text-green-900 dark:text-green-200">
              {job.succeeded} indexés, {job.failed} échecs sur {job.total} ·
              {job.durationMs ? ` ${(job.durationMs / 1000).toFixed(1)}s` : ''}
            </p>
          )}

          {job.status === 'failed' && (
            <p className="text-sm text-red-900 dark:text-red-200">{job.error}</p>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl">
          <p className="text-sm text-red-900 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => startReindex('missing')}
          disabled={isRunning || actionLoading !== null || !coverage?.pgvector.installed || !coverage?.embedding.apiKeyConfigured}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-sm"
        >
          <BoltIcon className="w-5 h-5" />
          {actionLoading === 'missing' ? 'Démarrage…' : 'Indexer les manquants'}
        </button>
        <button
          type="button"
          onClick={() => startReindex('force')}
          disabled={isRunning || actionLoading !== null || !coverage?.pgvector.installed || !coverage?.embedding.apiKeyConfigured}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-sm"
        >
          <ArrowPathIcon className="w-5 h-5" />
          {actionLoading === 'force' ? 'Démarrage…' : 'Tout réindexer (force)'}
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        <strong>Indexer les manquants</strong> ne touche que les biens sans vecteur (gratuit si tout est déjà à jour).
        <strong> Tout réindexer</strong> remplace tous les vecteurs — utile après un changement du modèle d&apos;embedding ou de la construction du texte.
      </p>
    </div>
  );
}

interface HealthCardProps { label: string; value: string; ok: boolean }
function HealthCard({ label, value, ok }: HealthCardProps) {
  return (
    <div className={`p-4 rounded-xl border ${ok
      ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
    }`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-semibold ${ok ? 'text-green-800 dark:text-green-200' : 'text-amber-800 dark:text-amber-200'}`}>
        {value}
      </p>
    </div>
  );
}
