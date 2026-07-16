export type InjectivePlan = {
  x402: {
    title: string;
    status: "unpaid" | "payment required" | "unlocked";
    amount: string;
    flow: string[];
  };
  cctp: {
    sourceChain: string;
    destinationChain: string;
    amount: string;
    status: string;
    flow: string[];
  };
  mcp: {
    title: string;
    queryLog: string[];
  };
  agentSkills: {
    title: string;
    workflow: string[];
  };
};

export const injectivePlan: InjectivePlan = {
  x402: {
    title: "x402 Premium Match Insight",
    status: "payment required",
    amount: "0.25 USDC",
    flow: [
      "Fan requests an AI match brief for the selected fixture.",
      "API returns an x402 payment-required response for a small USDC amount.",
      "After mock payment, the premium brief unlocks inside the dashboard."
    ]
  },
  cctp: {
    sourceChain: "Base Sepolia",
    destinationChain: "Injective testnet",
    amount: "250 USDC",
    status: "Architecture prototype",
    flow: [
      "Host funds a sponsor reward pool in USDC.",
      "USDC is bridged with CCTP-style burn and mint semantics.",
      "FanQuest Agent prepares reward distribution records for winners."
    ]
  },
  mcp: {
    title: "MCP Server Query Log",
    queryLog: [
      "example wallet.balance(address) -> prototype response",
      "example tx.status(hash) -> prototype response",
      "example market.data(INJ/USDC) -> planned MCP query"
    ]
  },
  agentSkills: {
    title: "Agent Skills Workflow",
    workflow: [
      "Generate match-specific quests from fixture data.",
      "Check match events and calculate deterministic points.",
      "Prepare reward pool allocation for host review.",
      "Draft X post copy and community recap."
    ]
  }
};
