// Serviço de mensagens naturalizadas para o casal

export const generateThankYouMessage = async (
  guestName: string, 
  giftName: string,
  bringsFood: boolean
): Promise<string> => {
  // Simulando um pequeno delay para parecer que está processando
  await new Promise(resolve => setTimeout(resolve, 800));

  const foodText = bringsFood 
    ? " e ficamos muuuito felizes que você vem pro churrasco!" 
    : ".";

  // Lista de mensagens mais naturais e carinhosas
  const messages = [
    `Aeeee! 😍 ${guestName}, sério, amamos que você escolheu o(a) ${giftName}! Vai ajudar demais no nosso começo${foodText} Mal podemos esperar pra te ver!`,
    
    `Que demais, ${guestName}! O(A) ${giftName} era exatamente o que a gente queria! ❤️ Muito obrigado pelo carinho${foodText} Nos vemos lá!`,
    
    `Nossa, ${guestName}, acertou em cheio! O(A) ${giftName} vai ser muito útil na casa nova 🏠. Obrigado de coração${foodText}`,
    
    `Obaaa! 🎉 ${guestName}, obrigado por presentear a gente com o(a) ${giftName}. É muito especial ter você participando desse momento${foodText}`,
    
    `Ai que tudo! 🥰 ${guestName}, adoramos a escolha do(a) ${giftName}! A casa vai ficar linda. Obrigado mesmo${foodText}`
  ];

  // Escolhe uma mensagem aleatória para não ficar repetitivo
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return randomMessage;
};