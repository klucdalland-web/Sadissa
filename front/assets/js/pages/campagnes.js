
const campaignForm = document.querySelector("#campaign-form");
const saveDraftButton = document.querySelector("#save-draft");
const submitCampaignButton = document.querySelector("#submit-campaign");
const imageInput = document.querySelector("#campaign-image");
const imagePreview = document.querySelector("#campaign-image-preview");


// RÉCUPÉRER LES DONNÉES

function getCampaignData() {
  return {
    title: document.querySelector("#campaign-title").value,

    type: document.querySelector("#campaign-type").value,

    cause: document.querySelector("#campaign-cause").value,

    description: document.querySelector("#campaign-description").value,

    image: imageInput.dataset.image || "",

    creatorName: document.querySelector("#creator-name").value,

    creatorType: document.querySelector("#creator-type").value,

    creatorDescription: document.querySelector("#creator-description").value,

    goal: document.querySelector("#campaign-goal").value,

    startDate: document.querySelector("#campaign-start").value,

    endDate: document.querySelector("#campaign-end").value,

    amountCollected: 0,

    createdAt: new Date().toISOString(),
  };
}

// CRÉER LE POPUP

function createPopup(content) {
  const existingPopup = document.querySelector(".campaign-popup");

  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement("div");

  popup.className = "campaign-popup";

  popup.innerHTML = content;

  document.body.appendChild(popup);

  return popup;
}

//
// POPUP DE SUCCÈS
//

function showSuccessPopup(campaign) {
  const popup = createPopup(`

        <div class="campaign-popup__overlay"></div>

        <div class="campaign-popup__content">

            <button
                class="campaign-popup__close"
                id="close-success-popup"
            >
                ×
            </button>

            <div class="campaign-popup__icon campaign-popup__icon--success">
                ✓
            </div>

            <h2>
                Campagne créée avec succès
            </h2>

            <p>
                Votre campagne a bien été créée et sera
                soumise à validation avant sa publication.
            </p>

            <button
                class="button button--primary"
                id="view-campaign"
            >
                Visualiser la campagne
            </button>

        </div>

    `);

  // Fermer le popup

  const closeButton = document.querySelector("#close-success-popup");

  closeButton.addEventListener("click", function () {
    popup.remove();
  });

  // Visualiser la campagne

  const viewButton = document.querySelector("#view-campaign");

  viewButton.addEventListener("click", function () {
    popup.remove();

    showCampaignPreview(campaign, false);
  });
}

// POPUP BROUILLON

function showDraftPopup(campaign) {
  const popup = createPopup(`

        <div class="campaign-popup__overlay"></div>

        <div class="campaign-popup__content campaign-popup__content--draft">

            <button
                class="campaign-popup__close"
                id="close-draft-popup"
            >
                ×
            </button>

            <span class="campaign-popup__label">
                BROUILLON
            </span>

            <h2>
                Votre campagne
            </h2>

            <div class="draft-preview">

                ${
                  campaign.image
                    ? `<img
                        src="${campaign.image}"
                        alt="${campaign.title}"
                    >`
                    : `<div class="draft-preview__image">
                        Aucune image
                    </div>`
                }

                <div class="draft-preview__content">

                    <h3>
                        ${campaign.title || "Sans titre"}
                    </h3>

                    <p>
                        ${campaign.cause || "Aucune cause renseignée"}
                    </p>

                    <strong>
                        Objectif :
                        ${formatAmount(campaign.goal)} XAF
                    </strong>

                </div>

            </div>

            <div class="draft-preview__notice">

                Cette campagne est enregistrée comme brouillon.
                Elle n'est visible que par vous.

            </div>

            <div class="campaign-popup__actions">

                <button
                    class="button button--secondary"
                    id="close-draft"
                >
                    Fermer
                </button>

                <button
                    class="button button--primary"
                    id="edit-draft"
                >
                    Modifier
                </button>

            </div>

        </div>

    `);

  // Fermer

  document
    .querySelector("#close-draft-popup")
    .addEventListener("click", function () {
      popup.remove();
    });

  document.querySelector("#close-draft").addEventListener("click", function () {
    popup.remove();
  });

  // Modifier le brouillon

  document.querySelector("#edit-draft").addEventListener("click", function () {
    popup.remove();

    fillForm(campaign);

    document.querySelector("#creer-campagne").scrollIntoView({
      behavior: "smooth",
    });
  });
}

