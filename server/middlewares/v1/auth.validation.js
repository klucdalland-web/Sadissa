const prisma = require("../../config/prisma");
const { res } = require("../../utils/function");

function validateRegisterData(data = {}) {
  const errors = {};

  if (!data.email || !String(data.email).trim()) {
    errors.email = "Email requis";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email).trim())) {
    errors.email = "Email invalide";
  }

  if (!data.password) {
    errors.password = "Mot de passe requis";
  } else if (String(data.password).length < 8) {
    errors.password = "Mot de passe trop court (8 caractères minimum)";
  }

  if (!data.password_confirmation) {
    errors.password_confirmation = "Confirmation du mot de passe requise";
  } else if (data.password && data.password_confirmation !== data.password) {
    errors.password_confirmation = "Les mots de passe ne correspondent pas";
  }

  if (!data.firstname || !String(data.firstname).trim()) {
    errors.firstname = "Prénom requis";
  }

  if (!data.lastname || !String(data.lastname).trim()) {
    errors.lastname = "Nom requis";
  }

  if (
    data.type_piece_id === undefined ||
    data.type_piece_id === null ||
    data.type_piece_id === ""
  ) {
    errors.type_piece_id = "Type de pièce requis";
  } else {
    const typePieceId = Number(data.type_piece_id);
    // rejette "1.5", "abc", true, etc.
    if (
      !Number.isInteger(typePieceId) ||
      typePieceId < 1 ||
      String(data.type_piece_id).trim() !== String(typePieceId)
    ) {
      errors.type_piece_id = "Type de pièce doit être un nombre entier";
    }
  }

  if (!data.number_piece || !String(data.number_piece).trim()) {
    errors.number_piece = "Numéro de pièce requis";
  }

  return errors;
}

function validateLoginData(data = {}) {
  const errors = {};

  if (!data.email || !String(data.email).trim()) {
    errors.email = "Email requis";
  }

  if (!data.password) {
    errors.password = "Mot de passe requis";
  }

  if (!data.password_confirmation) {
    errors.password_confirmation = "Confirmation du mot de passe requise";
  } else if (data.password && data.password_confirmation !== data.password) {
    errors.password_confirmation = "Les mots de passe ne correspondent pas";
  }

  return errors;
}

function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

async function validateRegister(req, resp, next) {
  const errors = validateRegisterData(req.body);
  if (hasErrors(errors)) return res(resp, 400, "Données invalides", errors);

  const typePieceId = Number(req.body.type_piece_id);

  try {
    const typePiece = await prisma.typePiece.findFirst({
      where: {
        id: typePieceId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!typePiece) {
      return res(resp, 400, "Données invalides", {
        type_piece_id: "Type de pièce introuvable",
      });
    }

    // normalise en nombre pour le controller
    req.body.type_piece_id = typePieceId;
    next();
  } catch (error) {
    console.error(error);
    return res(resp, 500, "Erreur serveur", null);
  }
}

function validateLogin(req, resp, next) {
  const errors = validateLoginData(req.body);
  if (hasErrors(errors)) return res(resp, 400, "Données invalides", errors);
  next();
}

module.exports = {
  validateRegister,
  validateLogin,
  validateRegisterData,
  validateLoginData,
};
