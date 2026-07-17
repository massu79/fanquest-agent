"use client";

import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ConfettiLayer } from "./ConfettiLayer";
import { GlowBurst } from "./GlowBurst";
import { GlowButton } from "./GlowButton";
import { HypeBadge } from "./HypeBadge";
import { RewardCard } from "./RewardCard";
import { calculatePoints, demoSubmissions, generateQuests, type FanSubmission } from "@/lib/quests";
import { mockMatches, type WorldCupFeed, type WorldCupMatch } from "@/lib/worldcup-data";
import { connectInjectiveWallet, INJECTIVE_EVM_TESTNET, readWallet, submitClaimReceipt, type ClaimReceipt, type Eip1193Provider } from "@/lib/injective-evm";

const stepLabels = ["Account", "Wallet", "Faucet", "Match", "Quest", "Predict", "Result", "Reveal", "Rank", "Claim", "Withdraw", "Share"];
const reviewWalletAddress = "0xFaa0000000000000000000000000000000002026";
const playerOptions: Record<string, string[]> = { m6: ["Valverde", "Nunez", "Pedri"], m4: ["Messi", "Musiala", "Martinez"], m3: ["Mane", "Mbappe", "Mendy"] };

function resultFor(match: WorldCupMatch): WorldCupMatch {
  return match.id === "m3" ? { ...match, status: "finished", score: { home: 1, away: 2 }, winner: "Senegal", firstScoringTeam: "Senegal", liveEvent: "Full time: Senegal hold on for a famous win" } : match;
}

const fallbackDemoMatches = mockMatches.filter((match) => ["m6", "m4", "m3"].includes(match.id)).map(resultFor);

function pickDemoMatches(matches: WorldCupMatch[]) {
  const finished = matches.filter((match) => match.status === "finished").sort((a, b) => b.kickoff.localeCompare(a.kickoff));
  const remaining = matches.filter((match) => match.status !== "finished").sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  return [...finished, ...remaining].slice(0, 3);
}

function buildDemoXPost(match: WorldCupMatch, fan: string, points: number, badge: string, receipt: ClaimReceipt | null) {
  const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL ?? "https://fanquest-agent.vercel.app/demo";
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/massu79/fanquest-agent";
  const claimLine = receipt
    ? `recorded a live Injective Testnet claim receipt (${receipt.transactionHash.slice(0, 10)}...)`
    : "unlocked a 0.75 test INJ demo reward";
  return `FanQuest Agent turns the World Cup fan engagement problem into a shared onchain moment.\n\nI completed ${match.homeTeam} vs ${match.awayTeam}, revealed "${badge}", ${claimLine}, and earned ${points} points as ${fan}.\n\nPredict -> Compete -> Reveal -> Rank -> Claim -> Share, powered by Injective.\n\nBuilt with live World Cup results, ${receipt ? "a confirmed Injective Testnet receipt" : "live Injective network reads and a receipt-ready MetaMask flow"}, x402/CCTP/MCP prototypes, and an Agent Skills workflow.\n\nDemo: ${demoUrl}\nGitHub: ${githubUrl}\n\n@injective @NinjaLabsHQ @NinjaLabsCN\n#InjectiveGlobalCupHackathon`;
}

