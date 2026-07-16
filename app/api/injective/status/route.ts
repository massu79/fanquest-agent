import { NextResponse } from "next/server";

const latestBlockUrl = "https://testnet.sentry.lcd.injective.network/cosmos/base/tendermint/v1beta1/blocks/latest";

type LatestBlockResponse = {
  block?: { header?: { chain_id?: string; height?: string } };
};

export async function GET() {
  try {
    const response = await fetch(latestBlockUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000)
    });
    if (!response.ok) throw new Error("Injective LCD request failed");
    const data = (await response.json()) as LatestBlockResponse;
    const chainId = data.block?.header?.chain_id;
    const blockHeight = data.block?.header?.height;
    if (!chainId || !blockHeight) throw new Error("Incomplete Injective LCD response");
    return NextResponse.json({ live: true, chainId, blockHeight });
  } catch {
    return NextResponse.json({ live: false, chainId: "injective-888", blockHeight: null });
  }
}