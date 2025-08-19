
import axios from "axios";
import crypto from 'crypto';

const BASE_URL = "https://sandbox.momodeveloper.mtn.com/collection"; // en prod: remplace sandbox
const SUBSCRIPTION_KEY = process.env.MTN_SUBSCRIPTION_KEY as string;
const API_USER = process.env.MTN_API_USER as string;
const API_KEY = process.env.MTN_API_KEY as string;

/**
 * Obtenir un token d'accès
 */
export async function getAccessToken() {
  const res = await axios.post(
    `${BASE_URL}/token/`,
    {},
    {
      headers: {
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
        Authorization:
          "Basic " +
          Buffer.from(`${API_USER}:${API_KEY}`).toString("base64"),
      },
    }
  );
  return res.data.access_token;
}

/**
 * Demander un paiement (Request to Pay)
 */
export async function requestToPay(
  amount: string,
  phoneNumber: string,
  externalId: string
) {
  const token = await getAccessToken();
  const uuid = crypto.randomUUID(); // identifiant unique de la requête

  const res = await axios.post(
    `${BASE_URL}/v1_0/requesttopay`,
    {
      amount,
      currency: "XAF", // ou "XOF" selon ton pays
      externalId,
      payer: {
        partyIdType: "MSISDN",
        partyId: phoneNumber,
      },
      payerMessage: "Paiement de service",
      payeeNote: "Merci pour votre achat",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Reference-Id": uuid,
        "X-Target-Environment": "sandbox", // change en "production" après validation
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
      },
    }
  );

  return { status: res.status, referenceId: uuid };
}

/**
 * Vérifier le statut d'une transaction
 */
export async function checkTransaction(referenceId: string) {
  const token = await getAccessToken();

  const res = await axios.get(
    `${BASE_URL}/v1_0/requesttopay/${referenceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Target-Environment": "sandbox",
        "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
      },
    }
  );

  return res.data; // contient status: Pending | Success | Failed
}
