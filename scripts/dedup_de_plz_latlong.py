#!/usr/bin/env python3
import csv
from pathlib import Path

INPUT_PATH = Path('public/DE_plz_latlong.csv')
OUTPUT_PATH = Path('public/DE_plz_latlong_dedup.csv')


def main() -> None:
    seen = set()
    written = 0

    with INPUT_PATH.open('r', encoding='utf-8', newline='') as infile, OUTPUT_PATH.open('w', encoding='utf-8', newline='') as outfile:
        reader = csv.DictReader(infile)
        writer = csv.writer(outfile)
        writer.writerow(['PLZ', 'latlong'])

        for row in reader:
            plz = (row.get('PLZ') or '').strip()
            latlong = (row.get('latlong') or '').strip()
            if not plz or not latlong:
                continue
            if plz in seen:
                continue
            seen.add(plz)
            writer.writerow([plz, latlong])
            written += 1

    print(f'Wrote {written} unique PLZ rows to {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
