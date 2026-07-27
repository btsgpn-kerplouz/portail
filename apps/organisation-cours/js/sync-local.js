// Backend de synchronisation "stockage navigateur" — étape tampon du portage
// Supabase (voir mémoire Claude Code : organisation-cours-multiuser-plan).
//
// Contrat attendu par app.js (window.OC_SYNC) : charger(), enregistrer(state),
// marquerSupprime(type, id), memoriserSnapshot(state). Ce backend ne fait que
// lire/écrire un blob JSON dans localStorage — exactement comme le faisait le
// serveur Node local avec data.json, mais côté navigateur. Il sert à prouver
// que la copie du front fonctionne à l'identique AVANT de brancher Supabase
// (js/sync.js, étape suivante) : si un bug apparaît une fois Supabase branché,
// on saura que ce n'est pas la copie du front qui est en cause.
//
// marquerSupprime() et memoriserSnapshot() sont des no-op ici : la notion de
// "diff ciblé par entité" n'a de sens que face à des tables Supabase séparées.
// Avec un blob unique, chaque saveData() réécrit tout, suppressions incluses.

const CLE_STOCKAGE = "organisation-cours:donnees-locales";

window.OC_SYNC = {
  async charger() {
    const brut = localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return {};
    try {
      return JSON.parse(brut);
    } catch (e) {
      console.error("Données locales corrompues, redémarrage à vide :", e);
      return {};
    }
  },

  async enregistrer(state) {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(state));
      return { lastSavedAt: new Date().toISOString(), erreurs: [] };
    } catch (e) {
      console.error("Échec de l'enregistrement local :", e);
      return { lastSavedAt: state.lastSavedAt, erreurs: [e.message || "Échec de l'enregistrement local."] };
    }
  },

  marquerSupprime() {},
  memoriserSnapshot() {},
};