export function DemoScript() {
  const [feed, setFeed] = useState<WorldCupFeed>({ matches: fallbackDemoMatches, source: "deterministic fallback", sourceUrl: "", fetchedAt: new Date(0).toISOString(), live: false });
  const matches = feed.live ? pickDemoMatches(feed.matches) : fallbackDemoMatches;
  const [step, setStep] = useState(0);
  const [matchId, setMatchId] = useState("m6");
  const [displayName, setDisplayName] = useState("Aiko");
  const [winnerPrediction, setWinnerPrediction] = useState("Uruguay");
  const [firstScoringTeam, setFirstScoringTeam] = useState("Spain");
  const [playerOfMatch, setPlayerOfMatch] = useState("Valverde");
  const [supportComment, setSupportComment] = useState("Comeback energy only.");
  const [simulationStage, setSimulationStage] = useState(0);
  const [rewardOpened, setRewardOpened] = useState(false);
  const [copied, setCopied] = useState(false);
  const [networkProof, setNetworkProof] = useState<{ live: boolean; chainId: string; blockHeight: string | null }>({ live: false, chainId: "injective-888", blockHeight: null });
  const [walletMode, setWalletMode] = useState<"unconnected" | "live" | "review">("unconnected");
  const [provider, setProvider] = useState<Eip1193Provider | null>(null);
  const [walletAddress, setWalletAddress] = useState("Wallet not connected");
  const [walletBalance, setWalletBalance] = useState("0.0000");
  const [walletBusy, setWalletBusy] = useState(false);
  const [walletMessage, setWalletMessage] = useState("");
  const [claimState, setClaimState] = useState<"idle" | "signing" | "confirming" | "confirmed" | "failed">("idle");
  const [claimError, setClaimError] = useState("");
  const [claimReceipt, setClaimReceipt] = useState<ClaimReceipt | null>(null);
  const [pendingClaimHash, setPendingClaimHash] = useState("");
  const match = matches.find((item) => item.id === matchId) ?? matches[0] ?? fallbackDemoMatches[0];
  const submission: FanSubmission = { displayName: displayName.trim() || "Fan", winnerPrediction, firstScoringTeam, playerOfMatch, supportComment, checkedIn: true };
  const currentFan = calculatePoints(match, submission);
  const otherFans = demoSubmissions.filter((fan) => fan.displayName !== currentFan.displayName).map((fan) => calculatePoints(match, fan));
  const leaderboard = [...otherFans, currentFan].sort((a, b) => b.points - a.points || a.displayName.localeCompare(b.displayName));
  const rank = leaderboard.findIndex((fan) => fan.id === currentFan.id) + 1;
  const badge = currentFan.points >= 70 ? "Underdog Oracle" : currentFan.points >= 50 ? "Matchday Mystic" : "Quest Contender";
  const xPost = buildDemoXPost(match, currentFan.displayName, currentFan.points, badge, claimReceipt);
  const quests = generateQuests(match).slice(0, 4);
  useEffect(() => {
    if (step !== 6) return;
    const timers = [window.setTimeout(() => setSimulationStage(1), 450), window.setTimeout(() => setSimulationStage(2), 1050), window.setTimeout(() => setSimulationStage(3), 1750)];
    return () => timers.forEach(window.clearTimeout);
  }, [step, matchId]);

  useEffect(() => {
    let active = true;
    fetch("/api/worldcup/matches")
      .then((response) => response.json())
      .then((data: WorldCupFeed) => {
        if (!active) return;
        setFeed(data);
        const recommended = pickDemoMatches(data.matches)[0];
        if (recommended) {
          setMatchId(recommended.id);
          setWinnerPrediction(recommended.winner ?? recommended.underdog);
          setFirstScoringTeam(recommended.firstScoringTeam ?? recommended.homeTeam);
          setPlayerOfMatch(playerOptions[recommended.id]?.[0] ?? "Fan MVP");
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    fetch("/api/injective/status")
      .then((response) => response.json())
      .then((data) => setNetworkProof(data))
      .catch(() => undefined);
  }, []);

  async function connectWallet() {
    setWalletBusy(true);
    setWalletMessage("");
    try {
      const connected = await connectInjectiveWallet();
      setProvider(connected.provider);
      setWalletAddress(connected.wallet.address);
      setWalletBalance(connected.wallet.balanceInj);
      setWalletMode("live");
      setWalletMessage("MetaMask connected to Injective EVM Testnet.");
      setStep(2);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Wallet connection failed";
      if (message === "NO_INJECTED_WALLET") {
        setWalletMode("review");
        setWalletAddress(reviewWalletAddress);
        setWalletBalance("0.0000");
        setWalletMessage("No injected wallet detected. Review mode keeps the guided demo moving; live Claim will be labeled simulated.");
        setStep(2);
      } else {
        setWalletMessage(message);
      }
    } finally {
      setWalletBusy(false);
    }
  }

  async function checkBalanceAndContinue() {
    setWalletBusy(true);
    try {
      if (walletMode === "live" && provider) {
        const wallet = await readWallet(provider, walletAddress);
        setWalletBalance(wallet.balanceInj);
        setWalletMessage(Number(wallet.balanceInj) > 0 ? "Live INJ balance verified." : "Balance is zero. Use the official faucet before the live Claim step.");
      } else {
        setWalletBalance("10.0000");
        setWalletMessage("Review funds loaded. These are deterministic and have no value.");
      }
      setStep(3);
    } catch (error) {
      setWalletMessage(error instanceof Error ? error.message : "Balance check failed");
    } finally {
      setWalletBusy(false);
    }
  }

  async function claimOnInjective() {
    setClaimError("");
    if (walletMode !== "live" || !provider) {
      setClaimState("confirmed");
      setStep(10);
      return;
    }
    setClaimState("signing");
    try {
      const receipt = await submitClaimReceipt(provider, walletAddress, {
        matchId: match.id,
        fan: currentFan.displayName,
        points: currentFan.points,
        reward: "0.75-demo-INJ"
      }, (hash) => {
        setPendingClaimHash(hash);
        setClaimState("confirming");
      });
      setClaimReceipt(receipt);
      setClaimState("confirmed");
      const wallet = await readWallet(provider, walletAddress);
      setWalletBalance(wallet.balanceInj);
      setStep(10);
    } catch (error) {
      setClaimState("failed");
      setClaimError(error instanceof Error ? error.message : "Claim transaction failed");
    }
  }

  function chooseMatch(nextMatch: WorldCupMatch) {
    setMatchId(nextMatch.id);
    setWinnerPrediction(nextMatch.winner ?? nextMatch.underdog);
    setFirstScoringTeam(nextMatch.firstScoringTeam ?? nextMatch.homeTeam);
    setPlayerOfMatch(playerOptions[nextMatch.id]?.[0] ?? "Fan MVP");
  }

  function restart() {
    const recommended = matches[0] ?? fallbackDemoMatches[0];
    setStep(0);
    setMatchId(recommended.id);
    setDisplayName("Aiko");
    setWinnerPrediction(recommended.winner ?? recommended.underdog);
    setFirstScoringTeam(recommended.firstScoringTeam ?? recommended.homeTeam);
    setPlayerOfMatch(playerOptions[recommended.id]?.[0] ?? "Fan MVP");
    setSupportComment("Comeback energy only.");
    setSimulationStage(0);
    setRewardOpened(false);
    setCopied(false);
    setClaimState("idle");
    setClaimError("");
    setClaimReceipt(null);
    setPendingClaimHash("");
  }

  async function copyPost() {
    try {
      await navigator.clipboard.writeText(xPost);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = xPost;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
  }

  return <div className="mx-auto max-w-5xl">
    <section className="glass-panel sticky top-20 z-20 rounded-lg p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-4"><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">Guided testnet journey</p><p className="text-xs font-bold text-slate-400">Step {step + 1} of {stepLabels.length}</p></div>
      <div className="flex items-start gap-1">{stepLabels.map((label, index) => <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-2"><div className={`h-1.5 w-full rounded-full ${index <= step ? "bg-gradient-to-r from-cyan-300 to-fuchsia-500" : "bg-white/10"}`} /><span className={`hidden text-center text-[10px] font-bold lg:block ${index === step ? "text-white" : "text-slate-500"}`}>{label}</span><span className={`text-[10px] font-black lg:hidden ${index === step ? "text-cyan-200" : "text-slate-600"}`}>{index + 1}</span></div>)}</div>
    </section>

    <div key={step} className="demo-step-enter mt-6">
      {step === 0 && <DemoPanel eyebrow="Step 1 / Create Account" title="Your fan identity starts here" description="Use a demo Google identity to create your FanQuest profile. No real Google data is requested.">
        <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-black/30 p-5"><div className="flex items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full bg-white text-xl font-black text-blue-600">G</span><div><p className="font-black text-white">Google demo account</p><p className="text-sm text-slate-400">aiko.demo@example.com</p></div></div><label className="mt-5 block"><span className="text-sm font-bold text-slate-200">Fan display name</span><input className="focus-ring mt-2 w-full rounded border border-white/15 bg-slate-950 px-4 py-3 text-white" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={20} /></label></div>
        <PrimaryAction disabled={!displayName.trim()} onClick={() => setStep(1)}>Continue with Google</PrimaryAction>
      </DemoPanel>}

      {step === 1 && <DemoPanel eyebrow="Step 2 / Connect Wallet" title={`Welcome, ${displayName}`} description="Connect MetaMask to Injective EVM Testnet. The app never sees or stores your private key.">
        <WalletCard balance={`${walletBalance} INJ`} status={walletMode === "live" ? "Live wallet connected" : "Ready to connect"} address={walletAddress} />
        {walletMessage && <StatusNote tone={walletMode === "live" ? "success" : "neutral"}>{walletMessage}</StatusNote>}
        <PrimaryAction disabled={walletBusy} onClick={connectWallet}>{walletBusy ? "Connecting..." : "Connect MetaMask"}</PrimaryAction>
      </DemoPanel>}
      {step === 2 && <DemoPanel eyebrow="Step 3 / Testnet Faucet" title="Verify INJ for testnet gas" description="Your live wallet balance is read from Injective EVM Testnet. Review mode uses clearly labeled deterministic funds.">
        <WalletCard balance={`${walletBalance} INJ`} status={walletMode === "live" ? "Injective EVM Testnet" : "Review mode"} address={walletAddress} />
        {walletMode === "live" ? <div className="mt-4 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4"><p className="font-black text-white">Need test INJ?</p><p className="mt-1 text-sm text-slate-300">The live Claim receipt needs a small amount of INJ for gas.</p><a className="focus-ring mt-3 inline-flex rounded border border-cyan-200/30 px-3 py-2 text-sm font-black text-cyan-100 hover:bg-cyan-200/10" href={INJECTIVE_EVM_TESTNET.faucetUrl} target="_blank" rel="noreferrer">Open official Injective faucet</a></div> : <div className="mt-4 rounded-lg border border-fuchsia-300/20 bg-fuchsia-300/10 p-4"><p className="font-black text-white">Review funds</p><p className="mt-1 text-sm text-slate-300">Continue with 10.00 deterministic test INJ. No transaction will be presented as live.</p></div>}
        {walletMessage && <StatusNote tone={walletMode === "live" && Number(walletBalance) > 0 ? "success" : "neutral"}>{walletMessage}</StatusNote>}
        <PrimaryAction disabled={walletBusy} onClick={checkBalanceAndContinue}>{walletBusy ? "Checking balance..." : walletMode === "live" ? "Check Balance & Continue" : "Load Review Funds"}</PrimaryAction>
      </DemoPanel>}      {step === 3 && <DemoPanel eyebrow="Step 4 / Pick Match" title="Choose a real World Cup moment" description={feed.live ? "Recent results and the next fixture are loaded from the ESPN public World Cup scoreboard." : "The live provider is unavailable, so this run uses the deterministic fallback dataset."}>
        <WalletCard balance={`${walletBalance} INJ`} status={walletMode === "live" ? "Live balance verified" : "Review funds loaded"} address={walletAddress} />
        <DataProof feed={feed} />
        <div className="mt-5 grid gap-3 md:grid-cols-3">{matches.map((item, index) => <button key={item.id} type="button" onClick={() => chooseMatch(item)} className={`focus-ring relative rounded-lg border p-4 text-left transition hover:-translate-y-0.5 ${item.id === matchId ? "border-cyan-300 bg-cyan-300/10 shadow-[0_0_40px_rgba(34,211,238,0.16)]" : "border-white/10 bg-black/25"}`}>
          {index === 0 && <span className="absolute right-3 top-3 rounded bg-fuchsia-400/15 px-2 py-1 text-[10px] font-black uppercase text-fuchsia-200">Recommended</span>}<p className="text-xs font-black uppercase text-slate-400">{item.round}</p><p className="mt-5 text-xl font-black text-white">{item.homeTeam}</p><p className="text-sm font-bold text-slate-500">vs</p><p className="text-xl font-black text-white">{item.awayTeam}</p><p className="mt-3 text-sm font-black text-cyan-100">{item.status === "finished" ? `FT ${item.score.home} - ${item.score.away}` : item.liveEvent}</p><p className="mt-2 text-xs text-slate-400">{item.venue}</p></button>)}</div>
        <PrimaryAction onClick={() => setStep(4)}>Start Match Quest</PrimaryAction>
      </DemoPanel>}
      {step === 4 && <DemoPanel eyebrow="Step 5 / Join Quest" title={`${match.homeTeam} vs ${match.awayTeam}`} description="Enter the fan room. Your connected testnet wallet is eligible for the 2,500 point reward pool.">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]"><div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-5"><p className="text-xs font-black uppercase text-cyan-200">Reward pool</p><p className="mt-2 text-4xl font-black text-white">2,500 pts</p><p className="mt-2 text-sm text-slate-300">Claimable reward: up to 0.75 test INJ</p></div><div className="grid gap-2 sm:grid-cols-2">{quests.map((quest) => <div key={quest.id} className="rounded border border-white/10 bg-black/25 p-3"><p className="font-black text-white">{quest.title}</p><p className="mt-1 text-xs text-slate-400">Up to +{quest.basePoints} points</p></div>)}</div></div>
        <label className="mt-5 block"><span className="text-sm font-bold text-slate-200">Display name</span><input className="focus-ring mt-2 w-full rounded border border-white/15 bg-black/30 px-4 py-3 text-white" value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={20} /></label>
        <PrimaryAction disabled={!displayName.trim()} onClick={() => setStep(5)}>Join as Fan</PrimaryAction>
      </DemoPanel>}

      {step === 5 && <DemoPanel eyebrow="Step 6 / Lock Predictions" title="Call the match before kickoff" description="The recommended picks are prefilled so judges can complete the full loop quickly.">
        <div className="grid gap-5 md:grid-cols-2"><ChoiceGroup label="Winner prediction" value={winnerPrediction} options={[match.homeTeam, match.awayTeam]} onChange={setWinnerPrediction} /><ChoiceGroup label="First scoring team" value={firstScoringTeam} options={[match.homeTeam, match.awayTeam]} onChange={setFirstScoringTeam} /><ChoiceGroup label="Player of the match" value={playerOfMatch} options={playerOptions[match.id] ?? ["Fan MVP"]} onChange={setPlayerOfMatch} /><label><span className="text-sm font-bold text-slate-200">Support comment</span><textarea className="focus-ring mt-2 min-h-28 w-full resize-none rounded border border-white/15 bg-black/30 px-4 py-3 text-white" value={supportComment} onChange={(event) => setSupportComment(event.target.value)} maxLength={100} /></label></div>
        <PrimaryAction disabled={!supportComment.trim()} onClick={() => setStep(6)}>Lock My Predictions</PrimaryAction>
      </DemoPanel>}

      {step === 6 && <DemoPanel eyebrow="Step 7 / Resolve Result" title="The match resolves in seconds" description={feed.live && match.id.startsWith("espn-") && match.status === "finished" ? "Replaying a completed World Cup result fetched from the live scoreboard." : "Replaying a deterministic result so the judge can complete the journey."}>
        <DataProof feed={feed} compact />
        <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-white/10 bg-black/30 p-5"><div className="flex items-center justify-between gap-3"><p className="font-black text-white">{match.homeTeam} <span className="text-slate-500">vs</span> {match.awayTeam}</p><span className={`rounded px-2 py-1 text-xs font-black uppercase ${simulationStage === 3 ? "bg-fuchsia-400/15 text-fuchsia-200" : "bg-rose-400/15 text-rose-200"}`}>{simulationStage === 3 ? "Full time" : "Resolving"}</span></div><div className="mt-5 space-y-3"><MatchEvent active={simulationStage >= 1} time="DATA" text={`Match record loaded from ${feed.source}`} /><MatchEvent active={simulationStage >= 2} time="WIN" text={`${match.winner ?? winnerPrediction} confirmed as the quest outcome`} /><MatchEvent active={simulationStage >= 3} time="FT" text={`Final whistle: ${match.homeTeam} ${match.score.home} - ${match.score.away} ${match.awayTeam}`} /></div>{simulationStage === 3 ? <p className="reward-pop mt-5 rounded bg-cyan-300/10 p-3 text-center font-black text-cyan-100">Predictions calculated: {currentFan.points} points earned</p> : <p className="mt-5 text-center text-sm text-slate-400">Resolving match events...</p>}</div>
        <PrimaryAction disabled={simulationStage < 3} onClick={() => { setStep(7); setRewardOpened(false); }}>Reveal My Reward</PrimaryAction>
      </DemoPanel>}
      {step === 7 && <DemoPanel eyebrow="Step 8 / Reward Reveal" title="Your fan moment is ready" description="Open the box. This is the emotional peak of the FanQuest loop.">
        <div className="relative mx-auto min-h-96 max-w-xl overflow-hidden rounded-lg border border-cyan-300/20 bg-slate-950/80 p-5">{rewardOpened && <><ConfettiLayer /><GlowBurst /></>}<div className="relative z-10 grid min-h-80 place-items-center">{rewardOpened ? <RewardCard title={badge} points={currentFan.points} badge="0.75 test INJ demo reward" message={`Bonus type: ${winnerPrediction === match.underdog ? "Underdog Alpha" : "Perfect Pick"}. Your prediction is now locked into FanQuest history.`} intensity="legendary" /> : <button type="button" onClick={() => setRewardOpened(true)} className="focus-ring gradient-border grid h-56 w-56 place-items-center rounded-lg bg-gradient-to-br from-slate-900 via-cyan-950 to-fuchsia-950 text-center shadow-[0_0_100px_rgba(34,211,238,0.3)]"><span><span className="block text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Reward Box</span><span className="mt-3 block text-2xl font-black text-white">Open Box</span><span className="mt-2 block text-sm text-slate-300">Tap to reveal</span></span></button>}</div></div>
        {rewardOpened && <PrimaryAction onClick={() => setStep(8)}>Show Leaderboard</PrimaryAction>}
      </DemoPanel>}

      {step === 8 && <DemoPanel eyebrow="Step 9 / Leaderboard" title={`You are ranked #${rank}`} description="Your completed quest is now reflected in the community standings.">
        <div className="mx-auto max-w-2xl space-y-3">{leaderboard.map((fan, index) => { const isCurrent = fan.id === currentFan.id; return <div key={fan.id} className={`flex items-center gap-4 rounded-lg border p-4 ${isCurrent ? "reward-pop border-cyan-300 bg-cyan-300/10 shadow-[0_0_36px_rgba(34,211,238,0.15)]" : "border-white/10 bg-black/25"}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded font-black ${isCurrent ? "bg-gradient-to-br from-cyan-300 to-fuchsia-500 text-white" : "bg-white/10 text-slate-300"}`}>{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate font-black text-white">{fan.displayName}{isCurrent ? " (You)" : ""}</p><p className="truncate text-xs text-slate-400">{isCurrent ? badge : fan.breakdown[0]}</p></div><p className={`text-2xl font-black ${isCurrent ? "count-up text-cyan-200" : "text-white"}`}>{fan.points}</p></div>; })}</div>
        <PrimaryAction onClick={() => setStep(9)}>Create Claim Receipt</PrimaryAction>
      </DemoPanel>}

      {step === 9 && <DemoPanel eyebrow="Step 10 / Claim Reward" title={walletMode === "live" ? "Record the claim on Injective Testnet" : "Review the claim interaction"} description={walletMode === "live" ? "MetaMask signs a zero-value transaction carrying the FanQuest claim memo. The receipt is real; the 0.75 INJ reward amount remains demo credit." : "No injected wallet is available. This step is simulated and will not produce a transaction hash."}>
        <TransactionCard title={walletMode === "live" ? "FanQuest Onchain Claim Receipt" : "FanQuest Review Claim"} amount={walletMode === "live" ? "0 INJ proof" : "+0.75 demo INJ"} from={walletMode === "live" ? walletAddress : "FanQuest demo vault"} to={walletAddress} fee={walletMode === "live" ? "Estimated by MetaMask" : "Simulated"} />
        {pendingClaimHash && !claimReceipt && <StatusNote tone="neutral">Submitted: {pendingClaimHash.slice(0, 12)}... Waiting for Injective confirmation.</StatusNote>}
        {claimError && <StatusNote tone="error">{claimError}</StatusNote>}
        <PrimaryAction disabled={claimState === "signing" || claimState === "confirming"} onClick={claimOnInjective}>{claimState === "signing" ? "Confirm in MetaMask..." : claimState === "confirming" ? "Waiting for confirmation..." : claimState === "failed" ? "Retry Claim Receipt" : walletMode === "live" ? "Sign & Submit Claim" : "Confirm Review Claim"}</PrimaryAction>
      </DemoPanel>}
      {step === 10 && <DemoPanel eyebrow="Step 11 / Withdraw" title={claimReceipt ? "Claim confirmed on Injective Testnet" : "Review claim confirmed"} description={claimReceipt ? "The live receipt proves the claim action. Reward payout and the 0.75 INJ withdrawal remain demo accounting until a funded reward contract is deployed." : "Review mode demonstrates the payout boundary without submitting a transaction. A funded reward contract is the next milestone."}>
        <div className="grid gap-4 md:grid-cols-2"><Metric label="Demo claimable credit" value="0.75 INJ" tone="fuchsia" /><Metric label={walletMode === "live" ? "Live wallet balance" : "Review wallet balance"} value={`${walletBalance} INJ`} tone="cyan" /></div>
        {claimReceipt ? <ReceiptCard receipt={claimReceipt} /> : <StatusNote tone="neutral">Review mode: no transaction was submitted and no explorer proof is shown.</StatusNote>}
        <TransactionCard title="Reward payout boundary" amount="0.75 demo INJ" from="FanQuest reward contract (next milestone)" to={walletAddress} fee="Not submitted" />
        <PrimaryAction onClick={() => setStep(11)}>Complete Wallet View</PrimaryAction>
      </DemoPanel>}
      {step === 11 && <DemoPanel eyebrow="Step 12 / Share" title="The fan journey is share-ready" description={claimReceipt ? "A confirmed Injective Testnet receipt and live INJ balance are now attached to the story." : "Review mode completed the UX loop without claiming a live transaction."}>
        <WalletCard balance={`${walletMode === "review" ? "10.7500" : walletBalance} INJ`} status={claimReceipt ? "Claim receipt confirmed" : "Review journey complete"} address={walletAddress} />
        {claimReceipt && <ReceiptCard receipt={claimReceipt} />}
        <HackathonProof network={networkProof} feed={feed} receipt={claimReceipt} />
        <pre className="mx-auto mt-5 max-w-3xl whitespace-pre-wrap rounded-lg border border-white/10 bg-black/40 p-4 text-sm leading-6 text-slate-100">{xPost}</pre><div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><GlowButton type="button" onClick={copyPost}>{copied ? "Copied to Clipboard" : "Copy X Post"}</GlowButton><GlowButton type="button" tone="secondary" onClick={restart}>Restart Demo</GlowButton></div>
      </DemoPanel>}    </div>
  </div>;
}

function DemoPanel({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <section className="gradient-border relative rounded-lg bg-white/[0.06] p-5 shadow-panel sm:p-7"><div className="mb-6"><HypeBadge>{eyebrow}</HypeBadge><h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">{title}</h2><p className="mt-2 max-w-2xl text-slate-300">{description}</p></div>{children}</section>;
}

function WalletCard({ balance, status, address }: { balance: string; status: string; address: string }) {
  const amount = balance.replace(" INJ", "");
  return <div className="mx-auto max-w-2xl rounded-lg border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 to-fuchsia-400/10 p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wide text-cyan-200">Injective Testnet Wallet</p><p className="mt-2 break-all text-sm text-slate-300">{address}</p></div><span className="rounded bg-emerald-300/10 px-2 py-1 text-xs font-black text-emerald-200">{status}</span></div><div className="mt-5 rounded-lg border border-white/10 bg-black/25 p-4"><div className="flex items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-fuchsia-500 text-sm font-black text-white">INJ</span><div className="min-w-0 flex-1"><p className="font-black text-white">Injective</p><p className="text-xs text-slate-400">Native token / Injective Testnet</p></div><div className="text-right"><p className="text-2xl font-black text-white">{amount}</p><p className="text-xs font-bold text-cyan-200">INJ available</p></div></div></div><div className="mt-3 flex items-center justify-between text-xs"><span className="text-slate-500">Portfolio balance</span><span className="font-bold text-slate-300">{balance}</span></div><p className="mt-2 text-xs text-slate-500">Testnet or review funds only. No real-world value.</p></div>;
}
function StatusNote({ tone, children }: { tone: "success" | "neutral" | "error"; children: ReactNode }) {
  const styles = tone === "success" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100" : tone === "error" ? "border-rose-300/20 bg-rose-300/10 text-rose-100" : "border-white/10 bg-white/[0.04] text-slate-300";
  return <p className={`mx-auto mt-4 max-w-2xl rounded border p-3 text-sm ${styles}`}>{children}</p>;
}

function DataProof({ feed, compact = false }: { feed: WorldCupFeed; compact?: boolean }) {
  return <div className={`mx-auto rounded border p-3 ${compact ? "max-w-2xl" : "mt-4 max-w-none"} ${feed.live ? "border-emerald-300/20 bg-emerald-300/10" : "border-amber-300/20 bg-amber-300/10"}`}><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-sm font-black text-white">{feed.live ? "Live World Cup data" : "Deterministic fallback"}</p><p className="mt-1 text-xs text-slate-300">{feed.source} / updated {new Date(feed.fetchedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p></div>{feed.sourceUrl ? <a className="focus-ring rounded px-2 py-1 text-xs font-black text-cyan-100 underline decoration-cyan-300/40" href={feed.sourceUrl} target="_blank" rel="noreferrer">View source</a> : null}</div>{feed.fallbackReason && <p className="mt-2 text-xs text-amber-100">Fallback reason: {feed.fallbackReason}</p>}</div>;
}

function ReceiptCard({ receipt }: { receipt: ClaimReceipt }) {
  return <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-200">Confirmed on Injective EVM Testnet</p><p className="mt-2 break-all font-mono text-sm text-white">{receipt.transactionHash}</p></div><a className="focus-ring rounded border border-emerald-200/30 px-3 py-2 text-sm font-black text-emerald-100 hover:bg-emerald-200/10" href={receipt.explorerUrl} target="_blank" rel="noreferrer">Open Explorer</a></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><p className="text-slate-500">Block</p><p className="font-black text-white">{receipt.blockNumber}</p></div><div><p className="text-slate-500">Gas used</p><p className="font-black text-white">{receipt.gasUsed}</p></div></div></div>;
}

function HackathonProof({ network, feed, receipt }: { network: { live: boolean; chainId: string; blockHeight: string | null }; feed: WorldCupFeed; receipt: ClaimReceipt | null }) {
  const proofs = [
    ["x402", "Prototype", "Premium match insight payment boundary"],
    ["CCTP", "Architecture", "Sponsor USDC reward routing documented"],
    ["MCP", "Prototype", "Wallet and claim query contract modeled"],
    ["Agent Skill", "Implemented", "Quest, scoring, and share workflow"]
  ];
  return <section className="mx-auto mt-5 max-w-3xl rounded-lg border border-white/10 bg-black/25 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-200">Hackathon evidence</p><h3 className="mt-1 font-black text-white">Live proof and integration status</h3></div><span className={`rounded px-2 py-1 text-xs font-black ${receipt ? "bg-emerald-300/10 text-emerald-100" : "bg-white/10 text-slate-300"}`}>{receipt ? "LIVE TX CONFIRMED" : "REVIEW MODE"}</span></div><div className="mt-4 grid gap-2 sm:grid-cols-3"><Evidence label="World Cup feed" value={feed.live ? "LIVE" : "FALLBACK"} detail={feed.source} live={feed.live} /><Evidence label="Injective LCD" value={network.live ? "LIVE" : "FALLBACK"} detail={`${network.chainId}${network.blockHeight ? ` / ${network.blockHeight}` : ""}`} live={network.live} /><Evidence label="Claim receipt" value={receipt ? "CONFIRMED" : "NOT SENT"} detail={receipt ? receipt.transactionHash.slice(0, 12) : "Requires MetaMask"} live={Boolean(receipt)} /></div><div className="mt-4 grid gap-2 sm:grid-cols-2">{proofs.map(([name, status, detail]) => <div key={name} className="rounded border border-white/10 bg-slate-950/70 p-3"><div className="flex items-center justify-between gap-2"><p className="font-black text-cyan-100">{name}</p><span className="text-xs font-black text-slate-300">{status}</span></div><p className="mt-2 text-sm text-slate-300">{detail}</p></div>)}</div></section>;
}

function Evidence({ label, value, detail, live }: { label: string; value: string; detail: string; live: boolean }) {
  return <div className={`rounded border p-3 ${live ? "border-emerald-300/20 bg-emerald-300/10" : "border-white/10 bg-white/[0.03]"}`}><p className="text-xs text-slate-400">{label}</p><p className={`mt-1 text-sm font-black ${live ? "text-emerald-100" : "text-slate-200"}`}>{value}</p><p className="mt-1 truncate text-xs text-slate-500">{detail}</p></div>;
}function TransactionCard({ title, amount, from, to, fee }: { title: string; amount: string; from: string; to: string; fee: string }) {
  return <div className="mx-auto mt-4 max-w-2xl rounded-lg border border-white/10 bg-black/30 p-5"><div className="flex items-center justify-between gap-4"><p className="font-black text-white">{title}</p><p className="text-2xl font-black text-cyan-200">{amount}</p></div><dl className="mt-5 grid gap-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-500">From</dt><dd className="break-all text-right text-slate-200">{from}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">To</dt><dd className="break-all text-right text-slate-200">{to}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Network fee</dt><dd className="text-right text-slate-200">{fee}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-500">Network</dt><dd className="font-bold text-fuchsia-200">Injective Testnet</dd></div></dl></div>;
}
function Metric({ label, value, tone }: { label: string; value: string; tone: "cyan" | "fuchsia" }) {
  return <div className={`rounded-lg border p-5 ${tone === "cyan" ? "border-cyan-300/20 bg-cyan-300/10" : "border-fuchsia-300/20 bg-fuchsia-300/10"}`}><p className="text-sm text-slate-300">{label}</p><p className="mt-2 text-3xl font-black text-white">{value}</p></div>;
}
function PrimaryAction({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <div className="mt-7 flex justify-end"><GlowButton {...props}>{children}</GlowButton></div>; }
function ChoiceGroup({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <fieldset><legend className="text-sm font-bold text-slate-200">{label}</legend><div className="mt-2 grid grid-cols-2 gap-2">{options.map((option) => <button key={option} type="button" onClick={() => onChange(option)} className={`focus-ring min-h-12 rounded border px-3 py-2 text-sm font-black ${value === option ? "border-cyan-300 bg-cyan-300/15 text-white" : "border-white/10 bg-black/25 text-slate-300"}`}>{option}</button>)}</div></fieldset>; }
function MatchEvent({ active, time, text }: { active: boolean; time: string; text: string }) { return <div className={`flex items-center gap-3 rounded border p-3 transition-all duration-500 ${active ? "translate-x-0 border-cyan-300/20 bg-cyan-300/10 opacity-100" : "translate-x-3 border-white/5 bg-white/[0.02] opacity-30"}`}><span className="w-9 shrink-0 font-black text-cyan-200">{time}</span><p className="font-bold text-white">{text}</p></div>; }
