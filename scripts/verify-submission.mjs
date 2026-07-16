const baseUrl = (process.env.FANQUEST_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const allowFallback = process.env.FANQUEST_ALLOW_FALLBACK === "1";

async function fetchChecked(path) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { "user-agent": "FanQuest-Submission-Verifier/1.0" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}`);
  }
  return response;
}

async function verifyPage(path, marker) {
  const response = await fetchChecked(path);
  const html = await response.text();
  if (!html.includes(marker)) {
    throw new Error(`${path} is missing marker: ${marker}`);
  }
  return { path, status: response.status, marker };
}

async function main() {
  const pages = await Promise.all([
    verifyPage("/", "FanQuest Agent"),
    verifyPage("/dashboard", "The match is live. The quest is on."),
    verifyPage("/demo", "From sign-in to reward wallet in under 2 minutes"),
    verifyPage("/docs", "How FanQuest Agent works"),
  ]);

  const worldCup = await (await fetchChecked("/api/worldcup/matches")).json();
  if (!Array.isArray(worldCup.matches) || worldCup.matches.length < 2) {
    throw new Error("World Cup feed returned fewer than two matches");
  }
  if (!worldCup.live && !allowFallback) {
    throw new Error(`World Cup feed is in fallback mode: ${worldCup.fallbackReason ?? "unknown reason"}`);
  }

  const injective = await (await fetchChecked("/api/injective/status")).json();
  if (!injective.live && !allowFallback) {
    throw new Error("Injective status is not live");
  }
  if (injective.chainId !== "injective-888" || !injective.blockHeight) {
    throw new Error("Injective status is missing the expected testnet chain or block height");
  }

  console.log(JSON.stringify({
    ok: true,
    baseUrl,
    checkedAt: new Date().toISOString(),
    pages,
    worldCup: {
      live: worldCup.live,
      source: worldCup.source,
      matches: worldCup.matches.length,
      fetchedAt: worldCup.fetchedAt,
    },
    injective: {
      live: injective.live,
      chainId: injective.chainId,
      blockHeight: injective.blockHeight,
    },
  }, null, 2));
}

main().catch((error) => {
  console.error(`Submission verification failed: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
