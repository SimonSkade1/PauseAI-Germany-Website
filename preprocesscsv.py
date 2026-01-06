import csv
import re
from pathlib import Path


def wahlkreis_to_bundesland(wk):
    if wk is None:
        return ""
    
    print(f"Processing Wahlkreis value: {wk}")

    # Extract number from strings like "Wahlkreis 092"
    if isinstance(wk, str):
        match = re.search(r"\d+", wk)
        if not match:
            return ""
        wahlkreis_num = int(match.group())
    else:
        try:
            wahlkreis_num = int(wk)
        except (TypeError, ValueError):
            return ""

    if   1 <= wahlkreis_num <= 11:  return "Schleswig-Holstein"
    if  12 <= wahlkreis_num <= 22:  return "Hamburg"
    if  23 <= wahlkreis_num <= 61:  return "Niedersachsen"
    if  62 <= wahlkreis_num <= 63:  return "Bremen"
    if  64 <= wahlkreis_num <= 128: return "Nordrhein-Westfalen"
    if 129 <= wahlkreis_num <= 147: return "Hessen"
    if 148 <= wahlkreis_num <= 162: return "Rheinland-Pfalz"
    if 163 <= wahlkreis_num <= 210: return "Baden-Württemberg"
    if 211 <= wahlkreis_num <= 257: return "Bayern"
    if 258 <= wahlkreis_num <= 259: return "Saarland"
    if 260 <= wahlkreis_num <= 267: return "Berlin"
    if 268 <= wahlkreis_num <= 277: return "Brandenburg"
    if 278 <= wahlkreis_num <= 283: return "Mecklenburg-Vorpommern"
    if 284 <= wahlkreis_num <= 299: return "Sachsen"
    if 300 <= wahlkreis_num <= 308: return "Sachsen-Anhalt"
    if 309 <= wahlkreis_num <= 316: return "Thüringen"

    return ""


def add_bundesland_column(
    input_csv: Path,
    output_csv: Path,
    wahlkreis_index: int = 4
):
    with input_csv.open(newline="", encoding="utf-8") as infile, \
         output_csv.open("w", newline="", encoding="utf-8") as outfile:

        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        for row in reader:
            # Skip empty lines safely
            if not row:
                writer.writerow(row)
                continue

            wk_value = row[wahlkreis_index] if len(row) > wahlkreis_index else ""
            bundesland = wahlkreis_to_bundesland(wk_value)

            writer.writerow(row + [bundesland])


if __name__ == "__main__":
    add_bundesland_column(
        input_csv=Path("public/BTAbgeordnete.csv"),
        output_csv=Path("public/BTAbgeordnete_with_bundesland.csv")
    )
