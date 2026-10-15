"""Construit data.js (données intégrées à l'app NOCMIG) à partir des CSV au format Chirpity.

Usage : python3 outils/construire_donnees.py ID "Libellé" "Source" SEUIL dossier_csv [ID ... ]...
  exemple :
    python3 outils/construire_donnees.py \
      2026 "Campagne 2026" "Détections vérifiées par la classe" 0.4 ~/…/EIL_2026/resultats_classe \
      2025 "Campagne 2025" "Base commune BirdNET" 0.6 ~/…/EIL_2025

Le dépôt est PUBLIC : on ne garde que les champs utiles aux graphiques
(site, espèce, confiance, nom du wav, décalage, durée). Les colonnes « Comment »,
« Fichier d'origine » et tout chemin complet sont écartés — ils contiennent des
noms de session et prénoms d'élèves (C:\\Users\\…).
"""
import csv, datetime, glob, json, os, re, sys, unicodedata

# clé normalisée du dossier -> (clé de site, nom affiché)
NOMS = {
    'BARREDETEL': "Barre d'Étel", 'MAGOUERO': 'Magouëro', 'LINES': 'Linès', 'KERMINIHY': 'Kerminihy',
    'KERHILIO': 'Kerhillio', 'LISTOIR': 'Pointe du Listoir', 'PONTLOROI': 'Pont-Lorois',
    'GAVRES': 'Gâvres', 'DUNESPLOUHARNEL': 'Les Dunes (Plouharnel)', 'PLOUHARNEL': 'Plouharnel',
    'SEMAPHORE': 'Sémaphore (Étel)',
}
WAV = re.compile(r'_(\d{8})_(\d{6})\.wav$', re.I)


def cle(dossier):
    s = unicodedata.normalize('NFD', dossier)
    s = re.sub(r'[^A-Z0-9]', '', ''.join(c for c in s if not unicodedata.combining(c)).upper())
    return re.sub(r'20\d\d$', '', s)


def campagne(ident, libelle, source, seuil, dossier):
    sites, especes, fichiers, lignes, vus = {}, [], [], [], set()
    idx_sp, idx_f, coords = {}, {}, {}
    for chemin in sorted(glob.glob(os.path.join(os.path.expanduser(dossier), '*.csv'))):
        for r in csv.DictReader(open(chemin, encoding='utf-8-sig')):
            parts = re.split(r'[\\/]', r['File'])
            wav, k = parts[-1], cle(parts[-2])
            if not WAV.search(wav) or not r['Start (s)']:
                continue
            ident_l = (wav, r['Start (s)'], r['Common name'], r['Confidence'])
            if ident_l in vus:
                continue
            vus.add(ident_l)
            if k not in sites:
                sites[k] = len(sites)
            c = coords.setdefault(k, {})
            ll = (round(float(r['Latitude']), 5), round(float(r['Longitude']), 5))
            c[ll] = c.get(ll, 0) + 1
            sp = (r['Common name'], r['Latin name'])
            if sp not in idx_sp:
                idx_sp[sp] = len(especes); especes.append(list(sp))
            if wav not in idx_f:
                idx_f[wav] = len(fichiers); fichiers.append(wav)
            try:
                a, b = (datetime.datetime.fromisoformat(r[c]) for c in ('Detection start', 'Detection end'))
                dur = round((b - a).total_seconds()) or 3
            except (ValueError, KeyError, TypeError):
                dur = 3
            lignes.append([sites[k], idx_sp[sp], round(float(r['Confidence']), 3), idx_f[wav],
                           round(float(r['Start (s)']), 1), dur])
    liste_sites = []
    for k, i in sorted(sites.items(), key=lambda x: x[1]):
        lat, lon = max(coords[k].items(), key=lambda x: x[1])[0]
        liste_sites.append({'key': k, 'name': NOMS.get(k, k.title()), 'lat': lat, 'lon': lon})
    print(f'{ident} : {len(lignes)} détections, {len(liste_sites)} sites, {len(especes)} espèces', file=sys.stderr)
    return {'id': ident, 'label': libelle, 'source': source, 'conf': seuil, 'sites': liste_sites,
            'species': especes, 'files': fichiers, 'rows': lignes}


def main(args):
    if not args or len(args) % 5:
        sys.exit(__doc__)
    camps = [campagne(args[i], args[i + 1], args[i + 2], float(args[i + 3]), args[i + 4]) for i in range(0, len(args), 5)]
    sortie = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data.js')
    with open(sortie, 'w', encoding='utf-8') as f:
        f.write('// Généré par outils/construire_donnees.py — ne pas modifier à la main.\n')
        f.write('// rows : [site, espèce, confiance, fichier wav, début (s), durée (s)]\n')
        f.write('window.NOCMIG_DATA = ' + json.dumps(camps, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print('écrit :', os.path.normpath(sortie), file=sys.stderr)


if __name__ == '__main__':
    main(sys.argv[1:])
