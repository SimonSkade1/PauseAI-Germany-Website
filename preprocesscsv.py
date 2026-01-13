import csv
import re
from pathlib import Path


def wahlkreis_to_bundesland(wk):
    if wk is None:
        return ""
    if isinstance(wk, str):
        wk = wk.strip()

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


def split_name(full_name: str):
    if not full_name:
        return "", ""
    name = full_name.strip()
    # NOTE: titles are extracted separately by `extract_title` when needed

    # If comma present assume 'Last, First'
    if ',' in name:
        parts = [p.strip() for p in name.split(',', 1)]
        last = parts[0]
        first = parts[1]
        return first, last

    tokens = name.split()
    if len(tokens) == 1:
        return tokens[0], ""
    # First name: everything except last token; Last name: last token
    first = " ".join(tokens[:-1])
    last = tokens[-1]
    return first, last


def extract_title(full_name: str):
    """Extract leading academic/title tokens from a name.

    Returns (title_str, remainder_name). Title is blank if none.
    """
    if not full_name:
        return "", full_name
    tokens = full_name.strip().split()
    titles = []
    # common title tokens (lowercase, without trailing dots)
    common = {"dr", "prof", "professor", "phd", "dr-med", "md", "frhr", "herr", "frau"}
    for tok in tokens:
        # normalize token (strip trailing periods and commas)
        norm = tok.rstrip('.,').lower()
        if norm in common or tok.endswith('.') or (len(norm) <= 4 and any(c.isalpha() for c in norm) and norm.isupper() == False and '.' in tok):
            titles.append(tok)
            continue
        # stop when token doesn't look like a title
        break

    if not titles:
        return "", full_name.strip()
    title_str = " ".join(titles)
    remainder = " ".join(tokens[len(titles):])
    return title_str, remainder


def add_bundesland_column(
    input_csv: Path,
    output_csv: Path,
    wahlkreis_index: int | None = None
):
    with input_csv.open(newline="", encoding="utf-8") as infile, \
         output_csv.open("w", newline="", encoding="utf-8") as outfile:

        reader = csv.reader(infile)
        writer = csv.writer(outfile)

        rows = list(reader)
        if not rows:
            return

        first = rows[0]

        # Detect header row if it contains a 'Wahlkreis' cell (case-insensitive)
        header_present = any((cell or "").strip().lower() == "wahlkreis" for cell in first)

        if header_present:
            header = first
            # find indices
            detected_w_index = None
            detected_b_index = None
            detected_n_index = None
            detected_name_index = None
            for i, cell in enumerate(header):
                if cell is None:
                    continue
                key = cell.strip().lower()
                if key == "wahlkreis":
                    detected_w_index = i
                if key == "bundesland":
                    detected_b_index = i
                if key in ("wahlkreisnummer", "wahlkreis_nummer") or ("wahlkreis" in key and ("nummer" in key or "num" in key)):
                    detected_n_index = i
                if key == "name":
                    detected_name_index = i

            if wahlkreis_index is None:
                wahlkreis_index = detected_w_index if detected_w_index is not None else 3

            # Prepare and write header: append Bundesland, WahlkreisNummer, Title, FirstName, LastName if missing
            out_header = list(header)
            if detected_b_index is None:
                out_header.append("Bundesland")
            if detected_n_index is None:
                out_header.append("WahlkreisNummer")
            # Add FirstName/LastName if not present
            # detect if firstname/lastname already exist
            has_first = any(((c or "").strip().lower() == "firstname") for c in out_header)
            has_last = any(((c or "").strip().lower() == "lastname") for c in out_header)
            has_title = any(((c or "").strip().lower() == "title") for c in out_header)
            if not has_first:
                out_header.append("FirstName")
            if not has_last:
                out_header.append("LastName")
            if not has_title:
                # place Title before FirstName/LastName for readability
                # insert Title just before FirstName if present, otherwise append
                try:
                    idx = out_header.index("FirstName")
                    out_header.insert(idx, "Title")
                except ValueError:
                    out_header.append("Title")

            # recompute indices from out_header
            bundesland_index = None
            wahlkreis_num_index = None
            firstname_index = None
            lastname_index = None
            title_index = None
            for i, cell in enumerate(out_header):
                if cell is None:
                    continue
                key = cell.strip().lower()
                if key == "bundesland":
                    bundesland_index = i
                if key in ("wahlkreisnummer", "wahlkreis_nummer") or ("wahlkreis" in key and ("nummer" in key or "num" in key)):
                    wahlkreis_num_index = i
                if key == "firstname" or key == "first name":
                    firstname_index = i
                if key == "lastname" or key == "last name":
                    lastname_index = i
                if key == "title":
                    title_index = i

            writer.writerow(out_header)
            data_rows = rows[1:]
        else:
            # No header present; assume common positions if not provided
            if wahlkreis_index is None:
                wahlkreis_index = 3
            bundesland_index = None
            data_rows = rows

        for row in data_rows:
            # Skip empty lines safely
            if not row:
                writer.writerow(row)
                continue
            wk_value = row[wahlkreis_index] if len(row) > wahlkreis_index else ""
            bundesland = wahlkreis_to_bundesland(wk_value)

            # extract numeric wahlkreis number (string), empty if none
            wnum_match = re.search(r"\d+", wk_value or "")
            wahlkreis_num_str = wnum_match.group().lstrip("0") if wnum_match else ""
            if wahlkreis_num_str == "":
                wahlkreis_num_str = wnum_match.group() if wnum_match and wnum_match.group() == "0" else wahlkreis_num_str

            # split name into title, first, last
            name_val = ""
            if 'detected_name_index' in locals() and detected_name_index is not None and len(row) > detected_name_index:
                name_val = row[detected_name_index]
            elif len(row) > 0:
                # if no detected name index, assume first column is name
                name_val = row[0]
            title_str, name_wo_title = extract_title(name_val)
            first_name, last_name = split_name(name_wo_title)

            # If we have indices (header case), place values into correct columns
            if 'bundesland_index' in locals() and bundesland_index is not None:
                # ensure row is long enough for all target indices
                max_index = max(i for i in (bundesland_index, wahlkreis_num_index or 0, firstname_index or 0, lastname_index or 0, title_index or 0) if i is not None)
                if len(row) <= max_index:
                    row.extend([""] * (max_index - len(row) + 1))

                row[bundesland_index] = bundesland
                if wahlkreis_num_index is not None:
                    row[wahlkreis_num_index] = wahlkreis_num_str
                if firstname_index is not None:
                    row[firstname_index] = first_name
                if lastname_index is not None:
                    row[lastname_index] = last_name
                if title_index is not None:
                    row[title_index] = title_str

                writer.writerow(row)
            else:
                # No header scenario: append Bundesland, WahlkreisNummer, Title, FirstName, LastName
                writer.writerow(row + [bundesland, wahlkreis_num_str, title_str, first_name, last_name])


if __name__ == "__main__":
    add_bundesland_column(
        input_csv=Path("public/BTAbgeordnete.csv"),
        output_csv=Path("public/BTAbgeordnete_with_bundesland.csv")
    )
