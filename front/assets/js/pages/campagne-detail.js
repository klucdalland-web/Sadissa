const API_BASE_URL = "http://localhost:8000/api";

const $ = (selector) => document.querySelector(selector);

const elements = {
    status: $("#page-status"),
    content: $("#campaign-content"),
    error: $("#campaign-error"),
    errorMessage: $("#error-message"),
    campaignStatus: $("#campaign-status"),
    image: $("#campaign-image"),
    coverPlaceholder: $("#cover-placeholder"),
    category: $("#campaign-category"),
    location: $("#campaign-location"),
    title: $("#campaign-title"),
    summary: $("#campaign-summary"),
    raised: $("#campaign-raised"),
    percentage: $("#campaign-percentage"),
    progressTrack: $("#progress-track"),
    progressBar: $("#progress-bar"),
    goal: $("#campaign-goal"),
    contributions: $("#campaign-contributions"),
    deadline: $("#campaign-deadline"),
    description: $("#campaign-description"),
    creator: $("#campaign-creator"),
    creatorBio: $("#campaign-creator-bio"),
    creatorLocation: $("#creator-location"),
    rewards: $("#rewards-list"),
    rewardsEmpty: $("#rewards-empty"),
    contributeButton: $("#contribute-button"),
    shareButton: $("#share-button"),
    shareStatus: $("#share-status"),
    contributionSection: $("#contribution"),
    contributionForm: $("#contribution-form"),
    contributionAmount: $("#contribution-amount"),
    contributionName: $("#contributor-name"),
    contributionEmail: $("#contributor-email"),
    contributionStatus: $("#contribution-status"),
    backToTop: $("#back-to-top")
};

const demoCampaign = {
    id: "demo-campagne",
    title: "Un projet pour transformer notre communauté",
    summary: "Découvrez cette campagne de démonstration et son objectif solidaire.",
    description: "Cette campagne est un exemple d'affichage destiné à tester la page détail de Sadissa. Les informations affichées ici ne correspondent pas à une collecte réelle.",
    category: "Initiative communautaire",
    location: "Kinshasa, RDC",
    image: "",
    goal: 1000000,
    raised: 350000,
    contributionCount: 18,
    deadline: "2027-12-31",
    status: "open",
    creator: {
        name: "Équipe de démonstration Sadissa",
        bio: "Profil de démonstration utilisé pour vérifier l'interface.",
        location: "Kinshasa, RDC"
    },
    rewards: [
        { id: "reward-1", amount: 5000, description: "Remerciement personnalisé." },
        { id: "reward-2", amount: 15000, description: "Remerciement et actualités du projet." },
        { id: "reward-3", amount: 50000, description: "Remerciement spécial et suivi du projet." }
    ],
    isDemo: true
};

let campaign = null;
let selectedRewardId = null;

function formatMoney(value) {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "Montant non disponible";
    return new Intl.NumberFormat("fr-FR", {
        maximumFractionDigits: 0
    }).format(amount) + " FCFA";
}

function formatDate(value) {
    if (!value) return "Non précisée";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Non précisée";

    return new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}

function getCampaignId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || params.get("campaignId");
}

function normalizeCampaign(raw) {
    const source = raw?.campaign || raw?.data || raw;

    if (!source || typeof source !== "object") {
        throw new Error("Les données reçues sont invalides.");
    }

    const goal = Number(source.goal ?? source.objective ?? source.targetAmount);
    const raised = Number(source.raised ?? source.amountRaised ?? source.collectedAmount ?? 0);

    if (!source.title || !Number.isFinite(goal) || goal <= 0) {
        throw new Error("La campagne ne contient pas les champs obligatoires attendus.");
    }

    const creatorSource = source.creator || source.owner || {};

    return {
        id: String(source.id ?? source._id ?? getCampaignId() ?? ""),
        title: String(source.title),
        summary: String(source.summary ?? source.shortDescription ?? ""),
        description: String(source.description ?? ""),
        category: String(source.category?.name ?? source.category ?? ""),
        location: String(source.location ?? ""),
        image: String(source.imageUrl ?? source.image ?? source.coverImage ?? ""),
        goal,
        raised: Number.isFinite(raised) ? raised : 0,
        contributionCount: Number(source.contributionCount ?? source.contributionsCount ?? 0),
        deadline: source.deadline ?? source.endDate ?? source.closingDate ?? "",
        status: String(source.status ?? "open").toLowerCase(),
        creator: {
            name: String(creatorSource.name ?? creatorSource.fullName ?? "Porteur du projet"),
            bio: String(creatorSource.bio ?? creatorSource.description ?? ""),
            location: String(creatorSource.location ?? source.location ?? "")
        },
        rewards: Array.isArray(source.rewards)
            ? source.rewards.map((reward, index) => ({
                id: String(reward.id ?? reward._id ?? `reward-${index}`),
                amount: Number(reward.amount ?? reward.minimumAmount ?? reward.minAmount),
                description: String(reward.description ?? reward.title ?? "Contrepartie"),
                title: String(reward.title ?? "")
            })).filter(reward => Number.isFinite(reward.amount) && reward.amount > 0)
            : [],
        isDemo: false
    };
}

