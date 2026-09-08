"""
Genere le document imprimable "Mini flore - Descriptions" : texte seul
(description Coste ou, a defaut, traits Baseflor), regroupe par famille,
sur 2 colonnes par page. Document compagnon de build_illustrations.py.

Pre-requis : avoir lance fetch_species_data.py au moins une fois
(cache/species_data.json doit exister).

Usage : python3 build_descriptions.py
Sortie : ../mini-flore-descriptions.html
"""
import csv
import html
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
CSV_PATH = HERE.parent / "especes_zonation_illustrations(URL).csv"
SPECIES_JSON = HERE / "cache" / "species_data.json"
OUT = HERE.parent / "mini-flore-descriptions.html"

SPECIES = json.loads(SPECIES_JSON.read_text(encoding="utf-8"))


def famille_of(nom_sci):
    return (SPECIES.get(nom_sci) or {}).get("famille") or "Famille non déterminée"


def statut_class(statut):
    s = statut.lower()
    if "caractéristique" in s and "fréquente" in s:
        return "car-freq"
    if "caractéristique" in s:
        return "car"
    return "freq"


def statut_label(statut):
    s = statut.lower()
    if "caractéristique" in s and "fréquente" in s:
        return "Caract. + fréq."
    if "caractéristique" in s:
        return "Caractéristique"
    return "Fréquente"


def build_body(nom_sci):
    entry = SPECIES.get(nom_sci) or {}
    coste = entry.get("coste") or {}
    baseflor = entry.get("baseflor") or {}
    desc_text = coste.get("description")
    if desc_text:
        footer_bits = []
        if coste.get("floraison"):
            footer_bits.append(f"Floraison : {coste['floraison'].rstrip('. ')}")
        if coste.get("ecologie"):
            footer_bits.append(f"Écologie : {coste['ecologie'].rstrip('. ')}")
        footer = f'<p class="desc-footer">{html.escape(" · ".join(footer_bits))}</p>' if footer_bits else ""
        return f'<p class="desc-text">{html.escape(desc_text)}</p>{footer}'
    if baseflor:
        bits = []
        if baseflor.get("Type Biologique"):
            bits.append(baseflor["Type Biologique"])
        if baseflor.get("Floraison"):
            bits.append(f"Floraison : {baseflor['Floraison']}")
        if baseflor.get("Couleur de la fleur"):
            bits.append(f"Couleur de la fleur : {baseflor['Couleur de la fleur']}")
        if baseflor.get("Chorologie"):
            bits.append(f"Chorologie : {baseflor['Chorologie'].strip()}")
        if bits:
            return f'<p class="desc-footer desc-footer-only">{html.escape(" · ".join(bits))}</p>'
    return '<p class="desc-missing">Aucune description disponible pour le moment.</p>'


