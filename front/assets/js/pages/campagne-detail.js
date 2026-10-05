import { getCampagneById, createContribution } from '../api/campagnes.js';
import { formatFCFA, formatDaysLeft } from '../utils/format.js';

const MIN_AMOUNT = 200;
const NAME_MAX_LENGTH = 100;
const PAYMENT_METHODS = new Set(['airtel', 'mtn']);

const $ = (selector) => document.querySelector(selector);

const elements = {
    status: $('#page-status'),
    content: $('#campaign-content'),
    error: $('#campaign-error'),
    errorMessage: $('#error-message'),
    campaignStatus: $('#campaign-status'),
    image: $('#campaign-image'),
    coverPlaceholder: $('#cover-placeholder'),
    category: $('#campaign-category'),
    location: $('#campaign-location'),
    title: $('#campaign-title'),
    summary: $('#campaign-summary'),
    raised: $('#campaign-raised'),
    percentage: $('#campaign-percentage'),
    progressTrack: $('#progress-track'),
    progressBar: $('#progress-bar'),
    goal: $('#campaign-goal'),
    contributions: $('#campaign-contributions'),
    deadline: $('#campaign-deadline'),
    description: $('#campaign-description'),
    creator: $('#campaign-creator'),
    creatorBio: $('#campaign-creator-bio'),
    creatorLocation: $('#creator-location'),
    rewards: $('#rewards-list'),
    rewardsEmpty: $('#rewards-empty'),
    contributeButton: $('#contribute-button'),
    shareButton: $('#share-button'),
    shareStatus: $('#share-status'),
    contributionSection: $('#contribution'),
    contributionForm: $('#contribution-form'),
    contributionAmount: $('#contribution-amount'),
    contributionName: $('#contributor-name'),
    contributionSubmit: $('#contribution-submit'),
    contributionStatus: $('#contribution-status'),
    amountError: $('#amount-error'),
    nameError: $('#name-error'),
    paymentError: $('#payment-error'),
    backToTop: $('#back-to-top'),
    retryButton: $('#retry-campaign'),
};

let campaign = null;
let selectedRewardId = null;
let isSubmitting = false;

function getCampaignId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || params.get('campaignId');
}

function setText(element, value) {
    if (element) element.textContent = value ?? '';
}

function setFieldError(errorElement, message) {
    if (!errorElement) return;
    if (message) {
        errorElement.hidden = false;
        errorElement.textContent = message;
    } else {
        errorElement.hidden = true;
        errorElement.textContent = '';
    }
}

function setContributionStatus(message, { isError = false } = {}) {
    if (!elements.contributionStatus) return;
    elements.contributionStatus.textContent = message ?? '';
    elements.contributionStatus.classList.toggle('is-error', Boolean(isError && message));
}

function clearContributionFeedback() {
    setFieldError(elements.amountError, '');
    setFieldError(elements.nameError, '');
    setFieldError(elements.paymentError, '');
    elements.contributionAmount?.classList.remove('is-invalid');
    elements.contributionName?.classList.remove('is-invalid');
    setContributionStatus('');
}

function showLoading() {
    if (elements.status) {
        elements.status.hidden = false;
        elements.status.textContent = 'Chargement des informations de la campagne…';
    }
    if (elements.content) elements.content.hidden = true;
    if (elements.error) elements.error.hidden = true;
}

function showError(message, { notFound = false } = {}) {
    if (elements.status) elements.status.hidden = true;
    if (elements.content) elements.content.hidden = true;
    if (elements.error) elements.error.hidden = false;
    setText(elements.errorMessage, message);

    if (elements.retryButton) {
        elements.retryButton.hidden = notFound;
    }
}

