
import { INITIAL_GIFTS } from '../constants';
import { Gift } from '../types';

// ============================================================================
// URL DO BACKEND (GOOGLE APPS SCRIPT)
// ============================================================================
// Certifique-se de fazer NOVA IMPLANTAÇÃO e usar a URL atualizada
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw-cupxvIJsEUIlmAdM8Y2hMuQC3H9Kq-LRefR355pDGgJ8pSJGwCVvREQNQgiKZFn1KQ/exec"; 

const CHURRASCO_TAG = " [Churrasco]";

export const fetchGiftsFromSheet = async (): Promise<Gift[]> => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("COLE_SUA_URL_AQUI")) {
    return INITIAL_GIFTS;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'GET',
    });

    if (!response.ok) throw new Error('Falha ao buscar dados');
    
    // TRATAMENTO ROBUSTO PARA TEXTO/JSON
    // O Apps Script agora retorna MimeType.TEXT para evitar CORS
    const textData = await response.text();
    let data;
    try {
        data = JSON.parse(textData);
    } catch(e) {
        console.warn("Resposta não é JSON válido, usando fallback.");
        return INITIAL_GIFTS;
    }
    
    // MAPA DE DADOS DA PLANILHA
    const sheetMap = new Map();
    if (Array.isArray(data)) {
        data.forEach((item: any) => {
            sheetMap.set(String(item.id), item);
        });
    }

    return INITIAL_GIFTS.map(localGift => {
        const remoteItem = sheetMap.get(localGift.id);

        if (remoteItem) {
            let claimedByClean = remoteItem.claimedBy;
            let bringsFood = remoteItem.bringsFood;

            // Fallback para legado
            if (claimedByClean && typeof claimedByClean === 'string' && claimedByClean.includes(CHURRASCO_TAG)) {
                bringsFood = true;
                claimedByClean = claimedByClean.replace(CHURRASCO_TAG, '');
            }

            return {
                ...localGift,
                claimed: remoteItem.claimed === true || String(remoteItem.claimed) === "true",
                claimedBy: claimedByClean,
                bringsFood: bringsFood === true || String(bringsFood) === "true"
            };
        }

        return localGift;
    });

  } catch (error) {
    console.error("Erro ao conectar com a planilha:", error);
    return INITIAL_GIFTS; 
  }
};

export const claimGiftInSheet = async (giftId: string, guestName: string, bringsFood: boolean): Promise<boolean> => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("COLE_SUA_URL_AQUI")) {
    console.warn("URL da API não configurada. Simulando sucesso.");
    return true;
  }

  try {
    // Usamos 'text/plain;charset=utf-8' para forçar Simple Request (sem Preflight)
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: 'claim',
        giftId,
        guestName,
        bringsFood 
      })
    });
    
    const textResult = await response.text();
    
    try {
      const jsonResult = JSON.parse(textResult);
      
      if (jsonResult.status === 'success') {
        return true;
      } else {
        console.error("Erro retornado pela API:", jsonResult.message);
        return false;
      }
    } catch (e) {
      console.error("A resposta da API não é um JSON válido:", textResult);
      return false;
    }

  } catch (error) {
    console.error("Erro fatal ao salvar na planilha:", error);
    return false;
  }
};
