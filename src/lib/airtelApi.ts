
import axios from "axios";

const BASE_URL = "https://openapi.airtel.africa"; // Sandbox ou Prod
const CLIENT_ID = process.env.AIRTEL_CLIENT_ID as string;
const CLIENT_SECRET = process.env.AIRTEL_CLIENT_SECRET as string;
const COUNTRY = "CG"; // Congo-Brazzaville (mettre "CG" ou "CD" selon pays)
const CURRENCY = "XAF"; // ou "CDF" selon pays

/**
 * Obtenir un token d'accès Airtel
 */
export async function getAirtelToken() {
  try {
    const res = await axios.post(
      `${BASE_URL}/auth/oauth2/token`,
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data.access_token;
  } catch (error: any) {
    console.error("Erreur d'obtention du token Airtel:", error.response?.data || error.message);
    throw new Error("Impossible d'obtenir le token Airtel.");
  }
}

/**
 * Demander un paiement (Request to Pay)
 */
export async function requestToPayAirtel(amount: string, phoneNumber: string) {
  const token = await getAirtelToken();
  const transactionId = `TXN_${Date.now()}`; // identifiant unique

  try {
    const res = await axios.post(
      `${BASE_URL}/merchant/v1/payments/`,
      {
        reference: transactionId,
        subscriber: {
          country: COUNTRY,
          currency: CURRENCY,
          msisdn: phoneNumber, // numéro client format international (ex: 24206xxxxxx)
        },
        transaction: {
          amount,
          country: COUNTRY,
          currency: CURRENCY,
          id: transactionId,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Country": COUNTRY,
          "X-Currency": CURRENCY,
        },
      }
    );

    return { status: res.status, transactionId, responseData: res.data };
  } catch (error: any) {
    console.error("Erreur de demande de paiement Airtel:", error.response?.data || error.message);
    throw new Error("Impossible d'initier le paiement Airtel.");
  }
}

/**
 * Vérifier le statut d'une transaction
 */
export async function checkAirtelTransaction(transactionId: string) {
  const token = await getAirtelToken();

  try {
    const res = await axios.get(
      `${BASE_URL}/standard/v1/payments/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Country": COUNTRY,
          "X-Currency": CURRENCY,
        },
      }
    );

    return res.data; // contient transaction.status : SUCCESSFUL | FAILED | PENDING
  } catch (error: any) {
    console.error("Erreur de vérification de transaction Airtel:", error.response?.data || error.message);
    throw new Error("Impossible de vérifier la transaction Airtel.");
  }
}
