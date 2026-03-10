#!/usr/bin/env python3
"""Generate a complete CfRR offering catalogue from notebook metadata."""

from __future__ import annotations

import json
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COURSES_DIR = ROOT.parent / "CfRR_Courses" / "programme_information"
OUT_JSON = ROOT / "data" / "course_catalog.json"
OUT_MD = ROOT / "course_list.md"

OBJECTIVES_RE = re.compile(r"^##\s*course objectives?\b|^##\s*objectives?\b", re.I | re.M)
SHORT_RE = re.compile(r"drop\s*in|short\s*course|short\s*session", re.I)
OVERVIEW_FILE_RE = re.compile(
    r"^(programme_information|python|r|julia|unix|version_control|coding_languages|coding_practices|"
    r"high_performance_computing|gpus|software_development|computational_thinking_overview)\.ipynb$",
    re.I,
)


def title_and_summary(nb: dict, fallback: str) -> tuple[str, str]:
    title = fallback
    summary = ""
    for cell in nb.get("cells", []):
        if cell.get("cell_type") != "markdown":
            continue
        text = "".join(cell.get("source", [])).strip()
        if not text:
            continue
        if title == fallback:
            m = re.search(r"^#\s+(.+)$", text, re.M)
            if m:
                title = m.group(1).strip()
        if not summary:
            for line in text.splitlines():
                s = line.strip()
                if s and not s.startswith("#"):
                    summary = s
                    break
        if title != fallback and summary:
            break
    return title, summary


def classify(filename: str, title: str, summary: str, has_objectives: bool) -> str:
    # Keep short-course detection strict to avoid false matches from prerequisite links.
    if SHORT_RE.search(title) or SHORT_RE.search(summary):
        return "short"
    if has_objectives:
        return "full"
    if OVERVIEW_FILE_RE.match(filename):
        return "overview"
    return "full"


def main() -> None:
    notebooks = sorted(COURSES_DIR.glob("*.ipynb"))
    rows: list[dict[str, str]] = []

    for path in notebooks:
        with path.open("r", encoding="utf-8") as f:
            nb = json.load(f)

        fallback = path.stem.replace("_", " ").strip().title()
        title, summary = title_and_summary(nb, fallback)

        markdown_cells = [
            "".join(c.get("source", [])) for c in nb.get("cells", []) if c.get("cell_type") == "markdown"
        ]
        full_text = "\n".join(markdown_cells)
        has_objectives = bool(OBJECTIVES_RE.search(full_text))

        offering_type = classify(path.name, title, summary, has_objectives)
        rows.append(
            {
                "title": title,
                "filename": path.name,
                "offering_type": offering_type,
                "summary": summary,
            }
        )

    rows.sort(key=lambda r: r["title"].casefold())

    full_courses = [r for r in rows if r["offering_type"] == "full"]
    short_courses = [r for r in rows if r["offering_type"] == "short"]
    overview_pages = [r for r in rows if r["offering_type"] == "overview"]

    payload = {
        "generated_on": date.today().isoformat(),
        "total_items": len(rows),
        "full_count": len(full_courses),
        "short_count": len(short_courses),
        "overview_count": len(overview_pages),
        "full_courses": full_courses,
        "short_courses": short_courses,
        "overview_pages": overview_pages,
        "all_items": rows,
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with OUT_JSON.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
        f.write("\n")

    with OUT_MD.open("w", encoding="utf-8") as f:
        f.write("# CfRR Pick-and-Mix Course List\n\n")
        f.write(f"Generated on: {payload['generated_on']}\n\n")
        f.write(f"Total listed items: {payload['total_items']}\n")
        f.write(f"Full courses: {payload['full_count']}\n")
        f.write(f"Short courses: {payload['short_count']}\n")
        f.write(f"Overview pages: {payload['overview_count']}\n\n")

        f.write("## Full Courses\n\n")
        for item in full_courses:
            f.write(f"- **{item['title']}** (`{item['filename']}`)\n")

        f.write("\n## Short Courses\n\n")
        for item in short_courses:
            f.write(f"- **{item['title']}** (`{item['filename']}`)\n")

        f.write("\n## Overview Pages\n\n")
        for item in overview_pages:
            f.write(f"- **{item['title']}** (`{item['filename']}`)\n")

    print(f"Wrote {OUT_JSON}")
    print(f"Wrote {OUT_MD}")
    print(f"Full: {len(full_courses)} | Short: {len(short_courses)} | Overview: {len(overview_pages)}")


if __name__ == "__main__":
    main()
