const pathwayCards = document.getElementById('pathwayCards');
const objectiveCourses = document.getElementById('objectiveCourses');
const selectionText = document.getElementById('selectionText');
const selectedPathwayCount = document.getElementById('selectedPathwayCount');
const selectedObjectiveCount = document.getElementById('selectedObjectiveCount');
const copySelectionBtn = document.getElementById('copySelectionBtn');
const clearSelectionBtn = document.getElementById('clearSelectionBtn');
const copyStatus = document.getElementById('copyStatus');

const selectedObjectiveKeys = new Set();
const selectedPathwayIds = new Set();
const objectiveMap = new Map();
const pathwayMap = new Map();

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
  return (
    courses.find((course) => course.course.trim().toLowerCase() === needle) ||
    courses.find((course) => course.course.toLowerCase().includes(needle))
  );
}

function resolveSectionGroup(courses, aliases) {
  for (const alias of aliases) {
    const matched = findCourseByName(courses, alias);
    if (matched) return matched;
  }
  return null;
}

function buildPathways(courses) {
  const definitions = [
    {
      id: 'path-1',
      title: 'Path 1: Technical Skills Overview Pathway',
      bestFor:
        'Teams or organisations that want a broad, high-level overview across core technical skills before selecting deeper specialist modules.',
      sectionGroups: [
        ['Computational Thinking'],
        ['Introduction to Python'],
        ['Introduction to R'],
        ['Introduction to Version Control'],
        ['Introduction to UNIX', 'Introduction to Unix'],
        ['Software Development Best Practice'],
      ],
    },
    {
      id: 'path-2',
      title: 'Path 2: Python Data and Machine Learning Practitioner',
      bestFor: 'Teams needing a practical end-to-end Python pathway from coding basics to model pipelines.',
      sectionGroups: [
        ['Introduction to Python'],
        ['Python for Data Analysis'],
        ['Introduction to Machine Learning'],
        ['Using Markdown for Python'],
        ['Introduction to Version Control'],
      ],
    },
    {
      id: 'path-3',
      title: 'Path 3: Reproducible R Analysis and Reporting',
      bestFor: 'Research groups working in R who want stronger data, modelling, and reporting workflows.',
      sectionGroups: [
        ['Introduction to R'],
        ['Working with Data in R', 'Working With Data in R'],
        ['Introduction to Regression with R'],
        ['Regression Analysis in R Adapting to Varied Data Types', 'Regression Analysis in R: Adapting to Varied Data Types'],
        ['Mixed Effects Regression with R'],
        ['Introduction to Markdown in R'],
      ],
    },
    {
      id: 'path-4',
      title: 'Path 4: HPC, GPUs, and Parallel Performance',
      bestFor: 'Researchers scaling workloads on clusters and improving compute performance.',
      sectionGroups: [
        ['Introduction to UNIX', 'Introduction to Unix'],
        ['Introduction to HPC'],
        ['Parallel Computing'],
        ['Introduction to GPUs'],
        ['Improve Your R Code'],
      ],
    },
    {
      id: 'path-5',
      title: 'Path 5: Collaborative Reproducible Research Delivery',
      bestFor: 'Teams that need stronger shared practices for maintainable, auditable research outputs.',
      sectionGroups: [
        ['Introduction to UNIX', 'Introduction to Unix'],
        ['Introduction to Version Control'],
        ['Intermediate Version Control'],
        ['Software Development Best Practice'],
        ['Using Markdown for Python', 'Introduction to Markdown in R'],
      ],
    },
  ];

  return definitions.map((definition) => {
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
      bestFor: definition.bestFor,
      includedSections,
      objectiveKeys,
    };
  });
}

function createObjectiveCheckbox(item, compact = false) {
  const wrapper = document.createElement('label');
  wrapper.className = compact ? 'objective-item objective-item-compact' : 'objective-item';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.dataset.objectiveKey = item.key;
  input.checked = selectedObjectiveKeys.has(item.key);

  input.addEventListener('change', () => {
    if (input.checked) {
      selectedObjectiveKeys.add(item.key);
    } else {
      selectedObjectiveKeys.delete(item.key);
    }
    syncCheckboxes();
    renderSelectionText();
  });

  const text = document.createElement('span');
  text.textContent = compact ? `${item.course}: ${item.objective}` : item.objective;

  wrapper.appendChild(input);
  wrapper.appendChild(text);
  return wrapper;
}

function syncCheckboxes() {
  document.querySelectorAll('input[data-objective-key]').forEach((input) => {
    const key = input.dataset.objectiveKey;
    input.checked = selectedObjectiveKeys.has(key);
  });
}

