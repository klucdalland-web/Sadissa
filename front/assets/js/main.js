import { createHeader } from './components/header.js';

// Le header est inséré avant #app, pour ne pas écraser le contenu des pages.
document.body.prepend(createHeader());

// Footer : à ajouter à l'étape suivante.