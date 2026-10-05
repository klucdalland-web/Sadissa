const EYE_OPEN = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>`;

const EYE_OFF = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>`;

export function initPasswordToggles(root = document) {
    root.querySelectorAll('[data-toggle-password]').forEach((button) => {
        button.addEventListener('click', () => {
            const input = document.getElementById(button.getAttribute('data-toggle-password'));
            if (!input) return;

            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            button.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
            button.innerHTML = show ? EYE_OFF : EYE_OPEN;
        });
    });
}

export function clearFieldErrors(form) {
    form.querySelectorAll('.auth-field').forEach((field) => {
        field.classList.remove('is-invalid');
        const control = field.querySelector('.auth-field__control');
        if (control) control.classList.remove('is-invalid');
        const error = field.querySelector('.auth-field__error');
        if (error) error.textContent = '';
    });
}

export function showFieldErrors(form, errors = {}) {
    Object.entries(errors).forEach(([name, message]) => {
        const errorEl = form.querySelector(`[data-error-for="${name}"]`);
        if (!errorEl) return;

        const field = errorEl.closest('.auth-field');
        const control = field?.querySelector('.auth-field__control');
        field?.classList.add('is-invalid');
        control?.classList.add('is-invalid');
        errorEl.textContent = message;
    });
}

export function showAlert(alertEl, message, type = 'error') {
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.classList.remove('auth-form__alert--error', 'auth-form__alert--success');
    alertEl.classList.add(`auth-form__alert--${type}`, 'is-visible');
}

export function hideAlert(alertEl) {
    if (!alertEl) return;
    alertEl.textContent = '';
    alertEl.classList.remove('is-visible');
}

export function setSubmitting(button, submitting, idleLabel, busyLabel) {
    if (!button) return;
    button.disabled = submitting;
    button.textContent = submitting ? busyLabel : idleLabel;
}
