# Technical Skills Offering Website

A stripped-down, external-facing pick-and-mix website built around learning objectives.

## What is included

- Simple website focused on:
  - pick-and-mix learning objective selection,
  - pre-packaged pathways aligned to end goals,
  - interactive selection + copy-to-clipboard email text builder,
  - direct contact email.
- University of Exeter branded header (logo + CfRR title) and dark, high-contrast visual style.
- GitHub Actions pa11y accessibility check for the deployed page structure.
- Generated data files:
  - `course_list.md` (complete list)
  - `data/course_catalog.json` (used by website)
  - `learning_objectives.md` (curated objective groups used by website picker)
  - `data/learning_objectives.generated.md` (auto-extracted reference output)
  - `data/learning_objectives.json`

## Local development

### Prerequisites

- Node.js (for `npm` scripts)
- Python 3
- Git

### Run locally

From the repository root:

```bash
npm run generate:data
npm run dev
```

Open:

- <http://localhost:5173>

## Build static output

```bash
npm run build
```

This creates `dist/` with all static assets and generated data.

## Preview build

```bash
npm run preview
```

Open:

- <http://localhost:4173>

## Project structure

- `index.html`: pick-and-mix page with pathways, objective selector, and email text builder
- `styles.css`: styling (Exeter palette + Calibri)
- `main.js`: renders pathways/objectives, tracks selections, and builds clipboard text
- `scripts/extract_course_catalog.py`: generates complete course list and catalogue JSON
- `scripts/extract_learning_objectives.py`: generates objective list and objective JSON
- `assets/exeter_logo.png`: University of Exeter logo used in the header
- `pa11yci.js`: pa11y-ci configuration
- `.github/workflows/accessibility.yml`: GitHub Action running pa11y on push/PR
- `course_list.md`: complete list of full, short, and overview items
- `learning_objectives.md`: objectives by course
- `data/course_catalog.json`: catalogue consumed by frontend
- `data/learning_objectives.json`: objective dataset

## Editing notes

- Rebuild generated files after any CfRR notebook updates:

```bash
npm run generate:data
```

- Source notebooks are read from `../CfRR_Courses/programme_information/`.
- Note: `learning_objectives.md` is intentionally curated and is not overwritten by the generator.
- Contact route shown on site: `codingforreproducibleresearch@exeter.ac.uk`.
- Run accessibility check locally (after starting local server on `4173`):

```bash
npm run a11y
```
