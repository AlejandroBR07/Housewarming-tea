
import { INITIAL_GIFTS } from '../constants';
import { Gift } from '../types';

// ============================================================================
// URL DO BACKEND (GOOGLE APPS SCRIPT)
// ============================================================================
// ATENÇÃO: Se você fizer uma "Nova Implantação" e a URL mudar, atualize aqui.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzStK7O_A1Lf00WCBbVs4ZAd3_iv5XIRX9Bt2P4qXCtUHQilqZ1vnnzWLO9Zt25Vsb72A/exec"; 

const CHURRASCO_TAG = " [Churrasco]";

export const fetchGiftsFromSheet = async (): Promise<Gift[]> => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("COLE_SUA_URL_AQUI")) {
    return INITIAL_GIFTS;
  }

  try {
    // Adicionamos um timestamp para evitar cache do navegador
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?t=${new Date().getTime()}`, {
        method: 'GET',
    });

    if (!response.ok) throw new Error('Falha ao buscar dados');
    
    const textData = await response.text();
    let data;
    try {
        data = JSON.parse(textData);
    } catch(e) {
        console.warn("Resposta não é JSON válido, usando fallback.", textData);
        return INITIAL_GIFTS;
    }
    
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

            // Limpeza de dados sujos da planilha (tags antigas ou texto Anônimo)
            if (claimedByClean && typeof claimedByClean === 'string') {
                claimedByClean = claimedByClean.replace(CHURRASCO_TAG, '').trim();
                
                // Se alguém salvou manualmente como "Anônimo" ou "FALSE", limpamos
                if (claimedByClean.toLowerCase() === 'anônimo' || claimedByClean === 'FALSE') {
                    claimedByClean = ''; 
                }
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
    console.log(`Enviando CLAIM: ${giftId} para ${guestName} (Carne: ${bringsFood})`);
    
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
    console.log("Resposta do Servidor (Claim):", textResult);
    
    try {
      const jsonResult = JSON.parse(textResult);
      
      if (jsonResult.status !== 'success') {
         console.error("ERRO DO SCRIPT:", jsonResult.message);
         // Se a mensagem for "Método desconhecido", o usuário precisa reimplantar o script
         if (jsonResult.message && jsonResult.message.includes("desconhecido")) {
             console.error("ALERTA CRÍTICO: O Google Apps Script está desatualizado. Faça uma NOVA IMPLANTAÇÃO.");
         }
      }
      return jsonResult.status === 'success';
    } catch (e) {
      console.error("JSON Inválido na resposta:", textResult);
      return false;
    }

  } catch (error) {
    console.error("Erro de rede/fetch:", error);
    return false;
  }
};

export const unclaimGiftInSheet = async (giftId: string, guestName: string): Promise<boolean> => {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("COLE_SUA_URL_AQUI")) {
    return true;
  }

  try {
    console.log(`Enviando UNCLAIM: ${giftId} de ${guestName}`);
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify({
        action: 'unclaim',
        giftId,
        guestName
      })
    });
    
    const textResult = await response.text();
    console.log("Resposta do Servidor (Unclaim):", textResult);

    try {
      const jsonResult = JSON.parse(textResult);
      if (jsonResult.status !== 'success') {
         console.error("ERRO DO SCRIPT:", jsonResult.message);
         if (jsonResult.message && jsonResult.message.includes("desconhecido")) {
             console.error("ALERTA CRÍTICO: O Google Apps Script está desatualizado. Faça uma NOVA IMPLANTAÇÃO.");
         }
      }
      return jsonResult.status === 'success';
    } catch (e) {
      console.error("JSON Inválido na resposta:", textResult);
      return false;
    }
  } catch (error) {
    console.error("Erro de rede/fetch:", error);
    return false;
  }
};
