
import { NextResponse } from "next/server";
import { requestToPay, checkTransaction } from "@/lib/momoApi";

export async function POST(req: Request) {
  try {
    const { amount, phone, externalId } = await req.json();

    if (!amount || !phone || !externalId) {
      return NextResponse.json({ error: "Les champs 'amount', 'phone', et 'externalId' sont requis." }, { status: 400 });
    }

    // Lancer un paiement
    const { referenceId } = await requestToPay(amount, phone, externalId);

    return NextResponse.json({
      message: "Paiement en cours",
      referenceId,
    });
  } catch (error: any) {
    console.error("Erreur API de paiement (POST):", error.response?.data || error.message);
    return NextResponse.json({ error: `Une erreur est survenue lors de l'initiation du paiement: ${error.message}`, details: error.response?.data?.message || error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const referenceId = searchParams.get("ref");

    if (!referenceId) {
        return NextResponse.json({ error: "Le paramètre 'ref' (referenceId) est requis." }, { status: 400 });
    }

    // Vérifier le statut
    const status = await checkTransaction(referenceId);

    return NextResponse.json(status);
  } catch (error: any) {
    console.error("Erreur API de paiement (GET):", error.response?.data || error.message);
    return NextResponse.json({ error: `Une erreur est survenue lors de la vérification du statut: ${error.message}`, details: error.response?.data?.message || error.message }, { status: 500 });
  }
}