function normalizeCampaign(source) {
    const goal = Number(source.goal ?? 0);
    const raised = Number(source.raised ?? 0);
    const daysLeft = Number(source.daysLeft ?? 0);

    const deadline = source.deadline ?? source.endDate;
    let deadlineLabel = 'Non précisée';
    if (deadline) {
        const date = new Date(deadline);
        if (!Number.isNaN(date.getTime())) {
            deadlineLabel = new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(date);
        }
    } else if (Number.isFinite(daysLeft)) {
        deadlineLabel = formatDaysLeft(daysLeft);
    }

    return {
        id: String(source.id ?? ''),
        title: String(source.title ?? ''),
        summary: String(source.summary ?? source.shortDescription ?? ''),
        description: String(
            source.description ??
                source.summary ??
                'Les détails complets de cette campagne seront bientôt disponibles.',
        ),
        category: String(source.category ?? ''),
        location: String(source.location ?? ''),
        image: String(source.image ?? source.imageUrl ?? ''),
        goal: Number.isFinite(goal) ? goal : 0,
        raised: Number.isFinite(raised) ? raised : 0,
        contributionCount: Number(source.contributionCount ?? 0),
        deadlineLabel,
        status: String(source.status ?? 'open').toLowerCase(),
        type: source.type === 'recompenses' ? 'recompenses' : 'don',
        creator: {
            name: String(source.creator?.name ?? 'Porteur du projet'),
            bio: String(source.creator?.bio ?? ''),
            location: String(source.creator?.location ?? source.location ?? ''),
        },
        rewards: Array.isArray(source.rewards)
            ? source.rewards
                  .map((reward, index) => ({
                      id: String(reward.id ?? `reward-${index}`),
                      amount: Number(reward.amount ?? reward.minimumAmount ?? 0),
                      description: String(reward.description ?? reward.title ?? 'Contrepartie'),
                      title: String(reward.title ?? ''),
                  }))
                  .filter((reward) => reward.amount > 0)
            : [],
    };
}

function isCampaignClosed(item) {
    return ['closed', 'ended', 'completed', 'cancelled', 'canceled', 'rejected'].includes(
        item.status,
    );
}

function updateFundingDisplay(item) {
    const percentage =
        item.goal > 0
            ? Math.min(100, Math.max(0, Math.round((item.raised / item.goal) * 100)))
            : 0;

    setText(elements.raised, formatFCFA(item.raised));
    setText(elements.goal, formatFCFA(item.goal));
    setText(elements.percentage, `${percentage} %`);
    setText(elements.contributions, String(item.contributionCount));

    if (elements.progressBar) elements.progressBar.style.width = `${percentage}%`;
    elements.progressTrack?.setAttribute('aria-valuenow', String(percentage));
}

function parseAmount(rawValue) {
    const trimmed = String(rawValue ?? '').trim();
    if (!trimmed || !/^-?\d+$/.test(trimmed)) {
        return null;
    }
    const amount = Number(trimmed);
    return Number.isInteger(amount) ? amount : null;
}

function getSelectedPaymentMethod() {
    const checked = elements.contributionForm?.querySelector(
        'input[name="paymentMethod"]:checked',
    );
    return checked ? checked.value : '';
}

function validateContributionForm() {
    clearContributionFeedback();

    const amount = parseAmount(elements.contributionAmount?.value);
    const name = elements.contributionName?.value.trim() ?? '';
    const paymentMethod = getSelectedPaymentMethod();
    let isValid = true;

    if (amount === null || amount < MIN_AMOUNT) {
        setFieldError(elements.amountError, `Le montant minimum est de ${MIN_AMOUNT} FCFA`);
        elements.contributionAmount?.classList.add('is-invalid');
        isValid = false;
    }

    if (!name) {
        setFieldError(elements.nameError, 'Le nom est obligatoire');
        elements.contributionName?.classList.add('is-invalid');
        isValid = false;
    } else if (name.length > NAME_MAX_LENGTH) {
        setFieldError(
            elements.nameError,
            `Le nom ne doit pas dépasser ${NAME_MAX_LENGTH} caractères`,
        );
        elements.contributionName?.classList.add('is-invalid');
        isValid = false;
    }

    if (!PAYMENT_METHODS.has(paymentMethod)) {
        setFieldError(elements.paymentError, 'Choisissez un moyen de paiement');
        isValid = false;
    }

    if (!isValid) {
        return null;
    }

    return { amount, name, paymentMethod };
}

