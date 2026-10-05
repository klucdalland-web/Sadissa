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

const form = document.getElementById('login-form');
const alertEl = document.getElementById('login-alert');
const submitBtn = document.getElementById('login-submit');

// Déjà connecté → pas besoin de revoir login
getCurrentUser().then((user) => {
    if (user) window.location.replace('../index.html');
});

initPasswordToggles(form);

function validate(data) {
    const errors = {};

    if (!data.email.trim()) {
        errors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        errors.email = 'Email invalide';
    }

    if (!data.password) {
        errors.password = 'Mot de passe requis';
    }

    return errors;
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAlert(alertEl);
    clearFieldErrors(form);

    const formData = new FormData(form);
    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    const errors = validate({ email, password });
    if (Object.keys(errors).length) {
        showFieldErrors(form, errors);
        return;
    }

    setSubmitting(submitBtn, true, 'Se connecter', 'Connexion…');

    try {
        await apiClient.post('v1/auth/login', {
            email: email.trim(),
            password,
            password_confirmation: password,
        });

        showAlert(alertEl, 'Connexion réussie. Redirection…', 'success');
        window.location.href = '../index.html';
    } catch (error) {
        showAlert(alertEl, error.message || 'Impossible de se connecter.');
        setSubmitting(submitBtn, false, 'Se connecter', 'Connexion…');
    }
});