function isCampaignClosed(item) {
    if (["closed", "ended", "completed", "cancelled", "canceled", "rejected"].includes(item.status)) {
        return true;
    }

    if (item.deadline) {
        const deadline = new Date(item.deadline);
        if (!Number.isNaN(deadline.getTime())) {
            deadline.setHours(23, 59, 59, 999);
            if (deadline < new Date()) return true;
        }
    }

    return false;
}

function setText(element, value) {
    if (element) element.textContent = value ?? "";
}

function renderCampaign(item) {
    const closed = isCampaignClosed(item);
    const percentage = Math.min(100, Math.max(0, Math.round((item.raised / item.goal) * 100)));

    setText(elements.campaignStatus, closed ? "Campagne clôturée" : "Campagne active");
    elements.campaignStatus.classList.toggle("is-closed", closed);

    setText(elements.title, item.title);
    setText(elements.summary, item.summary);
    setText(elements.category, item.category);
    setText(elements.location, item.location);
    setText(elements.raised, formatMoney(item.raised));
    setText(elements.goal, formatMoney(item.goal));
    setText(elements.percentage, `${percentage} %`);
    setText(elements.contributions, String(item.contributionCount));
    setText(elements.deadline, formatDate(item.deadline));

    elements.progressBar.style.width = `${percentage}%`;
    elements.progressTrack.setAttribute("aria-valuenow", String(percentage));
    elements.progressTrack.setAttribute("aria-valuemax", "100");

    // Le contenu de la description est inséré comme texte, jamais comme HTML arbitraire.
    elements.description.textContent = item.description;
    elements.description.style.whiteSpace = "pre-line";

    setText(elements.creator, item.creator.name);
    setText(elements.creatorBio, item.creator.bio);

    const creatorLocationText = elements.creatorLocation.querySelector("span");
    if (creatorLocationText) {
        creatorLocationText.textContent = item.creator.location || "Lieu non précisé";
    }

    if (item.image) {
        elements.image.src = item.image;
        elements.image.alt = `Illustration de la campagne : ${item.title}`;
        elements.image.hidden = false;
        elements.coverPlaceholder.hidden = true;

        elements.image.onerror = () => {
            elements.image.hidden = true;
            elements.coverPlaceholder.hidden = false;
        };
    } else {
        elements.image.hidden = true;
        elements.coverPlaceholder.hidden = false;
    }

    elements.rewards.replaceChildren();

    const rewards = [...item.rewards].sort((a, b) => a.amount - b.amount);
    elements.rewardsEmpty.hidden = rewards.length > 0;

    rewards.forEach((reward) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "reward-card";
        button.disabled = closed;
        button.setAttribute("aria-pressed", "false");

        const amount = document.createElement("span");
        amount.className = "reward-amount";
        amount.textContent = formatMoney(reward.amount);

        const description = document.createElement("span");
        description.className = "reward-description";
        description.textContent = reward.title
            ? `${reward.title} — ${reward.description}`
            : reward.description;

        const action = document.createElement("span");
        action.className = "reward-action";
        action.textContent = closed ? "Campagne clôturée" : "Choisir ce palier";

        button.append(amount, description, action);

        button.addEventListener("click", () => {
            selectedRewardId = reward.id;
            elements.contributionAmount.value = String(reward.amount);

            elements.rewards.querySelectorAll(".reward-card").forEach(card => {
                card.classList.remove("is-selected");
                card.setAttribute("aria-pressed", "false");
            });

            button.classList.add("is-selected");
            button.setAttribute("aria-pressed", "true");

            elements.contributionSection.hidden = false;
            elements.contributionStatus.textContent = "";
            elements.contributionSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
            elements.contributionAmount.focus({ preventScroll: true });
        });

        elements.rewards.append(button);
    });

    elements.contributeButton.setAttribute("aria-disabled", String(closed));
    elements.contributeButton.classList.toggle("is-disabled", closed);

    if (closed) {
        elements.contributeButton.removeAttribute("href");
        elements.contributeButton.setAttribute("tabindex", "-1");
        elements.contributeButton.setAttribute("aria-label", "Cette campagne est clôturée");
    } else {
        elements.contributeButton.href = "#contribution";
        elements.contributeButton.removeAttribute("tabindex");
        elements.contributeButton.setAttribute("aria-label", "Contribuer à cette campagne");
    }

    if (item.isDemo) {
        const demoNotice = document.createElement("p");
        demoNotice.className = "page-status";
        demoNotice.setAttribute("role", "note");
        demoNotice.textContent = "Mode démonstration : les données présentées sont fictives.";
        elements.content.prepend(demoNotice);
    }

    elements.status.hidden = true;
    elements.content.hidden = false;
}

