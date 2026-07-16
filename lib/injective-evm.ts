export const INJECTIVE_EVM_TESTNET = {
  chainId: "0x59f",
  chainIdDecimal: 1439,
  chainName: "Injective EVM Testnet",
  rpcUrl: "https://k8s.testnet.json-rpc.injective.network/",
  explorerUrl: "https://testnet.blockscout.injective.network",
  faucetUrl: "https://testnet.faucet.injective.network/"
} as const;

export type Eip1193Provider = {
  request<T = unknown>(args: { method: string; params?: unknown[] | Record<string, unknown> }): Promise<T>;
};

export type WalletSnapshot = {
  address: string;
  balanceInj: string;
  chainId: string;
};

export type ClaimReceipt = {
  transactionHash: string;
  blockNumber: string;
  gasUsed: string;
  status: "confirmed";
  explorerUrl: string;
};

type TransactionReceipt = {
  transactionHash?: string;
  blockNumber?: string;
  gasUsed?: string;
  status?: string;
};

export function getInjectedProvider(): Eip1193Provider | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { ethereum?: Eip1193Provider }).ethereum ?? null;
}

async function switchToInjective(provider: Eip1193Provider) {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: INJECTIVE_EVM_TESTNET.chainId }]
    });
  } catch (error) {
    const code = (error as { code?: number }).code;
    if (code !== 4902) throw error;
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: INJECTIVE_EVM_TESTNET.chainId,
        chainName: INJECTIVE_EVM_TESTNET.chainName,
        nativeCurrency: { name: "Injective", symbol: "INJ", decimals: 18 },
        rpcUrls: [INJECTIVE_EVM_TESTNET.rpcUrl],
        blockExplorerUrls: [INJECTIVE_EVM_TESTNET.explorerUrl]
      }]
    });
  }
}

function formatInj(hexWei: string) {
  const wei = BigInt(hexWei);
  const base = BigInt("1000000000000000000");
  const whole = wei / base;
  const fraction = (wei % base).toString().padStart(18, "0").slice(0, 4);
  return `${whole}.${fraction}`;
}

export async function readWallet(provider: Eip1193Provider, address: string): Promise<WalletSnapshot> {
  const [balance, chainId] = await Promise.all([
    provider.request<string>({ method: "eth_getBalance", params: [address, "latest"] }),
    provider.request<string>({ method: "eth_chainId" })
  ]);
  return { address, balanceInj: formatInj(balance), chainId };
}

export async function connectInjectiveWallet(): Promise<{ provider: Eip1193Provider; wallet: WalletSnapshot }> {
  const provider = getInjectedProvider();
  if (!provider) throw new Error("NO_INJECTED_WALLET");
  const accounts = await provider.request<string[]>({ method: "eth_requestAccounts" });
  const address = accounts[0];
  if (!address) throw new Error("No wallet account was returned");
  await switchToInjective(provider);
  return { provider, wallet: await readWallet(provider, address) };
}

function textToHex(value: string) {
  return `0x${[...new TextEncoder().encode(value)].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

function delay(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export async function submitClaimReceipt(
  provider: Eip1193Provider,
  address: string,
  claim: { matchId: string; fan: string; points: number; reward: string },
  onSubmitted?: (transactionHash: string) => void
): Promise<ClaimReceipt> {
  await switchToInjective(provider);
  const memo = `FanQuest|claim|${claim.matchId}|${claim.fan}|${claim.points}|${claim.reward}`;
  const transactionHash = await provider.request<string>({
    method: "eth_sendTransaction",
    params: [{ from: address, to: address, value: "0x0", data: textToHex(memo) }]
  });
  onSubmitted?.(transactionHash);

  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    const receipt = await provider.request<TransactionReceipt | null>({
      method: "eth_getTransactionReceipt",
      params: [transactionHash]
    });
    if (receipt) {
      if (receipt.status !== "0x1") throw new Error("Injective transaction reverted");
      return {
        transactionHash: receipt.transactionHash ?? transactionHash,
        blockNumber: receipt.blockNumber ? BigInt(receipt.blockNumber).toString() : "pending",
        gasUsed: receipt.gasUsed ? BigInt(receipt.gasUsed).toString() : "unknown",
        status: "confirmed",
        explorerUrl: `${INJECTIVE_EVM_TESTNET.explorerUrl}/tx/${transactionHash}`
      };
    }
    await delay(1500);
  }
  throw new Error(`Transaction submitted but confirmation timed out: ${transactionHash}`);
}