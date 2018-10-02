const diactrics = {
  a: "áàäǎâåăạāãæ",
  b: "ß",
  c: "çĉćčɕċ",
  d: "đ",
  e: "éèëěêĕėẹẻēẽ",
  h: "ħ",
  i: "íìïǐîĭịīɨĩ",
  j: "ǰĵ",
  o: "óòöǒôŏøọōõœ",
  u: "úùüǔûŭụūůũ",
  y: "ýỳÿŷẏỵȳỹ"
};

const showDiactricLettersHandler = (message, ...args) => {
  if (args.length <= 0 || args[0].trim().length <= 0) {
    const letters = Object.keys(diactrics)
      .map(letter => `**${letter.toUpperCase()}: ${diactrics[letter]}**`)
      .join("\n");
    return message.replay(`Letters with diactrics: \n ${letters}`);
  }
  const requestLetters = args[0].toLowerCase().split("");
  const letters = Object.keys(diactrics)
    .filter(letter => requestLetters.includes(letter))
    .map(letter => `**${letter.toUpperCase()}: ${diactrics[letter]}**`)
    .join("\n");
  return message.replay(`Letters with diactrics: \n ${letters}`);
};

module.exports = {
  showDiactricLettersHandler
};
