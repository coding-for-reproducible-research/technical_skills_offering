#!/usr/bin/env python3
"""Extract course learning objectives from CfRR notebooks.

Outputs:
- learning_objectives.md
- data/learning_objectives.json
"""

from __future__ import annotations

import json
import re
from collections import OrderedDict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COURSES_DIR = ROOT.parent / "CfRR_Courses" / "programme_information"
OUTPUT_MD = ROOT / "data" / "learning_objectives.generated.md"
OUTPUT_JSON = ROOT / "data" / "learning_objectives.json"

OBJECTIVE_HEADING_RE = re.compile(r"^##\s*course objectives?\b|^##\s*objectives?\b", re.I)
ANY_HEADING_RE = re.compile(r"^#{2,}\s+")
BULLET_RE = re.compile(r"^(?:[-*]|\d+\.)\s+(.*)")
TRAILING_LINK_RE = re.compile(r"\s*\[[^\]]+\]\([^\)]+\)")
STOP_RE = re.compile(r"pre[- ]?requisite|pre[- ]?requisites|sign[- ]?up|resources", re.I)


def filename_to_title(path: Path) -> str:
    return path.stem.replace("_", " ").strip().title()


def notebook_title(nb: dict, fallback: str) -> str:
    for cell in nb.get("cells", []):
        if cell.get("cell_type") != "markdown":
            continue
        for raw_line in cell.get("source", []):
            line = raw_line.strip()
            if line.startswith("# "):
                return line[2:].strip()
    return fallback


def clean_objective(line: str) -> str:
    out = line.strip()
    out = TRAILING_LINK_RE.sub("", out)
    out = out.strip()
    if out.endswith(" ."):
        out = out[:-2] + "."
    return out


def normalise_objective_key(text: str) -> str:
    return re.sub(r"[^\w]+", "", text.casefold())


def extract_objectives(nb: dict) -> list[str]:
    cells = [c for c in nb.get("cells", []) if c.get("cell_type") == "markdown"]
    for idx, cell in enumerate(cells):
        lines = [l.strip() for l in "".join(cell.get("source", [])).splitlines()]
        heading_ix = None
        for i, line in enumerate(lines):
            if OBJECTIVE_HEADING_RE.search(line):
                heading_ix = i
                break
        if heading_ix is None:
            continue

        objectives: list[str] = []

        def collect_from_lines(local_lines: list[str], start: int = 0) -> None:
            for local in local_lines[start:]:
                if ANY_HEADING_RE.match(local) and not OBJECTIVE_HEADING_RE.search(local):
                    break
                if STOP_RE.search(local):
                    break
                if local.casefold().startswith("if not we recommend"):
                    break
                m = BULLET_RE.match(local)
                if m:
                    text = clean_objective(m.group(1))
                    if text:
                        objectives.append(text)

        collect_from_lines(lines, heading_ix + 1)

        if not objectives and idx + 1 < len(cells):
            next_lines = [l.strip() for l in "".join(cells[idx + 1].get("source", [])).splitlines()]
            collect_from_lines(next_lines)

        if objectives:
            deduped: list[str] = []
            seen: set[str] = set()
            for objective in objectives:
                key = normalise_objective_key(objective)
                if key not in seen:
                    deduped.append(objective)
                    seen.add(key)
            return deduped

    return []


def theme_for_objective(text: str) -> str:
    t = text.casefold()
    rules = [
        (
            "Programming Foundations",
            ["python", "rstudio", "r ", "julia", "unix", "syntax", "function", "loop", "algorithm"],
        ),
        (
            "Reproducible Software and Version Control",
            ["version control", "git", "github", "reproduc", "testing", "virtual environment", "collaboration"],
        ),
        (
            "Data Analysis and Visualisation",
            ["data", "tidyverse", "numpy", "pandas", "matplotlib", "plotly", "regression", "model"],
        ),
        (
            "HPC and Performance",
            ["hpc", "gpu", "parallel", "cluster", "performance", "benchmark"],
        ),
        (
            "AI and Machine Learning",
            ["machine learning", "ai", "classification", "supervised", "unsupervised", "training data"],
        ),
        (
            "Documentation and Communication",
            ["markdown", "document", "report", "communicat", "presentation"],
        ),
    ]
    for theme, keywords in rules:
        if any(k in t for k in keywords):
            return theme
    return "General Technical Practice"


def main() -> None:
    notebooks = sorted(COURSES_DIR.glob("*.ipynb"))
    if not notebooks:
        raise SystemExit(f"No notebooks found in {COURSES_DIR}")

    by_course: OrderedDict[str, list[str]] = OrderedDict()
    all_rows: list[dict[str, str]] = []

    for path in notebooks:
        with path.open("r", encoding="utf-8") as f:
            nb = json.load(f)
        fallback = filename_to_title(path)
        course_name = notebook_title(nb, fallback)
        objectives = extract_objectives(nb)
        if not objectives:
            continue
        by_course[course_name] = objectives
        for objective in objectives:
            all_rows.append(
                {
                    "course": course_name,
                    "objective": objective,
                    "theme": theme_for_objective(objective),
                    "source_notebook": path.name,
                }
            )

    with OUTPUT_MD.open("w", encoding="utf-8") as f:
        f.write("# CfRR Learning Objectives\n\n")
        f.write(
            "This file aggregates learning objectives extracted from CfRR course notebooks in `CfRR_Courses/programme_information/`.\n"
        )
        f.write(f"\nGenerated on: {date.today().isoformat()}\n\n")
        f.write(f"Total objectives: {len(all_rows)}\n")
        f.write(f"Total courses with objectives: {len(by_course)}\n\n")

        for course, objectives in by_course.items():
            f.write(f"## {course}\n\n")
            for objective in objectives:
                f.write(f"- {objective}\n")
            f.write("\n")

    payload = {
        "generated_on": date.today().isoformat(),
        "course_count": len(by_course),
        "objective_count": len(all_rows),
        "courses": [
            {"course": c, "objectives": o}
            for c, o in by_course.items()
        ],
        "all_objectives": all_rows,
    }

    with OUTPUT_JSON.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
        f.write("\n")

    print(f"Wrote {OUTPUT_MD}")
    print(f"Wrote {OUTPUT_JSON}")
    print(f"Courses: {len(by_course)} | Objectives: {len(all_rows)}")


if __name__ == "__main__":
    main()
