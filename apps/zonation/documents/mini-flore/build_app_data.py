"""
Genere les donnees mini-flore consommees par l'app zonation elle-meme
(ecran "Mini-flore de cet habitat") : photos + famille botanique (pour le
classement par famille dans l'app), pas de texte (les descriptions
Coste/Baseflor restent utilisees par build_descriptions.py pour le document
imprimable compagnon).

Pre-requis : avoir lance fetch_species_data.py au moins une fois
(cache/species_data.json doit exister, pour la famille).

Usage : python3 build_app_data.py
Sortie : ../../mini-flore-data.js (a cote de data.js dans apps/zonation/)
"""
import csv
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
CSV_PATH = HERE.parent / "especes_zonation_illustrations(URL).csv"
SPECIES_JSON = HERE / "cache" / "species_data.json"
OUT = HERE.parent.parent / "mini-flore-data.js"

SPECIES = json.loads(SPECIES_JSON.read_text(encoding="utf-8")) if SPECIES_JSON.exists() else {}


def main():
    rows = list(csv.reader(CSV_PATH.open(encoding="utf-8-sig"), delimiter=";"))

    entries = {}
    for r in rows[1:]:
        if len(r) < 10 or not r[0].strip():
            continue
        nom_sci, nom_fr = r[0].strip(), r[1].strip()
        photos = [u.strip() for u in r[6:10] if u.strip()]
        famille = (SPECIES.get(nom_sci) or {}).get("famille")
        entries[nom_sci] = {"nomFr": nom_fr, "famille": famille, "photos": photos}

    out_js = (
        "/* Genere par documents/mini-flore/build_app_data.py — ne pas editer a la main.\n"
        "   Regenerer avec : python3 documents/mini-flore/build_app_data.py\n"
        "   Cle = nom scientifique, identique au champ `latin` de HABITATS[].especes[] (data.js). */\n"
        "const MINI_FLORE = "
        + json.dumps(entries, ensure_ascii=False, indent=2)
        + ";\n"
    )
    OUT.write_text(out_js, encoding="utf-8")
    print("Écrit :", OUT)
    print("Entrées :", len(entries))


if __name__ == "__main__":
    main()
