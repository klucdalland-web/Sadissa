import { createHeader } from './components/header.js';
import { createFooter } from './components/footer.js';

// Le header est inséré avant #app et le footer après,
// pour ne pas écraser le contenu des pages.
document.body.prepend(createHeader());
document.body.append(createFooter());