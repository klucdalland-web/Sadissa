const { res } = require("../utils/function");
const prisma = require("../config/prisma");
const { toCampaignDto } = require("../utils/campaign");

const PAYMENT_METHODS = new Set(["airtel", "mtn"]);
const NAME_MAX_LENGTH = 100;
const MIN_AMOUNT = 200;

/**
 * GET /api/v1/campaigns
 * Query optionnelle :
 *   - sort=createdAt:desc | createdAt:asc
 *   - limit=<nombre>
 */
async function getCampaigns(req, resp) {
    try {
        const { sort, limit } = req.query;
        const orderBy =
            sort === "createdAt:asc" || sort === "createdAt"
                ? { createdAt: "asc" }
                : { createdAt: "desc" };

        const parsedLimit = parseInt(limit, 10);
        const take =
            Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : undefined;

        const campaigns = await prisma.campaign.findMany({
            orderBy,
            take,
            include: { _count: { select: { contributions: true } } },
        });

        const data = campaigns.map((campaign) =>
            toCampaignDto(campaign, campaign._count.contributions),
        );

        return res(resp, 200, "Liste des campagnes récupérée avec succès", data);
    } catch (error) {
        console.error("getCampaigns:", error);
        return res(resp, 500, "Impossible de récupérer les campagnes", null);
    }
}

/**
 * GET /api/v1/campaigns/:id
 */
async function getCampaignById(req, resp) {
    try {
        const id = parseInt(req.params.id, 10);
        if (!Number.isInteger(id) || id <= 0) {
            return res(resp, 404, "Campagne introuvable", null);
        }

        const campaign = await prisma.campaign.findUnique({
            where: { id },
            include: { _count: { select: { contributions: true } } },
        });

        if (!campaign) {
            return res(resp, 404, "Campagne introuvable", null);
        }

        return res(
            resp,
            200,
            "Campagne récupérée avec succès",
            toCampaignDto(campaign, campaign._count.contributions),
        );
    } catch (error) {
        console.error("getCampaignById:", error);
        return res(resp, 500, "Impossible de récupérer la campagne", null);
    }
}

/**
 * Valide le corps d'une contribution.
 * @returns {{ ok: true, amount: number, name: string, paymentMethod: string } | { ok: false, message: string }}
 */
function validateContributionBody(body = {}) {
    const rawAmount = body.amount;
    const amount =
        typeof rawAmount === "number" ? rawAmount : Number(String(rawAmount ?? "").trim());

    if (
        !Number.isInteger(amount) ||
        !Number.isFinite(amount) ||
        amount < MIN_AMOUNT
    ) {
        return {
            ok: false,
            message: `Le montant doit être un entier supérieur ou égal à ${MIN_AMOUNT} FCFA`,
        };
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
        return { ok: false, message: "Le nom est obligatoire" };
    }
    if (name.length > NAME_MAX_LENGTH) {
        return {
            ok: false,
            message: `Le nom ne doit pas dépasser ${NAME_MAX_LENGTH} caractères`,
        };
    }

    const paymentMethod =
        typeof body.paymentMethod === "string" ? body.paymentMethod.trim() : "";
    if (!PAYMENT_METHODS.has(paymentMethod)) {
        return {
            ok: false,
            message: "Le moyen de paiement doit être « airtel » ou « mtn »",
        };
    }

    return { ok: true, amount, name, paymentMethod };
}

/**
 * POST /api/v1/campaigns/:id/contributions
 * Body: { amount, name, paymentMethod }
 */
async function createContribution(req, resp) {
    try {
        const campaignId = parseInt(req.params.id, 10);
        if (!Number.isInteger(campaignId) || campaignId <= 0) {
            return res(resp, 404, "Campagne introuvable", null);
        }

        const validation = validateContributionBody(req.body);
        if (!validation.ok) {
            return res(resp, 400, validation.message, null);
        }

        const { amount, name, paymentMethod } = validation;

        const result = await prisma.$transaction(async (tx) => {
            // Incrément atomique : raised = raised + amount (pas de lire-puis-écrire)
            const updatedRows = await tx.$queryRaw`
                UPDATE campaigns
                SET raised = raised + ${amount},
                    "updatedAt" = NOW()
                WHERE id = ${campaignId}
                RETURNING id, title, category, type, image, raised, goal, "daysLeft", "createdAt", "updatedAt"
            `;

            const campaign = Array.isArray(updatedRows) ? updatedRows[0] : null;
            if (!campaign) {
                return null;
            }

            await tx.contribution.create({
                data: {
                    campaignId,
                    amount,
                    name,
                    paymentMethod,
                },
            });

            const contributionCount = await tx.contribution.count({
                where: { campaignId },
            });

            return { campaign, contributionCount };
        });

        if (!result) {
            return res(resp, 404, "Campagne introuvable", null);
        }

        return res(resp, 201, "Contribution enregistrée avec succès", {
            campaign: toCampaignDto(result.campaign, result.contributionCount),
            raised: result.campaign.raised,
        });
    } catch (error) {
        console.error("createContribution:", error);
        return res(resp, 500, "Impossible d'enregistrer la contribution", null);
    }
}

module.exports = {
    getCampaigns,
    getCampaignById,
    createContribution,
};
