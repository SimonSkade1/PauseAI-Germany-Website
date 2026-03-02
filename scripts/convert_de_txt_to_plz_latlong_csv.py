#!/usr/bin/env python3
import csv
from pathlib import Path

INPUT_PATH = Path('public/DE.txt')
OUTPUT_PATH = Path('public/DE_plz_latlong.csv')


def main() -> None:
    written = 0

    with INPUT_PATH.open('r', encoding='utf-8', newline='') as infile, OUTPUT_PATH.open(
        'w', encoding='utf-8', newline=''
    ) as outfile:
        reader = csv.reader(infile, delimiter='\t')
        writer = csv.writer(outfile)
        writer.writerow(['PLZ', 'latlong'])

        for row in reader:
            if len(row) < 11:
                continue

            plz = row[1].strip()
            lat = row[9].strip()
            lon = row[10].strip()

            if not plz or not lat or not lon:
                continue

            writer.writerow([plz, f'{lat},{lon}'])
            written += 1

    print(f'Wrote {written} rows to {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
