import { mkdir, unlink, writeFile } from "node:fs/promises";
import { bech32 } from "@scure/base";
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  formatEther,
  hexToBytes,
  http,
  stringToHex
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const rpcUrl = "https://k8s.testnet.json-rpc.injective.network/";
const explorerUrl = "https://testnet.blockscout.injective.network";
const faucetUrl = "https://testnet.faucet.injective.network/";
const pollIntervalMs = 15_000;
const timeoutMinutes = Number(process.env.FANQUEST_FAUCET_TIMEOUT_MINUTES ?? 15);
const dryRun = process.env.FANQUEST_DRY_RUN === "1";

const chain = defineChain({
  id: 1439,
  name: "Injective EVM Testnet",
  nativeCurrency: { name: "Injective", symbol: "INJ", decimals: 18 },
  rpcUrls: { default: { http: [rpcUrl] } },
  blockExplorers: { default: { name: "Blockscout", url: explorerUrl } },
  testnet: true
});

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);
const injectiveAddress = bech32.encode("inj", bech32.toWords(hexToBytes(account.address)));
const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });
const walletClient = createWalletClient({ account, chain, transport: http(rpcUrl) });

function log(message) {
  process.stdout.write(`[fanquest-proof] ${message}\n`);
}

async function delay(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function saveEvidence(filename, evidence) {
  await mkdir("docs/evidence", { recursive: true });
  await writeFile(`docs/evidence/${filename}`, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
}

const chainId = await publicClient.getChainId();
log(`RPC chain ID: ${chainId}`);
log(`Ephemeral public EVM address: ${account.address}`);
log(`Mapped Injective address: ${injectiveAddress}`);
log("The ephemeral private key remains in memory and is never printed or written.");

if (dryRun) {
  const balance = await publicClient.getBalance({ address: account.address });
  log(`Dry run complete. Balance: ${formatEther(balance)} INJ`);
} else {
log(`Open ${faucetUrl} and fund the mapped Injective address shown above.`);
log("Complete the faucet captcha manually. This process will keep the ephemeral key in memory while it waits.");
const startedAt = new Date();
const deadline = Date.now() + timeoutMinutes * 60_000;
await saveEvidence("injective-testnet-faucet-pending.json", {
  status: "awaiting-faucet",
  chainId,
  evmAddress: account.address,
  injectiveAddress,
  requestedAt: startedAt.toISOString(),
  timeoutMinutes,
  note: "No secret is stored; this address can only be used while the verification process is running."
});
let balance = 0n;
while (Date.now() < deadline) {
  balance = await publicClient.getBalance({ address: account.address });
  log(`Waiting for faucet: ${formatEther(balance)} INJ`);
  if (balance > 0n) break;
  await delay(pollIntervalMs);
}

if (balance === 0n) {
  await saveEvidence("injective-testnet-faucet-pending.json", {
    status: "faucet-timeout",
    chainId,
    evmAddress: account.address,
    injectiveAddress,
    requestedAt: startedAt.toISOString(),
    timeoutMinutes,
    note: "No secret is stored; this address cannot be used after the process exits."
  });
  throw new Error(`Faucet did not fund the ephemeral wallet within ${timeoutMinutes} minutes`);
}

const memo = "FanQuest|claim|submission-proof|Aiko|65|0.75-demo-INJ";
const transactionHash = await walletClient.sendTransaction({
  account,
  to: account.address,
  value: 0n,
  data: stringToHex(memo)
});
log(`Claim submitted: ${transactionHash}`);

const receipt = await publicClient.waitForTransactionReceipt({ hash: transactionHash, timeout: 90_000 });
const transaction = await publicClient.getTransaction({ hash: transactionHash });
const evidence = {
  status: receipt.status,
  chainId,
  network: "Injective EVM Testnet",
  evmAddress: account.address,
  injectiveAddress,
  startingBalanceInj: formatEther(balance),
  transactionHash,
  explorerUrl: `${explorerUrl}/tx/${transactionHash}`,
  blockNumber: receipt.blockNumber.toString(),
  gasUsed: receipt.gasUsed.toString(),
  from: receipt.from,
  to: receipt.to,
  valueWei: transaction.value.toString(),
  memo,
  fundingWaitStartedAt: startedAt.toISOString(),
  confirmedAt: new Date().toISOString(),
  keyHandling: "Ephemeral verification key generated in process memory; never printed or persisted.",
  claimSemantics: "Real zero-value testnet claim receipt. The displayed 0.75 INJ remains demo reward accounting."
};
await saveEvidence("injective-testnet-claim.json", evidence);
await unlink("docs/evidence/injective-testnet-faucet-pending.json").catch(() => undefined);
log(`Confirmed in block ${evidence.blockNumber}`);
log(`Explorer: ${evidence.explorerUrl}`);
}
