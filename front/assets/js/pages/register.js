import apiClient from '../api/client.js';
import { getCurrentUser } from '../api/auth.js';
import {
    initPasswordToggles,
    clearFieldErrors,
    showFieldErrors,
    showAlert,
    hideAlert,
    setSubmitting,
} from './auth-form.js';

const form = document.getElementById('register-form');
const alertEl = document.getElementById('register-alert');
const submitBtn = document.getElementById('register-submit');
const typePieceSelect = document.getElementById('register-type-piece');

const FALLBACK_TYPE_PIECES = [
    { id: 1, name: "Carte nationale d'identité" },
    { id: 2, name: 'Passeport' },
    { id: 3, name: 'Permis de conduire' },
];

// Déjà connecté → pas besoin de revoir register
getCurrentUser().then((user) => {
    if (user) window.location.replace('../index.html');
});

initPasswordToggles(form);

function fillTypePieces(items) {
    const placeholder = typePieceSelect.querySelector('option[value=""]');
    typePieceSelect.innerHTML = '';
    if (placeholder) typePieceSelect.appendChild(placeholder);
    else {
        const option = document.createElement('option');
        option.value = '';
        option.disabled = true;
        option.selected = true;
        option.textContent = 'Choisir…';
        typePieceSelect.appendChild(option);
    }

    items.forEach(({ id, name }) => {
        const option = document.createElement('option');
        option.value = String(id);
        option.textContent = name;
        typePieceSelect.appendChild(option);
    });
}

async function loadTypePieces() {
    try {
        const response = await apiClient.get('v1/typepiece');
        const items = Array.isArray(response?.data) ? response.data : [];
        fillTypePieces(items.length ? items : FALLBACK_TYPE_PIECES);
    } catch {
        fillTypePieces(FALLBACK_TYPE_PIECES);
    }
}

function validate(data) {
    const errors = {};

    if (!data.firstname.trim()) errors.firstname = 'Prénom requis';
    if (!data.lastname.trim()) errors.lastname = 'Nom requis';

    if (!data.email.trim()) {
        errors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        errors.email = 'Email invalide';
    }

    if (!data.type_piece_id) errors.type_piece_id = 'Type de pièce requis';
    if (!data.number_piece.trim()) errors.number_piece = 'Numéro de pièce requis';

    if (!data.password) {
        errors.password = 'Mot de passe requis';
    } else if (data.password.length < 8) {
        errors.password = 'Mot de passe trop court (8 caractères minimum)';
    }

    if (!data.password_confirmation) {
        errors.password_confirmation = 'Confirmation du mot de passe requise';
    } else if (data.password !== data.password_confirmation) {
        errors.password_confirmation = 'Les mots de passe ne correspondent pas';
    }

    return errors;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAlert(alertEl);
    clearFieldErrors(form);

    const formData = new FormData(form);
    const payload = {
        firstname: String(formData.get('firstname') || ''),
        lastname: String(formData.get('lastname') || ''),
        email: String(formData.get('email') || ''),
        type_piece_id: String(formData.get('type_piece_id') || ''),
        number_piece: String(formData.get('number_piece') || ''),
        password: String(formData.get('password') || ''),
        password_confirmation: String(formData.get('password_confirmation') || ''),
    };

    const errors = validate(payload);
    if (Object.keys(errors).length) {
        showFieldErrors(form, errors);
        return;
    }

    setSubmitting(submitBtn, true, 'Créer mon compte', 'Création…');

    try {
        await apiClient.post('v1/auth/register', {
            ...payload,
            email: payload.email.trim(),
            firstname: payload.firstname.trim(),
            lastname: payload.lastname.trim(),
            number_piece: payload.number_piece.trim(),
            type_piece_id: Number(payload.type_piece_id),
        });

        showAlert(alertEl, 'Compte créé avec succès. Redirection…', 'success');
        window.location.href = '../index.html';
    } catch (error) {
        const fieldErrors = error.errors;
        if (fieldErrors && typeof fieldErrors === 'object') {
            showFieldErrors(form, fieldErrors);
        }
        showAlert(alertEl, error.message || 'Impossible de créer le compte.');
    } finally {
        setSubmitting(submitBtn, false, 'Créer mon compte', 'Création…');
    }
});

loadTypePieces();
