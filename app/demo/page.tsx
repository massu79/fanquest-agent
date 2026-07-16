import { DemoScript } from "@/components/DemoScript";
import { InjectiveTechPanel } from "@/components/InjectiveTechPanel";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">Judge-ready showcase</p>
        <h1 className="mt-2 text-4xl font-black text-white sm:text-5xl">From sign-in to reward wallet in under 2 minutes</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Create a fan identity, connect to Injective Testnet, predict, reveal, claim, withdraw, and share. Live World Cup results and an optional live Injective claim receipt, with a deterministic review fallback.
        </p>
      </div>
      <DemoScript />
      <div className="mt-6">
        <InjectiveTechPanel unlocked />
      </div>
    </main>
  );
}