// PRÉVISUALISATION

function showCampaignPreview(campaign, isDraft) {
  const popup = createPopup(`

        <div class="campaign-popup__overlay"></div>

        <div class="campaign-popup__content campaign-preview">

            <button
                class="campaign-popup__close"
                id="close-preview"
            >
                ×
            </button>

            <span class="campaign-popup__label">
                ${isDraft ? "APERÇU DU BROUILLON" : "APERÇU DE LA CAMPAGNE"}
            </span>

            ${
              campaign.image
                ? `<img
                    class="campaign-preview__image"
                    src="${campaign.image}"
                    alt="${campaign.title}"
                >`
                : ""
            }

            <h2>
                ${campaign.title}
            </h2>

            <p class="campaign-preview__cause">
                ${campaign.cause}
            </p>

            <p>
                ${campaign.description}
            </p>

            <div class="campaign-preview__info">

                <div>
                    <span>Objectif</span>
                    <strong>
                        ${formatAmount(campaign.goal)} XAF
                    </strong>
                </div>

                <div>
                    <span>Créateur</span>
                    <strong>
                        ${campaign.creatorName}
                    </strong>
                </div>

            </div>

            <div class="campaign-preview__notice">

                ${
                  isDraft
                    ? "Cette campagne est enregistrée comme brouillon et n'est visible que par vous."
                    : "Cette campagne est en attente de validation."
                }

            </div>

        </div>

    `);

  document
    .querySelector("#close-preview")
    .addEventListener("click", function () {
      popup.remove();
    });
}


// FORMATER LE MONTANT

function formatAmount(amount) {
  if (!amount) {
    return "0";
  }

  return Number(amount).toLocaleString("fr-FR");
}

//
// APERÇU DE L'IMAGE
//

imageInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    const imageUrl = event.target.result;

    imageInput.dataset.image = imageUrl;

    imagePreview.innerHTML = `

            <img
                src="${imageUrl}"
                alt="Aperçu de la campagne"
            >

        `;
  };

  reader.readAsDataURL(file);
});

// ENREGISTRER BROUILLON


saveDraftButton.addEventListener("click", function () {
  const campaign = getCampaignData();

  campaign.status = "draft";

  const campaigns = JSON.parse(localStorage.getItem("sadissa_campaigns")) || [];

  campaigns.push(campaign);

  localStorage.setItem("sadissa_campaigns", JSON.stringify(campaigns));

  showDraftPopup(campaign);
});

// CRÉER LA CAMPAGNE

campaignForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const campaign = getCampaignData();

  campaign.status = "pending_review";

  const campaigns = JSON.parse(localStorage.getItem("sadissa_campaigns")) || [];

  campaigns.push(campaign);

  localStorage.setItem("sadissa_campaigns", JSON.stringify(campaigns));

  showSuccessPopup(campaign);
});

// REMPLIR LE FORMULAIRE

function fillForm(campaign) {
  document.querySelector("#campaign-title").value = campaign.title;

  document.querySelector("#campaign-type").value = campaign.type;

  document.querySelector("#campaign-cause").value = campaign.cause;

  document.querySelector("#campaign-description").value = campaign.description;

  document.querySelector("#creator-name").value = campaign.creatorName;

  document.querySelector("#creator-type").value = campaign.creatorType;

  document.querySelector("#creator-description").value =
    campaign.creatorDescription;

  document.querySelector("#campaign-goal").value = campaign.goal;

  document.querySelector("#campaign-start").value = campaign.startDate;

  document.querySelector("#campaign-end").value = campaign.endDate;
}
