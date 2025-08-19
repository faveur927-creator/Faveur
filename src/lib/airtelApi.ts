
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
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');

    const res = await axios.post(
      `${BASE_URL}/auth/oauth2/token`,
      params,
      {
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.data.access_token;
  } catch (error: any) {
    console.error("Erreur d'obtention du token Airtel:", error.response?.data || error.message);
    throw new Error(`Impossible d'obtenir le token Airtel: ${error.response?.data?.error_description || error.message}`);
  }
}


/**
 * Demander un paiement (Request to Pay)
 */
export async function requestToPayAirtel(amount: string, phoneNumber: string) {
  const token = await getAirtelToken();
  const transactionId = `T${Date.now()}${Math.floor(Math.random() * 1000)}`; // identifiant unique

  try {
    const res = await axios.post(
      `${BASE_URL}/merchant/v1/payments/`,
      {
        reference: transactionId,
        subscriber: {
          country: COUNTRY,
          currency: CURRENCY,
          msisdn: phoneNumber.replace('+', ''), // le numéro client ne doit pas avoir de '+'
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

    // Retourne l'ID de transaction pour le suivi
    return { status: res.status, transactionId, responseData: res.data };
  } catch (error: any) {
    console.error("Erreur de demande de paiement Airtel:", error.response?.data || error.message);
    // Transmettre l'erreur pour une meilleure gestion
    const errorMessage = error.response?.data?.message?.text || error.response?.data?.message || "Impossible d'initier le paiement Airtel.";
    throw new Error(errorMessage);
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
    throw new Error(error.response?.data?.message || "Impossible de vérifier la transaction Airtel.");
  }
}
