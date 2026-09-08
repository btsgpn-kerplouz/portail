"""
Recupere, pour chaque espece du CSV, sa famille botanique et sa description
(uniquement des sources sures et publiques) aupres de l'API/site Tela Botanica.

IMPORTANT (lecon apprise) : le champ "description collaborative" d'eFlore
(class="description wikini editable_sur_clic") est un espace libre modifiable
par n'importe quel visiteur du site. On y a trouve un commentaire personnel
hors-sujet contenant une adresse email. Ce script NE L'UTILISE JAMAIS.
Seules deux sources sont exploitees :
  - class="description coste"  -> texte de l'Abbe H. Coste (1901-1906,
    domaine public), numerise par le projet Tela Botanica. Fiable.
  - "Description Baseflor"     -> index ecologique structure de Julve, Ph.,
    reseau Tela Botanica. Fiable, sans texte libre.

Usage : python3 fetch_species_data.py
Sortie : cache/species_data.json
A relancer si le CSV gagne de nouvelles especes.
"""
import csv
import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
CSV_PATH = HERE.parent / "especes_zonation_illustrations(URL).csv"
OUT_JSON = HERE / "cache" / "species_data.json"

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; mini-flore-zonation-script/1.0)"}


def http_get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", errors="ignore")


def search_bdtfx(nom, mode="stricte"):
    url = (
        "https://api.tela-botanica.org/service:eflore:0.1/bdtfx/noms?masque="
        + urllib.parse.quote(nom)
        + f"&recherche={mode}"
    )
    try:
        data = json.loads(http_get(url))
    except Exception:
        return []
    if int(data.get("entete", {}).get("total", 0)) == 0:
        return []
    return list(data.get("resultat", {}).values())


def get_nom_detail(num_nom):
    url = f"https://api.tela-botanica.org/service:eflore:0.1/bdtfx/noms/{num_nom}"
    try:
        return json.loads(http_get(url))
    except Exception:
        return None


def strip_variants(nom):
    """Formes simplifiees a essayer si le nom exact n'est pas trouve."""
    candidates = [nom]
    n2 = re.sub(r"\s+(gr\.|s\.l\.|s\.str\.|sp\.)$", "", nom).strip()
    if n2 != nom and n2 not in candidates:
        candidates.append(n2)
    m = re.match(r"^(\S+\s+\S+)\s+(subsp\.|var\.|f\.)\s+.+$", n2)
    if m and m.group(1) not in candidates:
        candidates.append(m.group(1))
    for c in list(candidates):
        if " x " in c:
            hc = c.replace(" x ", " ×")
            if hc not in candidates:
                candidates.append(hc)
    genus = nom.split(" ")[0]
    if genus not in candidates:
        candidates.append(genus)
    return candidates


def find_num_nom(nom_sci):
    for cand in strip_variants(nom_sci):
        results = search_bdtfx(cand, mode="stricte")
        if not results:
            continue
        exact = [r for r in results if r.get("nom_sci", "").lower() == cand.lower()]
        chosen = exact[0] if exact else results[0]
        num_nom = chosen["href"].rstrip("/").split("/")[-1]
        detail = get_nom_detail(num_nom)
        if detail:
            return detail.get("nom_retenu.id") or num_nom, detail.get("famille")
        return num_nom, None
    return None, None


def clean(s):
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t]+", " ", s)
    s = re.sub(r"\n[ \t]*", "\n", s)
    s = re.sub(r"\n{2,}", "\n", s)
    return s.strip(" \n-")


def parse_coste_official(html_text):
    """Bloc officiel non-editable (Abbe Coste, domaine public). Le seul texte libre qu'on garde."""
    m = re.search(r'<div class="description coste">(.*?)</table>', html_text, re.S)
    if not m:
        return None
    rows = re.findall(r"<tr>(.*?)</tr>", m.group(1), re.S)
    out = {}
    paragraphs = []
    for row in rows:
        titre_m = re.search(r'<span class="titre">\s*([^<]+?)\s*</span>(.*)', row, re.S)
        if titre_m:
            label = titre_m.group(1).strip().rstrip(":").strip().lower().replace("é", "e")
            if label in ("ecologie", "repartition", "floraison"):
                out[label] = clean(titre_m.group(2))
            continue
        text = clean(row)
        if not text or re.match(r"^\d+\s", text):
            continue
        paragraphs.append(text)
    if paragraphs:
        out["description"] = "\n".join(paragraphs)
    return out or None


def parse_baseflor(html_text):
    m = re.search(r'<h2>\s*Description Baseflor\s*:.*?</h2>(.*?)Julve, Ph\.', html_text, re.S)
    if not m or "Aucune donnée" in m.group(1):
        return None
    pairs = re.findall(
        r'<span class="titre">\s*([^:<]+?)\s*:\s*</span>(.*?)(?=<span class="titre">|</td>)',
        m.group(1), re.S,
    )
    out = {k.strip(): clean(v) for k, v in pairs if clean(v)}
    return out or None


def main():
    with open(CSV_PATH, encoding="utf-8-sig") as f:
        rows = list(csv.reader(f, delimiter=";"))

    species = [(r[0].strip(), r[1].strip()) for r in rows[1:] if r and r[0].strip()]

    results = {}
    for i, (nom_sci, nom_fr) in enumerate(species):
        print(f"[{i+1}/{len(species)}] {nom_sci} ...")
        num_nom, famille = find_num_nom(nom_sci)
        entry = {"nom_sci": nom_sci, "nom_fr": nom_fr, "num_nom": num_nom, "famille": famille}
        if num_nom:
            try:
                desc_html = http_get(
                    "https://www.tela-botanica.org/eflore/?referentiel=bdtfx&module=fiche"
                    f"&action=fiche&num_nom={num_nom}&onglet=description"
                )
                coste = parse_coste_official(desc_html)
                baseflor = parse_baseflor(desc_html)
                if coste:
                    entry["coste"] = coste
                if baseflor:
                    entry["baseflor"] = baseflor
            except Exception as e:
                entry["error"] = str(e)
        results[nom_sci] = entry
        time.sleep(0.3)

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    n_coste = sum(1 for v in results.values() if v.get("coste"))
    n_fam = sum(1 for v in results.values() if v.get("famille"))
    print(f"\nTotal: {len(results)} | avec description Coste: {n_coste} | avec famille: {n_fam}")
    print("Ecrit ->", OUT_JSON)


if __name__ == "__main__":
    main()
