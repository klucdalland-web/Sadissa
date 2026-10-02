const prisma = require("../config/prisma");
const { res } = require("../utils/function");
async function register(req, resp) {
    // try {
    //     const typePieceData = await prisma.typePiece.findMany({
    //         where: {
    //             deletedAt: null,
    //         },
    //         orderBy: { id: "asc" }
    //     });


    //     res(resp, 200, "Liste des types de pièces récupérée avec succès", typePieceData);
    // } catch (error) {
    //     console.error(error);
    //     res(resp, 500, "Erreur serveur", null);
    // }
}

async function login(req, resp) {


}
module.exports = { register, login };