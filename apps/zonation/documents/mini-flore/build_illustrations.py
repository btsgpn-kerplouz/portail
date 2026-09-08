"""
Genere le document imprimable "Mini flore - Illustrations" : photos + noms
uniquement, regroupees par famille botanique, sans texte descriptif.

Les photos sont agencees en "galerie justifiee" : a partir des dimensions
reelles de chaque image (cache/image_dims.json), chaque ligne est
recalculee pour remplir exactement la largeur de la page (aucune bande
vide, aucune deformation), quel que soit le format des photos.

Pre-requis : avoir lance fetch_species_data.py et fetch_image_dims.py au
moins une fois (cache/species_data.json et cache/image_dims.json doivent
exister).

Usage : python3 build_illustrations.py
Sortie : ../mini-flore-illustrations.html
"""
import csv
import html
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
CSV_PATH = HERE.parent / "especes_zonation_illustrations(URL).csv"
DIMS_JSON = HERE / "cache" / "image_dims.json"
SPECIES_JSON = HERE / "cache" / "species_data.json"
OUT = HERE.parent / "mini-flore-illustrations.html"

CONTENT_W = 186.0   # mm, A4 210mm - 2*12mm margins
GAP = 3.0           # mm entre deux photos d'une meme ligne
TARGET_H = 55.0     # mm, hauteur de reference avant justification
MAX_H = 80.0        # mm, plafond pour qu'une ligne clairsemee ne s'etire pas demesurement
MAX_SCALE = MAX_H / TARGET_H

DIMS = json.loads(DIMS_JSON.read_text(encoding="utf-8"))
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


def get_ar(url):
    d = DIMS.get(url)
    return (d["w"] / d["h"]) if d and "w" in d else 4 / 3


def justify_row(row_urls):
    ars = [get_ar(u) for u in row_urls]
    total_w_at_target = sum(TARGET_H * ar for ar in ars) + GAP * (len(row_urls) - 1)
    natural_scale = CONTENT_W / total_w_at_target if total_w_at_target > 0 else 1.0
    scale = min(natural_scale, MAX_SCALE)
    h = TARGET_H * scale
    widths = [h * ar for ar in ars]
    blank = max(0.0, CONTENT_W - (sum(widths) + GAP * (len(row_urls) - 1)))
    return h, widths, blank


def all_contiguous_partitions(seq):
    n = len(seq)
    if n == 0:
        yield []
        return
    for mask in range(1 << (n - 1)):
        groups, start = [], 0
        for i in range(n - 1):
            if mask & (1 << i):
                groups.append(seq[start:i + 1])
                start = i + 1
        groups.append(seq[start:])
        yield groups


def best_row_grouping(urls):
    """Choisit le decoupage en lignes qui minimise l'espace blanc total."""
    best = None
    for groups in all_contiguous_partitions(urls):
        total_blank = total_h = 0.0
        for g in groups:
            h, _, blank = justify_row(g)
            total_blank += blank
            total_h += h
        total_h += GAP * (len(groups) - 1)
        key = (round(total_blank, 1), len(groups), total_h)
        if best is None or key < best[0]:
            best = (key, groups)
    return best[1]


def build_thumbs_html(urls, nom_fr):
    out = []
    for row_urls in best_row_grouping(urls):
        h, widths, _ = justify_row(row_urls)
        cells = "".join(
            f'<img src="{html.escape(u)}" alt="{html.escape(nom_fr)}" '
            f'style="width:{w:.1f}mm;height:{h:.1f}mm;" loading="lazy">'
            for u, w in zip(row_urls, widths)
        )
        out.append(f'<div class="photo-row">{cells}</div>')
    return "".join(out)