def main():
    rows = list(csv.reader(CSV_PATH.open(encoding="utf-8-sig"), delimiter=";"))

    with_images = []
    for r in rows[1:]:
        if len(r) < 10 or not r[0].strip():
            continue
        nom_sci, nom_fr, statut = r[0].strip(), r[1].strip(), r[2].strip()
        urls = [u.strip() for u in r[6:10] if u.strip()]
        if urls:
            with_images.append((nom_sci, nom_fr, statut))

    with_images.sort(key=lambda e: (famille_of(e[0]), e[0]))

    entries = []
    current_famille = None
    for nom_sci, nom_fr, statut in with_images:
        famille = famille_of(nom_sci)
        if famille != current_famille:
            entries.append(f'<h2 class="famille">{html.escape(famille)}</h2>')
            current_famille = famille
        entries.append(f'''
    <article class="entry">
      <div class="entry-head">
        <span class="fr">{html.escape(nom_fr)}</span>
        <span class="sci">{html.escape(nom_sci)}</span>
        <span class="statut {statut_class(statut)}">{statut_label(statut)}</span>
      </div>
      {build_body(nom_sci)}
    </article>''')

    html_doc = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Mini flore — Descriptions — Zonation</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {{
    --ink: #191b16; --ink-66: rgba(25,27,22,.66); --ink-40: rgba(25,27,22,.40);
    --ink-14: rgba(25,27,22,.14); --page: #ffffff; --car: #5a6b3f; --freq: #6b6455;
  }}
  * {{ box-sizing: border-box; }}
  html, body {{ margin: 0; padding: 0; background: #e9e7e0; color: var(--ink); font-family: "IBM Plex Sans", system-ui, sans-serif; }}
  .sheet {{ width: 210mm; min-height: 297mm; margin: 8mm auto; background: var(--page); padding: 12mm 12mm 14mm; }}
  header.doc-head {{ display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1.5pt solid var(--ink); padding-bottom: 3mm; margin-bottom: 5mm; }}
  header.doc-head h1 {{ font-family: "IBM Plex Serif", Georgia, serif; font-weight: 600; font-size: 15pt; margin: 0; letter-spacing: -0.01em; }}
  header.doc-head .sub {{ font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 7.5pt; color: var(--ink-66); text-align: right; line-height: 1.5; }}
  .legend {{ display: flex; gap: 5mm; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 6.8pt; color: var(--ink-66); margin-bottom: 4mm; }}
  .legend .dot {{ display: inline-block; width: 2mm; height: 2mm; border-radius: 50%; margin-right: 1mm; vertical-align: middle; position: relative; top: -0.3mm; }}
  .dot.car {{ background: var(--car); }} .dot.freq {{ background: var(--freq); }}

  .columns {{ columns: 2; column-gap: 8mm; }}
  .famille {{ column-span: all; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 8pt; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; color: var(--page); background: var(--ink); margin: 4mm 0 2mm; padding: 1.4mm 3mm; break-after: avoid; }}
  .famille:first-child {{ margin-top: 0; }}
  .entry {{ break-inside: avoid; -webkit-column-break-inside: avoid; padding: 2.4mm 0; border-bottom: 0.5pt solid var(--ink-14); margin-bottom: 2mm; }}
  .entry-head {{ display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 2mm; margin-bottom: 1.2mm; }}
  .entry-head .fr {{ font-weight: 700; font-size: 9pt; line-height: 1.2; }}
  .entry-head .sci {{ font-family: "IBM Plex Serif", Georgia, serif; font-style: italic; font-size: 7.6pt; color: var(--ink-66); line-height: 1.2; }}
  .entry-head .statut {{ font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 5.8pt; text-transform: uppercase; letter-spacing: 0.02em; white-space: nowrap; }}
  .statut.car {{ color: var(--car); }} .statut.freq {{ color: var(--freq); }} .statut.car-freq {{ color: var(--car); }}

  .desc-text {{ margin: 0; font-size: 7.6pt; line-height: 1.35; }}
  .desc-footer {{ margin: 1mm 0 0; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 6.2pt; color: var(--ink-66); }}
  .desc-footer-only {{ margin-top: 0; }}
  .desc-missing {{ margin: 0; font-size: 7.4pt; font-style: italic; color: var(--ink-40); }}

  .sources {{ columns: 1; margin-top: 6mm; padding-top: 3mm; border-top: 0.5pt solid var(--ink-14); font-size: 6.8pt; color: var(--ink-40); line-height: 1.6; }}

  @media print {{ html, body {{ background: var(--page); }} .sheet {{ margin: 0; width: auto; min-height: auto; box-shadow: none; }} @page {{ size: A4; margin: 12mm; }} }}
  @media screen {{ .sheet {{ box-shadow: 0 1px 4px rgba(0,0,0,.15); }} }}
</style>
</head>
<body>
  <div class="sheet">
    <header class="doc-head">
      <h1>Mini flore — Descriptions</h1>
      <div class="sub">Petite Mer de Gâvres<br>{len(with_images)} espèces</div>
    </header>
    <div class="legend">
      <span><span class="dot car"></span>Caractéristique</span>
      <span><span class="dot freq"></span>Fréquente</span>
    </div>
    <div class="columns">
      {"".join(entries)}
    </div>
    <p class="sources">Descriptions : Abbé H. Coste, <em>Flore descriptive et illustrée de la France</em> (1901&#8211;1906, domaine public), numérisation Tela Botanica.<br>
    Traits écologiques : Julve, Ph. — Baseflor, réseau Tela Botanica.<br>
    Voir le document compagnon « Mini flore — Illustrations » pour les photos.</p>
  </div>
</body>
</html>
'''
    OUT.write_text(html_doc, encoding="utf-8")
    print("Écrit :", OUT)
    print("Entrées :", len(with_images))


if __name__ == "__main__":
    main()
