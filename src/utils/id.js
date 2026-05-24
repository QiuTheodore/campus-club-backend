const crypto = require("crypto");

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateRandomCode(length = 6) {
  let code = "";

  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(0, ALPHABET.length);
    code += ALPHABET[index];
  }

  return code;
}

async function generateUniqueClubId(prisma) {
  let id;
  let existingClub;

  do {
    id = generateRandomCode(6);
    existingClub = await prisma.club.findUnique({
      where: {
        id,
      },
    });
  } while (existingClub);

  return id;
}

module.exports = {
  generateRandomCode,
  generateUniqueClubId,
};