async function loadCampaign() {
    const id = getCampaignId();

    if (!id) {
        campaign = demoCampaign;
        renderCampaign(campaign);
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/campaigns/${encodeURIComponent(id)}`,
            { headers: { Accept: "application/json" } }
        );

        if (!response.ok) {
            throw new Error(`L'API a répondu avec le statut ${response.status}.`);
        }

        const payload = await response.json();
        campaign = normalizeCampaign(payload);
        renderCampaign(campaign);
    } catch (error) {
        console.error("Chargement de la campagne impossible :", error);
        elements.status.hidden = true;
        elements.error.hidden = false;
        setText(
            elements.errorMessage,
            "Impossible de charger cette campagne depuis le serveur. Vérifie que l'API est démarrée et que la route GET /api/campaigns/:id existe."
        );
    }
}

elements.contributeButton.addEventListener("click", (event) => {
    if (!campaign || isCampaignClosed(campaign)) {
        event.preventDefault();
        return;
    }

    elements.contributionSection.hidden = false;
});

elements.shareButton.addEventListener("click", async () => {
    const shareData = {
        title: campaign?.title || "Campagne Sadissa",
        text: campaign?.summary || "Découvre cette campagne sur Sadissa.",
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            elements.shareStatus.textContent = "Lien de partage ouvert.";
        } else if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(shareData.url);
            elements.shareStatus.textContent = "Lien de la campagne copié.";
        } else {
            elements.shareStatus.textContent = `Copie ce lien : ${shareData.url}`;
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            elements.shareStatus.textContent = "Le partage n'a pas pu être lancé.";
        }
    }
});

elements.contributionForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!campaign || isCampaignClosed(campaign)) {
        elements.contributionStatus.textContent = "Cette campagne n'accepte plus de contributions.";
        return;
    }

    const amount = Number(elements.contributionAmount.value);
    const name = elements.contributionName.value.trim();
    const email = elements.contributionEmail.value.trim();

    if (!Number.isFinite(amount) || amount < 200 || !name || !email) {
        elements.contributionStatus.textContent = "Vérifie le montant et complète tous les champs.";
        return;
    }

    // Démonstration seulement : aucune requête de paiement n'est envoyée.
    const simulatedContribution = {
        campaignId: campaign.id,
        amount,
        name,
        email,
        rewardId: selectedRewardId,
        createdAt: new Date().toISOString(),
        mode: "demo"
    };

    try {
        const key = `sadissa-demo-contributions-${campaign.id}`;
        const previous = JSON.parse(localStorage.getItem(key) || "[]");
        previous.push(simulatedContribution);
        localStorage.setItem(key, JSON.stringify(previous));

        elements.contributionStatus.textContent =
            "Contribution de démonstration enregistrée dans ce navigateur. Aucun paiement n'a été effectué.";
    } catch {
        elements.contributionStatus.textContent =
            "Simulation validée, mais le navigateur n'a pas permis l'enregistrement local.";
    }
});

window.addEventListener("scroll", () => {
    elements.backToTop.hidden = window.scrollY < 350;
}, { passive: true });

elements.backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

loadCampaign();
