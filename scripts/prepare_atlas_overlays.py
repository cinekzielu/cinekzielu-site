"""Export the manual world's paths without its unused embedded reference raster.

Run after editing world-continent-overlays.svg. The original SVG stays unchanged.
Uses only Python's standard library. Output order and path strings match the
original browser parser; no projection, simplification or coordinate edits.
"""
import hashlib
import json
from pathlib import Path
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parents[1]
source = root / 'src/assets/maps/world-continent-overlays.svg'
target = root / 'src/data/worldOverlayPaths.json'
svg = ET.parse(source).getroot()
ids = ['europe', 'asia', 'africa', 'north-america', 'south-america', 'oceania']
inkscape = '{http://www.inkscape.org/namespaces/inkscape}label'
paths = {id: [] for id in ids}
for node in svg.iter():
    tag = node.tag.split('}')[-1]
    if tag not in ['g', 'path']:
        continue
    candidates = [node.get(key, '') for key in ['id', inkscape, 'label', 'data-name', 'data-continent']]
    id = next((value for item in candidates if (value := '-'.join(item.strip().lower().split())) in ids), None)
    if id is None:
        continue
    elements = [node] if tag == 'path' else [child for child in node.iter() if child.tag.split('}')[-1] == 'path']
    paths[id].extend(child.get('d') for child in elements if child.get('d'))
assert all(paths.values()), 'Every supported continent must have at least one path'
result = {
    'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'viewBox': svg.get('viewBox', '0 0 560 360'),
    'continents': [{'id': id, 'paths': list(dict.fromkeys(paths[id]))} for id in ids],
}
target.write_text(json.dumps(result, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
print(f'{source.stat().st_size:,} bytes of SVG -> {target.stat().st_size:,} bytes of exact path data')
