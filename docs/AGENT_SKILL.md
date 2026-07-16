# FanQuest Agent Skill Workflow

## Purpose

FanQuest Agent converts a World Cup match into a free-to-play community journey: Predict -> Compete -> Reveal -> Rank -> Claim -> Share.

## Inputs

- Normalized match from `/api/worldcup/matches`
- Feed source, update time, live/fallback state, status, score, venue, and winner
- Fan display name, winner and first-goal predictions, player vote, supporter comment, and check-in
- Connected wallet address and INJ balance when MetaMask is available
- Reward pool and sponsor settings

## Workflow

1. Read recent World Cup matches from the live ESPN-backed feed.
2. Surface the provider, update time, and fallback state.
3. Generate match-specific quests from `lib/quests.ts`.
4. Collect free-to-play fan predictions and actions.
5. Calculate deterministic points:
   - Correct winner: 30
   - Correct first scoring team: 20 when verified data exists
   - Support comment: 5
   - Watch-party check-in: 10
   - Player vote: 5
   - Correct underdog winner bonus: 15
6. Reveal the points and badge, then update the leaderboard.
7. Read Injective native-chain status from `/api/injective/status`.
8. When MetaMask is available, switch to Injective EVM Testnet, read INJ balance, and request the user-signed Claim receipt.
9. Wait for the receipt and show transaction hash, block, gas, and Blockscout URL.
10. Draft the X post with the match, reward, implementation status, public demo link, GitHub link, required accounts, and hashtag.

## Safety Rules

- Predictions are free-to-play and must not be framed as gambling.
- Never request, store, log, or document a wallet private key or seed phrase.
- Treat a Claim as live only when a real transaction receipt exists.
- Never create a fake transaction hash in Review mode.
- The zero-value Claim receipt is onchain proof, not a `0.75 INJ` payout.
- Reward payout remains demo accounting until a funded contract or treasury exists.
- x402, CCTP, and MCP remain prototypes unless a live integration is explicitly configured and verifiable.

## Production Extensions

- Persist rooms, predictions, receipt hashes, and reward history.
- Deploy and fund a reward contract for actual testnet payouts.
- Add verified first-goal events from a licensed provider.
- Replace the x402, CCTP, and MCP prototypes with live integrations.