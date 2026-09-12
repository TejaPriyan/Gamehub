import { useRouteError } from "react-router";
import { useEffect, useRef } from "react";

export default function ErrorPage() {
  const ref = useRef<HTMLDivElement>(null);
  const error = useRouteError() as Error;

  useEffect(() => {
    if (ref.current && typeof window !== 'undefined') {
      try {
        const ErrorOverlay = window.customElements?.get?.('vite-error-overlay');
        if (typeof ErrorOverlay === 'function') {
          ref.current.appendChild(new ErrorOverlay(error, 'runtime'));
        }
      } catch {}
    }
  }, [error]);

  return (
    <div ref={ref} className="min-h-screen bg-[#0a0a1a] text-cyan-400 p-8 flex flex-col items-center justify-center">
      <div className="max-w-md text-center p-6 rounded-2xl bg-white/5 border border-cyan-500/30">
        <h2 className="text-xl font-bold font-mono text-cyan-400 mb-2">SYSTEM RECOVERY</h2>
        <p className="text-sm text-gray-400 font-mono mb-4">An unexpected interface event occurred.</p>
        <button
          onClick={() => { window.location.href = '/'; }}
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-black font-bold font-mono text-xs uppercase"
        >
          Return to Arena
        </button>
      </div>
    </div>
  );
}
