const prisma = require("../config/prisma");
const { res } = require("../utils/function");
async function getTypeUser(req, resp) {
    try {
        const typeUserData = await prisma.typeUser.findMany({
            where: {
                deletedAt: null,
                name: { not: 'administrateur' }
            },
            orderBy: { id: "asc" }
        });


        res(resp, 200, "Liste des types d'utilisateurs récupérée avec succès", typeUserData);
    } catch (error) {
        console.error(error);
        res(resp, 500, "Erreur serveur", null);
    }
}
module.exports = { getTypeUser };
module.exports = {
    getTypeUser
};