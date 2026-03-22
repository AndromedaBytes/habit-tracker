import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MeshBackground } from "../components/shared/MeshBackground";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const navigate = useNavigate();
  const { sendMagicLink, session } = useAuth();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) navigate("/");
  }, [navigate, session]);

  return (
    <div className="relative min-h-screen bg-bg-0 text-tp">
      <MeshBackground />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-glass-b bg-glass p-7 backdrop-blur-xl">
          <div className="mb-1 bg-gradient-to-br from-white to-ab bg-clip-text text-center font-serif text-5xl text-transparent">Sanctuary</div>
          <div className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ts">Magic Link Login</div>

          <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-ts">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-serif text-sm text-tp outline-none"
          />

          <button
            type="button"
            disabled={sending || !email}
            onClick={async () => {
              setError("");
              setMessage("");
              setSending(true);
              try {
                await sendMagicLink(email);
                setMessage("Magic link sent. Check your inbox.");
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to send magic link");
              } finally {
                setSending(false);
              }
            }}
            className="w-full rounded-lg border border-ab/30 bg-gradient-to-br from-ai/40 to-ab/30 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-white disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Magic Link"}
          </button>

          {message ? <div className="mt-3 text-center font-serif text-sm italic text-ag">{message}</div> : null}
          {error ? <div className="mt-3 text-center font-serif text-sm italic text-abad">{error}</div> : null}
        </div>
      </div>
    </div>
  );
};
