const pathwayCards = document.getElementById('pathwayCards');
const selectionText = document.getElementById('selectionText');
const selectedPathwayCount = document.getElementById('selectedPathwayCount');
const selectedObjectiveCount = document.getElementById('selectedObjectiveCount');
const copySelectionBtn = document.getElementById('copySelectionBtn');
const clearSelectionBtn = document.getElementById('clearSelectionBtn');
const copyStatus = document.getElementById('copyStatus');
const autoIncludePrereqs = document.getElementById('autoIncludePrereqs');

const selectedObjectiveKeys = new Set();
const selectedPathwayIds = new Set();
const objectiveMap = new Map();
const pathwayMap = new Map();
const pathwayObjectivesMap = new Map();

function objectiveKey(course, objective) {
  return `${course}::${objective}`;
}

function parseLearningObjectivesMarkdown(text) {
  const courses = [];
  let currentCourse = null;

  text.split('\n').forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;

    if (line.startsWith('### ')) {
      currentCourse = {
        course: line.replace(/^###\s+/, '').trim(),
        objectives: [],
        sourceAlignment: '',
      };
      courses.push(currentCourse);
      return;
    }

    if (line.toLowerCase().startsWith('source alignment:') && currentCourse) {
      currentCourse.sourceAlignment = line.replace(/^source alignment:\s*/i, '').trim();
      return;
    }

    if (line.startsWith('- ') && currentCourse) {
      currentCourse.objectives.push(line.replace(/^-\s+/, '').trim());
    }
  });

  return courses.filter((c) => c.objectives.length > 0);
}

function findCourseByName(courses, sectionName) {
  const needle = sectionName.trim().toLowerCase();
  const exact =
    courses.find((course) => course.course.trim().toLowerCase() === needle) ||
    courses.find((course) => course.course.toLowerCase().includes(needle));
  if (exact) return exact;

  // Fuzzy fallback for renamed headings (e.g., "Python basics" vs "Introduction to Python")
  const tokens = needle
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4)
    .filter((token) => !['introduction', 'foundations', 'practice', 'workflow'].includes(token));

  if (!tokens.length) return null;

  let best = null;
  let bestScore = 0;
  for (const course of courses) {
    const title = course.course.toLowerCase();
    const score = tokens.reduce((acc, token) => acc + (title.includes(token) ? 1 : 0), 0);
    if (score > bestScore) {
      best = course;
      bestScore = score;
    }
  }

  return bestScore > 0 ? best : null;
}

function resolveSectionGroup(courses, aliases) {
  for (const alias of aliases) {
    const matched = findCourseByName(courses, alias);
    if (matched) return matched;
  }
  return null;
}

function buildDataSciencePathway(courses) {
  const levelDefinitions = [
    {
      id: 'foundational',
      title: 'Foundational',
      focus: 'Intro to Python essentials for teams building baseline coding confidence.',
      sectionGroups: [['Introduction to Python']],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      focus: 'Python for data analysis, Markdown workflows, and practical Python environment habits.',
      sectionGroups: [['Python for Data Analysis'], ['Using Markdown for Python']],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      focus: 'Machine learning concepts, evaluation, and pipeline thinking in Python.',
      sectionGroups: [['Introduction to Machine Learning']],
    },
  ];

  const levels = levelDefinitions.map((definition) => {
    const includedSections = [];
    const seenCourses = new Set();

    definition.sectionGroups.forEach((group) => {
      const section = resolveSectionGroup(courses, group);
      if (section && !seenCourses.has(section.course)) {
        includedSections.push(section);
        seenCourses.add(section.course);
      }
    });

    const objectiveKeys = [];
    includedSections.forEach((section) => {
      section.objectives.forEach((objective) => {
        objectiveKeys.push(objectiveKey(section.course, objective));
      });
    });

    return {
      id: definition.id,
      title: definition.title,
      focus: definition.focus,
      includedSections,
      objectiveKeys,
    };
  });

  return {
    id: 'data-science-python',
    title: 'Data Science Pathway (Python)',
    summary: 'Choose level packages to build a clear and realistic training pathway.',
    levels,
  };
}

