"""Packs dist/ into acm-site-upload.zip for cPanel (File Manager > Upload > Extract).

Run after `npm run build`:  python scripts/make_upload_zip.py

Paths use forward slashes and every entry carries Unix permissions
(0644 files, 0755 folders); without them cPanel extracts files as
world-writable 0666, which PHP refuses to run on most shared hosts.
"""

import os
import time
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'dist')
OUT = os.path.join(ROOT, 'acm-site-upload.zip')

# ZIP times carry no time zone, so the server reads them in its own zone. Local
# time (IST, ahead of the server) produced future dates that made browsers keep
# stale pages. A UTC time a day in the past is safely "earlier" everywhere.
STAMP = time.gmtime(time.time() - 86400)[:6]


def entry(name: str, mode: int, is_dir: bool = False) -> zipfile.ZipInfo:
    info = zipfile.ZipInfo(name + ('/' if is_dir else ''))
    info.external_attr = ((0o040000 if is_dir else 0o100000) | mode) << 16
    info.date_time = STAMP
    info.compress_type = zipfile.ZIP_DEFLATED
    return info


with zipfile.ZipFile(OUT, 'w') as z:
    for root, dirs, files in os.walk(SRC):
        rel_root = os.path.relpath(root, SRC).replace(os.sep, '/')
        for d in sorted(dirs):
            z.writestr(entry(d if rel_root == '.' else f'{rel_root}/{d}', 0o755, True), '')
        for f in sorted(files):
            name = f if rel_root == '.' else f'{rel_root}/{f}'
            with open(os.path.join(root, f), 'rb') as fh:
                z.writestr(entry(name, 0o644), fh.read())

with zipfile.ZipFile(OUT) as z:
    files = [n for n in z.namelist() if not n.endswith('/')]
    print(f'{OUT}: {len(files)} files, {os.path.getsize(OUT) / 1e6:.1f} MB')