function renderCampaign(item) {
    const closed = isCampaignClosed(item);

    setText(elements.campaignStatus, closed ? 'Campagne clôturée' : 'Campagne active');
    elements.campaignStatus?.classList.toggle('is-closed', closed);

    setText(elements.title, item.title);
    setText(elements.summary, item.summary || item.description);
    setText(elements.category, item.category);
    setText(elements.location, item.location);
    setText(elements.deadline, item.deadlineLabel);
    updateFundingDisplay(item);

    // Contenu API toujours via textContent (jamais innerHTML).
    setText(elements.description, item.description);
    if (elements.description) elements.description.style.whiteSpace = 'pre-line';

    setText(elements.creator, item.creator.name);
    setText(elements.creatorBio, item.creator.bio);

    const creatorLocationText = elements.creatorLocation?.querySelector('span');
    if (creatorLocationText) {
        creatorLocationText.textContent = item.creator.location || 'Lieu non précisé';
    }

    if (item.image && elements.image) {
        elements.image.src = item.image;
        elements.image.alt = `Illustration de la campagne : ${item.title}`;
        elements.image.hidden = false;
        if (elements.coverPlaceholder) elements.coverPlaceholder.hidden = true;
        elements.image.onerror = () => {
            elements.image.hidden = true;
            if (elements.coverPlaceholder) elements.coverPlaceholder.hidden = false;
        };
    } else if (elements.image) {
        elements.image.hidden = true;
        if (elements.coverPlaceholder) elements.coverPlaceholder.hidden = false;
    }

    elements.rewards?.replaceChildren();
    const rewards = [...item.rewards].sort((a, b) => a.amount - b.amount);
    if (elements.rewardsEmpty) elements.rewardsEmpty.hidden = rewards.length > 0;

    rewards.forEach((reward) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'reward-card';
        button.disabled = closed;
        button.setAttribute('aria-pressed', 'false');

        const amount = document.createElement('span');
        amount.className = 'reward-amount';
        amount.textContent = formatFCFA(reward.amount);

        const description = document.createElement('span');
        description.className = 'reward-description';
        description.textContent = reward.title
            ? `${reward.title} — ${reward.description}`
            : reward.description;

        const action = document.createElement('span');
        action.className = 'reward-action';
        action.textContent = closed ? 'Campagne clôturée' : 'Choisir ce palier';

        button.append(amount, description, action);
        button.addEventListener('click', () => {
            selectedRewardId = reward.id;
            if (elements.contributionAmount) {
                elements.contributionAmount.value = String(reward.amount);
                elements.contributionAmount.classList.remove('is-invalid');
            }
            setFieldError(elements.amountError, '');
            elements.rewards.querySelectorAll('.reward-card').forEach((card) => {
                card.classList.remove('is-selected');
                card.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('is-selected');
            button.setAttribute('aria-pressed', 'true');
            if (elements.contributionSection) elements.contributionSection.hidden = false;
            setContributionStatus('');
            elements.contributionSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        elements.rewards.append(button);
    });

    if (elements.contributeButton) {
        elements.contributeButton.setAttribute('aria-disabled', String(closed));
        elements.contributeButton.classList.toggle('is-disabled', closed);
        if (closed) {
            elements.contributeButton.removeAttribute('href');
            elements.contributeButton.setAttribute('tabindex', '-1');
        } else {
            elements.contributeButton.href = '#contribution';
            elements.contributeButton.removeAttribute('tabindex');
        }
    }

    if (elements.status) elements.status.hidden = true;
    if (elements.content) elements.content.hidden = false;
    if (elements.error) elements.error.hidden = true;
}

async function loadCampaign() {
    const id = getCampaignId();
    showLoading();

    if (!id) {
        showError('Aucune campagne sélectionnée. Choisissez une campagne dans la liste.', {
            notFound: true,
        });
        return;
    }

    try {
        const raw = await getCampagneById(id);
        campaign = normalizeCampaign(raw);

        if (!campaign.title) {
            showError('Cette campagne est introuvable.', { notFound: true });
            return;
        }

        document.title = `${campaign.title} | Sadissa`;
        renderCampaign(campaign);
    } catch (error) {
        console.error(error);
        const notFound = error.status === 404 || error.status === 400;
        showError(
            notFound
                ? 'Cette campagne est introuvable.'
                : 'Impossible de charger cette campagne. Vérifiez votre connexion puis réessayez.',
            { notFound },
        );
    }
}

elements.contributeButton?.addEventListener('click', (event) => {
    if (!campaign || isCampaignClosed(campaign)) {
        event.preventDefault();
        return;
    }
    if (elements.contributionSection) elements.contributionSection.hidden = false;
});

elements.shareButton?.addEventListener('click', async () => {
    const shareData = {
        title: campaign?.title || 'Campagne Sadissa',
        text: campaign?.summary || 'Découvrez cette campagne sur Sadissa.',
        url: window.location.href,
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            setText(elements.shareStatus, 'Lien de partage ouvert.');
        } else if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(shareData.url);
            setText(elements.shareStatus, 'Lien de la campagne copié.');
        } else {
            setText(elements.shareStatus, `Copiez ce lien : ${shareData.url}`);
        }
    } catch (error) {
        if (error.name !== 'AbortError') {
            setText(elements.shareStatus, "Le partage n'a pas pu être lancé.");
        }
    }
});

elements.contributionAmount?.addEventListener('input', () => {
    elements.contributionAmount.classList.remove('is-invalid');
    setFieldError(elements.amountError, '');
});

elements.contributionName?.addEventListener('input', () => {
    elements.contributionName.classList.remove('is-invalid');
    setFieldError(elements.nameError, '');
});

elements.contributionForm
    ?.querySelectorAll('input[name="paymentMethod"]')
    .forEach((input) => {
        input.addEventListener('change', () => {
            setFieldError(elements.paymentError, '');
        });
    });

elements.contributionForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!campaign || isCampaignClosed(campaign)) {
        setContributionStatus("Cette campagne n'accepte plus de contributions.", {
            isError: true,
        });
        return;
    }

    const payload = validateContributionForm();
    if (!payload) return;

    isSubmitting = true;
    if (elements.contributionSubmit) elements.contributionSubmit.disabled = true;
    setContributionStatus('Envoi de votre contribution…');

    try {
        const result = await createContribution(campaign.id, payload);
        const updated = result?.campaign ? normalizeCampaign(result.campaign) : null;

        if (updated) {
            campaign = {
                ...campaign,
                raised: updated.raised,
                contributionCount: updated.contributionCount,
                goal: updated.goal || campaign.goal,
            };
        } else if (Number.isFinite(Number(result?.raised))) {
            campaign.raised = Number(result.raised);
            campaign.contributionCount = Number(campaign.contributionCount || 0) + 1;
        }

        updateFundingDisplay(campaign);
        setContributionStatus('Contribution enregistrée avec succès. Merci pour votre soutien !');
        elements.contributionForm.reset();
        selectedRewardId = null;
        elements.rewards?.querySelectorAll('.reward-card').forEach((card) => {
            card.classList.remove('is-selected');
            card.setAttribute('aria-pressed', 'false');
        });
    } catch (error) {
        console.error(error);
        const message =
            error?.message || "Impossible d'enregistrer la contribution. Réessayez.";
        setContributionStatus(message, { isError: true });
    } finally {
        isSubmitting = false;
        if (elements.contributionSubmit) elements.contributionSubmit.disabled = false;
    }
});

elements.retryButton?.addEventListener('click', () => {
    loadCampaign();
});

window.addEventListener(
    'scroll',
    () => {
        if (elements.backToTop) {
            elements.backToTop.hidden = window.scrollY < 350;
        }
    },
    { passive: true },
);

elements.backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

loadCampaign();