def main():
    rows = list(csv.reader(CSV_PATH.open(encoding="utf-8-sig"), delimiter=";"))

    with_images, without_images = [], []
    for r in rows[1:]:
        if len(r) < 10 or not r[0].strip():
            continue
        nom_sci, nom_fr, statut = r[0].strip(), r[1].strip(), r[2].strip()
        urls = [u.strip() for u in r[6:10] if u.strip()]
        entry = (nom_sci, nom_fr, statut, urls)
        (with_images if urls else without_images).append(entry)

    with_images.sort(key=lambda e: (famille_of(e[0]), e[0]))
    without_images.sort(key=lambda e: (famille_of(e[0]), e[0]))

    cards = []
    current_famille = None
    for nom_sci, nom_fr, statut, urls in with_images:
        famille = famille_of(nom_sci)
        if famille != current_famille:
            cards.append(f'<h2 class="famille">{html.escape(famille)}</h2>')
            current_famille = famille
        thumbs_html = build_thumbs_html(urls, nom_fr)
        cards.append(f'''
    <article class="card">
      <div class="card-head">
        <span class="fr">{html.escape(nom_fr)}</span>
        <span class="sci">{html.escape(nom_sci)}</span>
        <span class="statut {statut_class(statut)}">{statut_label(statut)}</span>
      </div>
      {thumbs_html}
    </article>''')

    missing_by_famille = {}
    for nom_sci, nom_fr, statut, urls in without_images:
        missing_by_famille.setdefault(famille_of(nom_sci), []).append((nom_sci, nom_fr))
    missing_list = "".join(
        f'<li class="famille-heading">{html.escape(fam)}</li>' +
        "".join(f'<li><span class="sci">{html.escape(ns)}</span> — {html.escape(nf)}</li>' for ns, nf in items)
        for fam, items in sorted(missing_by_famille.items())
    )

    html_doc = f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Mini flore — Illustrations — Zonation</title>
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

  .famille {{ font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 8pt; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; color: var(--page); background: var(--ink); margin: 5mm 0 2.5mm; padding: 1.6mm 3mm; break-after: avoid; page-break-after: avoid; }}
  .famille:first-child {{ margin-top: 0; }}

  .card {{ padding: 2.6mm 0; border-bottom: 0.5pt solid var(--ink-14); break-inside: avoid; page-break-inside: avoid; }}
  .card-head {{ display: flex; align-items: baseline; gap: 2.5mm; margin-bottom: 1.6mm; }}
  .card-head .fr {{ font-weight: 700; font-size: 11pt; line-height: 1.1; }}
  .card-head .sci {{ font-family: "IBM Plex Serif", Georgia, serif; font-style: italic; font-size: 9pt; color: var(--ink-66); line-height: 1.1; }}
  .card-head .statut {{ margin-left: auto; font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 6.5pt; text-transform: uppercase; letter-spacing: 0.02em; white-space: nowrap; }}
  .statut.car {{ color: var(--car); }} .statut.freq {{ color: var(--freq); }} .statut.car-freq {{ color: var(--car); }}

  .photo-row {{ display: flex; gap: 3mm; margin-bottom: 3mm; }}
  .photo-row:last-child {{ margin-bottom: 0; }}
  .photo-row img {{ display: block; object-fit: cover; border: 0.5pt solid var(--ink-14); }}

  .missing-page {{ margin-top: 8mm; padding-top: 4mm; border-top: 1.5pt solid var(--ink); break-before: page; }}
  .missing-page h2 {{ font-family: "IBM Plex Serif", Georgia, serif; font-weight: 600; font-size: 12pt; margin: 0 0 1mm; }}
  .missing-page .note {{ font-size: 8pt; color: var(--ink-66); margin-bottom: 4mm; }}
  .missing-page ul {{ columns: 2; column-gap: 8mm; margin: 0; padding: 0; list-style: none; font-size: 8.3pt; line-height: 1.9; }}
  .missing-page li {{ break-inside: avoid; }}
  .missing-page li.famille-heading {{ font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 7pt; font-weight: 500; text-transform: uppercase; letter-spacing: 0.03em; color: var(--ink-66); margin-top: 2mm; }}
  .missing-page .sci {{ font-family: "IBM Plex Serif", Georgia, serif; font-style: italic; color: var(--ink-66); }}
  .missing-page .sources {{ margin-top: 6mm; padding-top: 3mm; border-top: 0.5pt solid var(--ink-14); font-size: 6.8pt; color: var(--ink-40); line-height: 1.6; }}

  @media print {{ html, body {{ background: var(--page); }} .sheet {{ margin: 0; width: auto; min-height: auto; box-shadow: none; }} @page {{ size: A4; margin: 12mm; }} }}
  @media screen {{ .sheet {{ box-shadow: 0 1px 4px rgba(0,0,0,.15); }} }}
</style>
</head>
<body>
  <div class="sheet">
    <header class="doc-head">
      <h1>Mini flore — Illustrations</h1>
      <div class="sub">Petite Mer de Gâvres<br>{len(with_images)} espèces illustrées</div>
    </header>
    <div class="legend">
      <span><span class="dot car"></span>Caractéristique</span>
      <span><span class="dot freq"></span>Fréquente</span>
    </div>
    {"".join(cards)}

    <div class="missing-page">
      <h2>Espèces restant à illustrer</h2>
      <p class="note">{len(without_images)} espèces de la liste ne disposent pas encore d'illustration compilée.</p>
      <ul>{missing_list}</ul>
      <p class="sources">Photographies : Tela Botanica (eflore.tela-botanica.org), crédits variables selon auteur.<br>
      Voir le document compagnon « Mini flore — Descriptions » pour les textes descriptifs.</p>
    </div>
  </div>
</body>
</html>
'''
    OUT.write_text(html_doc, encoding="utf-8")
    print("Écrit :", OUT)
    print("Cartes:", len(with_images), "| Sans image:", len(without_images))


if __name__ == "__main__":
    main()
