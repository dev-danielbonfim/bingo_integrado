export const getBingoLetter = (num: number | null | undefined): string => {
  if (!num) return '';
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
};

export function formatBingoNumber(num: number): string {
  const letter = getBingoLetter(num);
  return `${letter} - ${num}`;
}

export function getBingoNickname(num: number): string | null {
  const nicknames: Record<number, string> = {
    1: "Começou o jogo!",
    5: "Cachorro",
    9: "Pingo no pé, 9 é!",
    10: "Craque de bola",
    11: "Um atrás do outro",
    13: "Deu azar?",
    22: "Dois patinhos na lagoa",
    31: "Ano novo!",
    33: "A idade de Cristo",
    45: "Fim do primeiro tempo",
    51: "Uma boa ideia",
    55: "Dois cachorros",
    66: "Um clique-clique",
    75: "Fim do jogo!"
  };
  return nicknames[num] || null;
};