function renderPathwayMatrix(pathway) {
  if (!pathwayCards) return;
  pathwayCards.innerHTML = '';
  pathwayMap.clear();
  pathwayObjectivesMap.clear();

  const wrap = document.createElement('section');
  wrap.className = 'pathway-matrix';

  const heading = document.createElement('h3');
  heading.className = 'matrix-title';
  heading.textContent = pathway.title;
  wrap.appendChild(heading);

  const summary = document.createElement('p');
  summary.className = 'matrix-summary';
  summary.textContent = pathway.summary;
  wrap.appendChild(summary);

  const grid = document.createElement('div');
  grid.className = 'level-grid';

  const includePrereqs = (levelIndex) => {
    const shouldChain = autoIncludePrereqs?.checked !== false;
    if (!shouldChain) return [levelIndex];
    return Array.from({ length: levelIndex + 1 }, (_, idx) => idx);
  };

  pathway.levels.forEach((level, index) => {
    const packageId = `${pathway.id}:${level.id}`;
    pathwayMap.set(packageId, { id: packageId, title: `${pathway.title} - ${level.title}` });
    pathwayObjectivesMap.set(packageId, level.objectiveKeys);

    const card = document.createElement('article');
    card.className = 'level-card';

    const levelTitle = document.createElement('h4');
    levelTitle.className = 'level-title';
    levelTitle.textContent = level.title;
    card.appendChild(levelTitle);

    const focus = document.createElement('p');
    focus.className = 'level-focus';
    focus.textContent = level.focus;
    card.appendChild(focus);

    const includes = document.createElement('p');
    includes.className = 'level-includes';
    const objectiveCount = level.objectiveKeys.length;
    includes.textContent = `Includes ${objectiveCount} objective${objectiveCount === 1 ? '' : 's'} across ${
      level.includedSections.length
    } course${level.includedSections.length === 1 ? '' : 's'}.`;
    card.appendChild(includes);

    const sectionList = document.createElement('ul');
    sectionList.className = 'level-course-list';
    if (!level.includedSections.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No mapped course found yet for this level.';
      sectionList.appendChild(empty);
    } else {
      level.includedSections.forEach((section) => {
        const sectionItem = document.createElement('li');
        sectionItem.textContent = section.course;
        sectionList.appendChild(sectionItem);
      });
    }
    card.appendChild(sectionList);

    const actions = document.createElement('div');
    actions.className = 'path-actions';

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn small-btn';
    addBtn.textContent = 'Select Level';
    addBtn.addEventListener('click', () => {
      const indices = includePrereqs(index);
      indices.forEach((idx) => {
        const levelToAdd = pathway.levels[idx];
        const levelPackageId = `${pathway.id}:${levelToAdd.id}`;
        selectedPathwayIds.add(levelPackageId);
      });
      renderSelectionText();
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-secondary small-btn';
    removeBtn.textContent = 'Unmark Level';
    removeBtn.addEventListener('click', () => {
      selectedPathwayIds.delete(packageId);
      renderSelectionText();
    });

    actions.appendChild(addBtn);
    actions.appendChild(removeBtn);
    card.appendChild(actions);

    grid.appendChild(card);
  });

  wrap.appendChild(grid);

  const hint = document.createElement('p');
  hint.className = 'path-hint';
  hint.textContent = 'Selecting levels adds all mapped objectives for that level.';
  wrap.appendChild(hint);

  pathwayCards.appendChild(wrap);
}

function syncSelectedObjectivesFromPathways() {
  selectedObjectiveKeys.clear();
  selectedPathwayIds.forEach((pathwayId) => {
    const objectiveKeys = pathwayObjectivesMap.get(pathwayId) || [];
    objectiveKeys.forEach((key) => selectedObjectiveKeys.add(key));
  });
}

function buildEmailText() {
  const selectedPathways = [...selectedPathwayIds]
    .map((id) => pathwayMap.get(id))
    .filter(Boolean)
    .map((pathway) => `- ${pathway.title}`);

  const grouped = new Map();
  [...selectedObjectiveKeys].forEach((key) => {
    const item = objectiveMap.get(key);
    if (!item) return;
    if (!grouped.has(item.course)) grouped.set(item.course, []);
    grouped.get(item.course).push(item.objective);
  });

  const lines = [];
  lines.push('Subject: Digital Skills Acceleator Enquiry');
  lines.push('');
  lines.push('Hello team,');
  lines.push('');
  lines.push('We are interested in a digital skills consultancy offering and would like to start with the following package selections:');
  lines.push('');

  if (selectedPathways.length) {
    lines.push('Selected pathway levels:');
    lines.push(...selectedPathways);
    lines.push('');
  }

  lines.push('Selected learning objectives:');
  if (grouped.size === 0) {
    lines.push('- None selected yet.');
  } else {
    [...grouped.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([course, objectives]) => {
        lines.push(`- ${course}:`);
        objectives.forEach((objective) => {
          lines.push(`  - ${objective}`);
        });
      });
  }

  lines.push('');
  lines.push('This draft reflects our starting point only. We are open to adjusting course content and would welcome an iterative discovery discussion to shape a programme around our needs.');
  lines.push('');
  lines.push('Please advise on suitable delivery format, timing, and next steps.');
  lines.push('');
  lines.push('Best regards,');
  lines.push('[Name / Organisation]');

  return lines.join('\n');
}

function renderSelectionText() {
  if (!selectionText) return;
  syncSelectedObjectivesFromPathways();
  selectionText.value = buildEmailText();

  if (selectedPathwayCount) selectedPathwayCount.textContent = String(selectedPathwayIds.size);
  if (selectedObjectiveCount) selectedObjectiveCount.textContent = String(selectedObjectiveKeys.size);
}

copySelectionBtn?.addEventListener('click', async () => {
  if (!selectionText) return;

  try {
    await navigator.clipboard.writeText(selectionText.value);
    if (copyStatus) copyStatus.textContent = 'Copied to clipboard.';
  } catch {
    if (copyStatus) copyStatus.textContent = 'Copy failed. You can manually copy the text box content.';
  }
});

clearSelectionBtn?.addEventListener('click', () => {
  selectedObjectiveKeys.clear();
  selectedPathwayIds.clear();
  renderSelectionText();
  if (copyStatus) copyStatus.textContent = '';
});

function fallbackCoursesFromJson(payload) {
  return (payload.courses || []).map((item) => ({
    course: item.course,
    objectives: item.objectives || [],
    sourceAlignment: 'From extracted course objectives JSON',
  }));
}

async function loadCourseObjectives() {
  try {
    const markdownResponse = await fetch('learning_objectives.md');
    if (!markdownResponse.ok) throw new Error('md fetch failed');
    const markdown = await markdownResponse.text();
    const parsed = parseLearningObjectivesMarkdown(markdown);
    if (parsed.length > 0) return parsed;
    throw new Error('md parse failed');
  } catch {
    const jsonResponse = await fetch('data/learning_objectives.json');
    if (!jsonResponse.ok) throw new Error('json fetch failed');
    const json = await jsonResponse.json();
    return fallbackCoursesFromJson(json);
  }
}

loadCourseObjectives()
  .then((courses) => {
    courses.forEach((course) => {
      course.objectives.forEach((objective) => {
        const item = {
          course: course.course,
          objective,
          key: objectiveKey(course.course, objective),
        };
        objectiveMap.set(item.key, item);
      });
    });
    renderPathwayMatrix(buildDataSciencePathway(courses));
    renderSelectionText();
  })
  .catch(() => {
    if (pathwayCards) {
      pathwayCards.innerHTML = '<p>Pathways could not be loaded.</p>';
    }
  });