function renderPathways(pathways) {
  if (!pathwayCards) return;
  pathwayCards.innerHTML = '';

  pathways.forEach((pathway) => {
    pathwayMap.set(pathway.id, pathway);

    const details = document.createElement('details');
    details.className = 'path-card';

    const summary = document.createElement('summary');
    summary.textContent = pathway.title;
    details.appendChild(summary);

    const bestFor = document.createElement('p');
    bestFor.className = 'path-bestfor';
    bestFor.textContent = `Best for: ${pathway.bestFor}`;
    details.appendChild(bestFor);

    const includeTitle = document.createElement('p');
    includeTitle.className = 'path-include-title';
    includeTitle.textContent = 'Includes:';
    details.appendChild(includeTitle);

    const list = document.createElement('div');
    list.className = 'path-objectives';
    pathway.includedSections.forEach((section) => {
      const sectionWrap = document.createElement('div');
      sectionWrap.className = 'path-section';

      const sectionTitle = document.createElement('p');
      sectionTitle.className = 'path-section-title';
      sectionTitle.textContent = `${section.course} (${section.objectives.length} objectives)`;
      sectionWrap.appendChild(sectionTitle);

      const source = document.createElement('p');
      source.className = 'path-section-source';
      source.textContent = `Source alignment: ${section.sourceAlignment || section.course}`;
      sectionWrap.appendChild(source);

      const objectiveList = document.createElement('ul');
      objectiveList.className = 'path-section-list';
      section.objectives.forEach((objective) => {
        const objectiveItem = document.createElement('li');
        objectiveItem.textContent = objective;
        objectiveList.appendChild(objectiveItem);
      });
      sectionWrap.appendChild(objectiveList);
      list.appendChild(sectionWrap);
    });
    details.appendChild(list);

    const actions = document.createElement('div');
    actions.className = 'path-actions';

    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'btn small-btn';
    addBtn.textContent = 'Select Full Pathway';
    addBtn.addEventListener('click', () => {
      pathway.objectiveKeys.forEach((key) => selectedObjectiveKeys.add(key));
      selectedPathwayIds.add(pathway.id);
      syncCheckboxes();
      renderSelectionText();
    });

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-secondary small-btn';
    removeBtn.textContent = 'Unmark Pathway';
    removeBtn.addEventListener('click', () => {
      selectedPathwayIds.delete(pathway.id);
      renderSelectionText();
    });

    const hint = document.createElement('p');
    hint.className = 'path-hint';
    hint.textContent = 'Selecting a pathway bulk-selects all objectives from the sections listed above.';

    actions.appendChild(addBtn);
    actions.appendChild(removeBtn);
    details.appendChild(actions);
    details.appendChild(hint);

    pathwayCards.appendChild(details);
  });
}

function renderObjectivesByCourse(courses) {
  if (!objectiveCourses) return;
  objectiveCourses.innerHTML = '';

  courses.forEach((course) => {
      const details = document.createElement('details');
      details.className = 'course-card';

      const summary = document.createElement('summary');
      summary.textContent = `${course.course} (${course.objectives.length})`;
      details.appendChild(summary);

      const list = document.createElement('div');
      list.className = 'course-objectives';

      course.objectives.forEach((objective) => {
        const item = {
          course: course.course,
          objective,
          key: objectiveKey(course.course, objective),
        };
        objectiveMap.set(item.key, item);
        list.appendChild(createObjectiveCheckbox(item));
      });

      details.appendChild(list);
      objectiveCourses.appendChild(details);
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
  lines.push('Subject: Technical Skills Offering Enquiry');
  lines.push('');
  lines.push('Hello Coding for Reproducible Research team,');
  lines.push('');
  lines.push('We are interested in the following package:');
  lines.push('');

  if (selectedPathways.length) {
    lines.push('Selected pre-packaged pathways:');
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
  lines.push('Please advise on suitable delivery format, timing, and next steps.');
  lines.push('');
  lines.push('Best regards,');
  lines.push('[Name / Organisation]');

  return lines.join('\n');
}

function renderSelectionText() {
  if (!selectionText) return;
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
  syncCheckboxes();
  renderSelectionText();
  if (copyStatus) copyStatus.textContent = '';
});

function fallbackCoursesFromJson(payload) {
  return (payload.courses || []).map((item) => ({
    course: item.course,
    objectives: item.objectives || [],
    sourceAlignment: 'From extracted CfRR course objectives JSON',
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
    renderObjectivesByCourse(courses);
    renderPathways(buildPathways(courses));
    renderSelectionText();
  })
  .catch(() => {
    if (objectiveCourses) {
      objectiveCourses.innerHTML = '<p>Learning objectives could not be loaded.</p>';
    }
    if (pathwayCards) {
      pathwayCards.innerHTML = '<p>Pathways could not be loaded.</p>';
    }
  });
