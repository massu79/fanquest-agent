# 90-Second Judge Demo Script

## Recording Setup

- Open the deployed `/demo` route at a desktop viewport.
- Use a funded MetaMask account on Injective EVM Testnet.
- Keep the Blockscout transaction tab ready for the final proof.
- Record at 1080p and keep the cursor near the primary CTA.

## Run Of Show

| Time | Action | Narration |
| --- | --- | --- |
| 0:00-0:08 | Show the opening stepper and create the demo account. | "FanQuest turns passive World Cup viewing into a complete fan journey: predict, compete, reveal, rank, claim, and share." |
| 0:08-0:18 | Connect MetaMask and show the live INJ balance. | "A fan identity connects to Injective EVM Testnet without exposing private keys. The wallet balance is read live." |
| 0:18-0:28 | Pick the recommended match and show the live source badge. | "Recent World Cup results come from a live public scoreboard, with a deterministic fallback so the demo never dead-ends." |
| 0:28-0:40 | Join the quest and lock the prefilled predictions. | "The fan joins a free-to-play quest and locks a winner, first scorer, player vote, and support message." |
| 0:40-0:51 | Resolve the match and show calculated points. | "The real result resolves the quest and produces transparent deterministic scoring." |
| 0:51-1:02 | Open the reward box. | "The reveal is the emotional peak: points, a badge, and a sponsor reward moment built for watch-party sharing." |
| 1:02-1:12 | Show leaderboard movement. | "The fan immediately sees their community rank update." |
| 1:12-1:22 | Sign the Claim and show the confirmed receipt. | "MetaMask records a real Claim receipt on Injective Testnet. The transaction hash, block, gas, and Explorer link are verifiable." |
| 1:22-1:30 | Show the final wallet and generated X post. | "The completed moment becomes a share-ready post, closing the loop from prediction to onchain proof." |

## Truth Boundary

- The Claim receipt is a real zero-value Injective Testnet transaction carrying a FanQuest memo.
- The displayed `0.75 INJ` is demo reward accounting, not a funded token payout.
- x402 and MCP are prototypes; CCTP is an architecture prototype.
- Predictions are free-to-play and are not wagering or gambling.

## Final Overlay

Add these three links in the final frame:

- Demo: `NEXT_PUBLIC_DEMO_URL`
- GitHub: `NEXT_PUBLIC_GITHUB_URL`
- Injective Blockscout: confirmed Claim transaction URL
