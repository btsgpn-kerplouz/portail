"""
Recupere la largeur/hauteur reelle de chaque photo listee dans le CSV,
necessaires a build_illustrations.py pour calculer un agencement "galerie
justifiee" (chaque ligne de photos remplit exactement la largeur de page,
sans bande vide ni deformation).

Usage : python3 fetch_image_dims.py
Sortie : cache/image_dims.json
A relancer si de nouvelles URLs de photos sont ajoutees au CSV (les URLs
deja connues ne sont pas re-telechargees inutilement si tu adaptes le
script pour ne traiter que les nouvelles - actuellement il retelecharge
tout, ce qui reste rapide : ~130 images en 2-3 minutes).
"""
import csv
import json
import time
import urllib.request
from io import BytesIO
from pathlib import Path

from PIL import Image

HERE = Path(__file__).resolve().parent
CSV_PATH = HERE.parent / "especes_zonation_illustrations(URL).csv"
OUT_JSON = HERE / "cache" / "image_dims.json"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; mini-flore-zonation-script/1.0)"}


def get_dims(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as r:
        data = r.read()
    return Image.open(BytesIO(data)).size


def main():
    with open(CSV_PATH, encoding="utf-8-sig") as f:
        rows = list(csv.reader(f, delimiter=";"))

    urls = set()
    for r in rows[1:]:
        if len(r) < 10 or not r[0].strip():
            continue
        for u in r[6:10]:
            u = u.strip()
            if u:
                urls.add(u)
    urls = sorted(urls)
    print("Images uniques a traiter:", len(urls))

    results = {}
    if OUT_JSON.exists():
        results = json.loads(OUT_JSON.read_text(encoding="utf-8"))

    for i, u in enumerate(urls):
        if u in results and "w" in results[u]:
            continue  # deja connu, on ne re-telecharge pas
        try:
            w, h = get_dims(u)
            results[u] = {"w": w, "h": h}
            print(f"[{i+1}/{len(urls)}] OK {u} -> {w}x{h}")
        except Exception as e:
            results[u] = {"error": str(e)}
            print(f"[{i+1}/{len(urls)}] ERREUR {u} -> {e}")
        time.sleep(0.15)

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print("Ecrit ->", OUT_JSON)


if __name__ == "__main__":
    main()
