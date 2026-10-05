/**
 * Échappe une chaîne pour une insertion HTML sûre.
 * Préférer textContent / setAttribute quand c'est possible.
 */
export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Affiche un état de liste (chargement, vide, erreur) dans un conteneur.
 * @param {HTMLElement} container
 * @param {{ type: 'loading'|'empty'|'error', message: string, onRetry?: () => void }} options
 */
export function renderListState(container, { type, message, onRetry }) {
    if (!container) return;

    container.replaceChildren();

    const wrapper = document.createElement('div');
    wrapper.className = `list-state list-state--${type}`;
    wrapper.setAttribute('role', type === 'error' ? 'alert' : 'status');

    const text = document.createElement('p');
    text.className = 'list-state__message';
    text.textContent = message;
    wrapper.append(text);

    if (type === 'error' && typeof onRetry === 'function') {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn--outline list-state__retry';
        button.textContent = 'Réessayer';
        button.addEventListener('click', onRetry);
        wrapper.append(button);
    }

    container.append(wrapper);
}
