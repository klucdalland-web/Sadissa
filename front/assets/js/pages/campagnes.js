async function chargerCampagnes() {
  return [];
}

let campagnes = [];

const PAR_PAGE = 6;
const TEXTES = {
  don: {
    titre: "Soutenez une cause près de chez vous",
    intro: "Chaque don compte, à partir de 200 FCFA.",
    bouton: "Faire un don",
    contrib: "donateurs",
  },
  recompense: {
    titre: "Financez des projets et recevez des récompenses",
    intro:
      "Soutenez des créateurs et entrepreneurs, et recevez une contrepartie selon votre contribution.",
    bouton: "Voir les récompenses",
    contrib: "contributeurs",
  },
};

const etat = {
  type: "don",
  q: "",
  categorie: "Toutes",
  tri: "populaires",
  page: 1,
};

const $ = (id) => document.getElementById(id);
const fcfa = (n) => n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ");
const normaliser = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
const echapper = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

function filtrer() {
  const q = normaliser(etat.q.trim());
  const liste = campagnes
    .filter((c) => c.type === etat.type)
    .filter(
      (c) => etat.categorie === "Toutes" || c.categorie === etat.categorie,
    )
    .filter(
      (c) =>
        !q ||
        normaliser(`${c.titre} ${c.porteur} ${c.ville} ${c.resume}`).includes(
          q,
        ),
    );

  const pct = (c) => c.collecte / c.objectif;
  const tris = {
    populaires: (a, b) => b.contributeurs - a.contributeurs,
    recentes: (a, b) => b.id - a.id,
    urgentes: (a, b) => a.jours - b.jours,
    progression: (a, b) => pct(b) - pct(a),
  };
  return liste.sort(tris[etat.tri]);
}

function carte(c) {
  const t = TEXTES[c.type];
  const pct = Math.round((c.collecte / c.objectif) * 100);
  const badgeType = c.type === "don" ? "Don solidaire" : "Récompenses";
  const lien = `campagne.html?id=${c.id}`;
  const palier =
    c.type === "recompense" ? `Dès ${fcfa(c.palierMin)} FCFA` : "Dès 200 FCFA";
  return `
  <article class="card">
    <a class="card-img" href="${lien}" style="--c1:${c.c1};--c2:${c.c2}" aria-label="${echapper(c.titre)}">
      <span aria-hidden="true">${c.emoji}</span>
      <span class="badges"><span class="badge">${echapper(c.categorie)}</span><span class="badge">${badgeType}</span></span>
      <span class="ville">${echapper(c.ville)}</span>
    </a>
    <div class="card-body">
      <span class="porteur">${echapper(c.porteur)}</span>
      <h3><a href="${lien}">${echapper(c.titre)}</a></h3>
      <p class="resume">${echapper(c.resume)}</p>
      <div class="progress-box">
        <div class="montant"><span>${fcfa(c.collecte)} <small>FCFA</small></span><span>${pct}%</span></div>
        <div class="bar" role="progressbar" aria-valuenow="${Math.min(pct, 100)}" aria-valuemin="0" aria-valuemax="100"><span style="width:${Math.min(pct, 100)}%"></span></div>
        <div class="meta"><span>Objectif : ${fcfa(c.objectif)} FCFA</span><span>${c.jours} jours restants</span></div>
      </div>
      <div class="card-foot">
        <span>${c.contributeurs} ${t.contrib} · ${palier}</span>
        <a class="btn btn-dark" href="${lien}">${t.bouton}</a>
      </div>
    </div>
  </article>`;
}

function afficherFiltres() {
  const cats = [
    "Toutes",
    ...new Set(
      campagnes.filter((c) => c.type === etat.type).map((c) => c.categorie),
    ),
  ];
  $("chips").innerHTML = cats
    .map(
      (c) =>
        `<button type="button" class="chip" data-cat="${echapper(c)}" aria-pressed="${c === etat.categorie}">${echapper(c)}</button>`,
    )
    .join("");
}

function afficherPagination(total) {
  const pages = Math.max(1, Math.ceil(total / PAR_PAGE));
  if (pages === 1) {
    $("pager").innerHTML = "";
    return;
  }
  let html = `<button type="button" data-page="${etat.page - 1}" ${etat.page === 1 ? "disabled" : ""} aria-label="Page précédente">‹</button>`;
  for (let p = 1; p <= pages; p++) {
    html += `<button type="button" data-page="${p}" ${p === etat.page ? 'aria-current="page"' : ""}>${p}</button>`;
  }
  html += `<button type="button" data-page="${etat.page + 1}" ${etat.page === pages ? "disabled" : ""} aria-label="Page suivante">›</button>`;
  $("pager").innerHTML = html;
}

function afficher() {
  const t = TEXTES[etat.type];
  $("titre").textContent = t.titre;
  $("intro").textContent = t.intro;

  const liste = filtrer();
  const pages = Math.max(1, Math.ceil(liste.length / PAR_PAGE));
  etat.page = Math.min(etat.page, pages);
  const debut = (etat.page - 1) * PAR_PAGE;
  const visibles = liste.slice(debut, debut + PAR_PAGE);

  $("count").textContent = liste.length
    ? `${liste.length} campagne${liste.length > 1 ? "s" : ""} en cours`
    : "";
  $("grid").innerHTML = visibles.length
    ? visibles.map(carte).join("")
    : `<p class="vide">Aucune campagne ne correspond à votre recherche. Essayez un autre mot ou retirez un filtre.</p>`;
  afficherPagination(liste.length);
}

function changerType(type, majUrl = true) {
  etat.type = type;
  etat.categorie = "Toutes";
  etat.page = 1;
  document
    .querySelectorAll(".tab")
    .forEach((b) =>
      b.setAttribute("aria-selected", String(b.dataset.type === type)),
    );
  if (majUrl) history.replaceState(null, "", `?type=${type}`);
  afficherFiltres();
  afficher();
}

async function init() {
  document
    .querySelectorAll(".tab")
    .forEach((b) =>
      b.addEventListener("click", () => changerType(b.dataset.type)),
    );

  $("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    etat.q = $("q").value;
    etat.page = 1;
    afficher();
  });
  $("q").addEventListener("input", (e) => {
    etat.q = e.target.value;
    etat.page = 1;
    afficher();
  });
  $("sort").addEventListener("change", (e) => {
    etat.tri = e.target.value;
    etat.page = 1;
    afficher();
  });

  $("chips").addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    etat.categorie = b.dataset.cat;
    etat.page = 1;
    afficherFiltres();
    afficher();
  });

  $("pager").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-page]");
    if (!b || b.disabled) return;
    etat.page = Number(b.dataset.page);
    afficher();
    window.scrollTo({ top: $("count").offsetTop - 80, behavior: "smooth" });
  });

  $("grid").innerHTML = `<p class="vide">Chargement des campagnes…</p>`;
  try {
    campagnes = await chargerCampagnes();
  } catch (erreur) {
    console.error(erreur);
    $("grid").innerHTML =
      `<p class="vide">Impossible de charger les campagnes. Réessayez plus tard.</p>`;
    return;
  }

  const type = new URLSearchParams(location.search).get("type");
  changerType(type === "recompense" ? "recompense" : "don", false);
}

document.addEventListener("DOMContentLoaded", init);
