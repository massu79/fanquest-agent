# Testnet Evidence

`npm run verify:testnet-claim` writes `injective-testnet-claim.json` here after a confirmed Injective EVM Testnet transaction.

The evidence file contains only public chain data: addresses, transaction hash, block, gas, zero value, memo, timestamps, and Explorer URL. The ephemeral private key is generated in process memory and is never printed or persisted.

The official faucet requires a human-completed captcha. The verification process prints the temporary `inj...` address and waits while that step is completed.