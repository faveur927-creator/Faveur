
import { NextResponse } from "next/server";
import { requestToPayAirtel, checkAirtelTransaction } from "@/lib/airtelApi";

export async function POST(req: Request) {
  try {
    const { amount, phone } = await req.json();

    if (!amount || !phone) {
      return NextResponse.json({ error: "Les champs 'amount' et 'phone' sont requis." }, { status: 400 });
    }

    // Lancer un paiement
    const { transactionId } = await requestToPayAirtel(amount, phone);

    return NextResponse.json({
      message: "Paiement Airtel en cours",
      transactionId,
    });

  } catch (error: any) {
    console.error("Erreur API de paiement Airtel (POST):", error.message);
    return NextResponse.json({ error: "Une erreur est survenue lors de l'initiation du paiement Airtel." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get("id");

    if (!transactionId) {
        return NextResponse.json({ error: "Le paramètre 'id' (transactionId) est requis." }, { status: 400 });
    }

    // Vérifier le statut
    const status = await checkAirtelTransaction(transactionId);

    return NextResponse.json(status);
  } catch (error: any) {
    console.error("Erreur API de paiement Airtel (GET):", error.message);
    return NextResponse.json({ error: "Une erreur est survenue lors de la vérification du statut." }, { status: 500 });
  }
}
