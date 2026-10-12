document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('campaign-form');
    const imageInput = document.getElementById('campaign-image');
    const imagePreview = document.getElementById('campaign-image-preview');
    const saveDraftBtn = document.getElementById('save-draft');

    // Gestion de l'aperçu de l'image
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.innerHTML = `<img src="${event.target.result}" alt="Aperçu de l'image">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Gestion de la soumission du formulaire
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const campaignData = {
                title: formData.get('campaign-title'),
                type: formData.get('campaign-type'),
                cause: formData.get('campaign-cause'),
                description: formData.get('campaign-description'),
                creatorName: formData.get('creator-name'),
                creatorType: formData.get('creator-type'),
                creatorDescription: formData.get('creator-description'),
                goal: parseInt(formData.get('campaign-goal')),
                startDate: formData.get('campaign-start'),
                endDate: formData.get('campaign-end'),
            };

            // Validation des dates
            if (new Date(campaignData.startDate) >= new Date(campaignData.endDate)) {
                alert('La date de fin doit être après la date de lancement');
                return;
            }

            try {
                // TODO: Appeler l'API pour créer la campagne
                console.log('Données de la campagne:', campaignData);
                alert('Campagne créée avec succès !');
                form.reset();
                imagePreview.innerHTML = '';
            } catch (error) {
                console.error('Erreur lors de la création:', error);
                alert('Erreur lors de la création de la campagne');
            }
        });
    }

    // Gestion du brouillon
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            const formData = new FormData(form);
            const draftData = Object.fromEntries(formData.entries());
            localStorage.setItem('campaign-draft', JSON.stringify(draftData));
            alert('Brouillon enregistré !');
        });
    }

    // Charger le brouillon s'il existe
    const savedDraft = localStorage.getItem('campaign-draft');
    if (savedDraft && form) {
        const draftData = JSON.parse(savedDraft);
        Object.keys(draftData).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = draftData[key];
            }
        });
    }
});
