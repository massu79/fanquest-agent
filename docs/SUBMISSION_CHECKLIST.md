# July 19 Submission Checklist

## P0 - Product Proof

- [x] Guided Predict -> Compete -> Reveal -> Rank -> Claim -> Share journey
- [x] Live World Cup results with source and update time
- [x] Deterministic fallback with an explicit fallback label
- [x] Injective native testnet chain status
- [x] MetaMask Injective EVM Testnet add/switch flow
- [x] Live INJ balance in the wallet card
- [x] User-signed Claim receipt implementation
- [x] Receipt confirmation, block, gas, and Blockscout link
- [x] No-extension Review mode with no fake transaction hash
- [x] Submit one live Claim receipt from a funded testnet account
- [x] Record the confirmed Blockscout URL in submission materials

## P0 - Publish

- [x] Create or confirm the public GitHub repository
- [x] Deploy the Next.js app: https://fanquest-agent.vercel.app
- [x] Set `NEXT_PUBLIC_DEMO_URL`
- [x] Set `NEXT_PUBLIC_GITHUB_URL`
- [x] Rebuild and verify the X post contains both real links
- [x] Verify `/`, `/dashboard`, `/demo`, `/docs`, and both API routes in production

## P0 - Submission Assets

- [x] Desktop screenshot: live World Cup match selection
- [x] Desktop screenshot: reward reveal
- [x] Desktop screenshot: confirmed Claim receipt and Explorer link
- [x] Mobile screenshot: final Share screen
- [x] 60-90 second demo video covering the complete loop
- [ ] X post with `@injective`, `@NinjaLabsHQ`, `@NinjaLabsCN`, and `#InjectiveGlobalCupHackathon`

## P1 - Judge Clarity

- [x] Free-to-play and no-gambling language
- [x] Live, Review, and Prototype states are visually distinct
- [x] x402, CCTP, and MCP are not presented as completed integrations
- [x] README explains the actual Injective transaction boundary
- [x] No secrets or private keys in the repository
- [x] Add the real confirmed tx hash to README after the wallet run

## Optional Stretch

- [ ] Deploy and fund an Injective EVM reward contract
- [ ] Transfer the actual testnet reward from the contract to the winner
- [ ] Replace the architecture-only CCTP panel with a live testnet attestation
- [ ] Replace the MCP prototype log with a callable MCP service