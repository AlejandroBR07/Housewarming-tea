
export interface Gift {
  id: string;
  name: string;
  category: GiftCategory;
  image: string; // URL placeholder
  claimed: boolean;
  claimedBy?: string;
  bringsFood?: boolean; // Propriedade derivada para exibição
}

export enum GiftCategory {
  COZINHA = 'Cozinha',
  ELETRO = 'Eletrodomésticos',
  QUARTO = 'Quarto',
  BANHEIRO = 'Banheiro',
  LIMPEZA = 'Lavanderia & Limpeza',
  ESPECIAL = 'Especial', // Para itens ocultos como "Apenas Presença"
}

export interface GuestData {
  name: string;
  bringsFood: boolean;
  selectedGiftId: string | null;
}
