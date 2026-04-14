const pathwayCards = document.getElementById('pathwayCards');
const selectionText = document.getElementById('selectionText');
const selectedPathwayCount = document.getElementById('selectedPathwayCount');
const selectedObjectiveCount = document.getElementById('selectedObjectiveCount');
const copySelectionBtn = document.getElementById('copySelectionBtn');
const clearSelectionBtn = document.getElementById('clearSelectionBtn');
const copyStatus = document.getElementById('copyStatus');
const autoIncludePrereqs = document.getElementById('autoIncludePrereqs');
const pathwayStatus = document.getElementById('pathwayStatus');

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

function buildPedagogyPathway() {
  const sessionDefinitions = [
    {
      id: 'session-1',
      title: 'Session 1',
      focus: 'Foundations of learning in technical skills.',
      includedSections: [
        {
          course: 'Session 1: Foundations of Learning in Technical Skills',
          objectives: [
            'Understanding Learning Theories: How People Learn: Introduce foundational learning theories (e.g., Constructivism, Behaviorism, Social Learning Theory) and demonstrate how they can inform effective teaching strategies.',
            'Recognizing the Nuances of Adult Learning: Explore the unique characteristics of adult learners, focusing on self-direction, leveraging prior experience, and understanding motivational factors that distinguish adult learning from youth-oriented instruction.',
            'Understanding Learner Profiles: Adapting Content to Diverse Learning Preferences: Examine various learner profiles and preferences (e.g., visual, auditory, kinaesthetic) to address a broad spectrum of learning needs and styles.',
            'Assessing and Adapting Content to Diverse Learning Preferences: Learn how to create and modify instructional materials to accommodate different learning styles while ensuring cultural sensitivity and inclusivity.',
            'Supporting a Diverse Range of Learners: Identify strategies to empathize with learners, foster a growth mindset, and provide individualized support for varied backgrounds and abilities.',
          ],
        },
      ],
    },
    {
      id: 'session-2',
      title: 'Session 2',
      focus: 'Structuring lessons for effective learning.',
      includedSections: [
        {
          course: 'Session 2: Structuring Lessons for Effective Learning',
          objectives: [
            'Instructional Design: Apply principles of instructional design to create structured and outcome-focused lessons.',
            "Bloom's Taxonomy: Integrate Bloom's Taxonomy to align activities and assessments with learning objectives, promoting progression from foundational knowledge to higher-order thinking.",
            'Creating Lesson Plans with Differentiated Instruction for Diverse Skill Levels, Parallel Tracks and Challenge Options: Develop lesson plans that incorporate differentiated instruction to address diverse skill levels.',
            'Incremental Complexity: Design exercises that gradually increase in difficulty, enabling learners to build confidence, deepen understanding, and master skills through practical, reflective, and scaffolded tasks.',
            'Project-Based Learning: Understand project-based learning techniques to create engaging educational experiences that enhance motivation, deepen understanding, and promote the practical application of knowledge in authentic real-world contexts.',
          ],
        },
      ],
    },
    {
      id: 'session-3',
      title: 'Session 3',
      focus: 'Engaging and motivating diverse learners.',
      includedSections: [
        {
          course: 'Session 3: Engaging and Motivating Diverse Learners',
          objectives: [
            'Universal Design for Learning (UDL): Explore universal design for learning (UDL) principles to create inclusive learning environments that accommodate diverse abilities and backgrounds.',
            'Inclusive and Supportive Learning Environments: Understand how to nurture inclusive and supportive learning environments by valuing diversity, fostering engagement, using collaborative techniques, addressing group challenges, and continuously improving teaching practices.',
            'Identifying Common Challenges for Learners New to Technical Domains: Pinpoint frequent obstacles encountered by beginners and discuss techniques to help them overcome these challenges effectively.',
            'Assessing Learner Skill Levels and Guiding Their Path: Develop strategies to evaluate learners existing skill levels and provide tailored guidance to help them choose the most appropriate learning track, fostering confidence and ensuring they engage with material suited to their needs.',
            'Fostering a Growth Mindset and Reducing Programming Anxiety: Explore and evaluate strategies to cultivate a growth mindset in learners, addressing common anxieties in programming education and empowering learners to embrace challenges, persist through setbacks, and build confidence in their abilities.',
          ],
        },
      ],
    },
    {
      id: 'session-4',
      title: 'Session 4',
      focus: 'Metacognition, feedback, and continuous improvement.',
      includedSections: [
        {
          course: 'Session 4: Fostering Growth: Metacognition, Feedback, and Continuous Improvement',
          objectives: [
            'Metacognition and Self-Regulation: Emphasise the importance of metacognition and self-regulation in helping learners assess their understanding, monitor progress, and adapt their strategies for effective learning.',
            'Evaluating and Understanding Feedback for Learning: Examine the impact of immediate and incremental feedback on enhancing learning outcomes, including strategies to provide timely, actionable, and supportive guidance that fosters engagement, motivation, and skill development.',
            'Transitioning from Direct Instruction to Facilitation: Understand the shift from direct instruction to facilitation by exploring strategies to empower learners through active, collaborative, and self-directed learning, fostering independence and critical thinking in intermediate and advanced workshops.',
            'Designing Technical Assessments: Develop formative and summative assessments tailored to technical skills training, ensuring alignment with learning objectives and emphasizing practical application, critical thinking, and authentic evaluation methods.',
            'Refining Teaching with Learner Feedback and Data: Leverage learner feedback and data to identify knowledge gaps, adjust teaching strategies, and implement targeted interventions that enhance learner outcomes and align instruction with learning objectives.',
            'Continuous Improvement and Staying Current: Recognise the importance of staying informed about evolving practices, integrating new research and innovations into teaching, and engaging in reflective practice for ongoing professional growth.',
          ],
        },
      ],
    },
    {
      id: 'session-5',
      title: 'Session 5',
      focus: 'Final integrated reflection session.',
      includedSections: [
        {
          course: 'Session 5: Reflection',
          objectives: [
            'Engage in Reflective Practice: Encourage participants to critically evaluate their own learning and pinpoint areas for improvement or further exploration.',
            'Identify Strengths and Weaknesses: Help learners articulate which topics or skills they feel confident about and those they find challenging.',
            "Foster Peer Learning: Facilitate an environment where participants can learn from each other's strategies, experiences, and perspectives.",
            'Plan for Ongoing Growth: Support learners in developing actionable steps for continued skill-building and professional development.',
          ],
        },
      ],
    },
  ];

  const levels = sessionDefinitions.map((session) => {
    const objectiveKeys = [];
    const primarySectionTitle = session.includedSections[0]?.course || session.title;
    const sessionName = primarySectionTitle.replace(/^Session\s*\d+\s*:\s*/i, '').trim();

    session.includedSections.forEach((section) => {
      section.objectives.forEach((objective) => {
        objectiveKeys.push(objectiveKey(section.course, objective));
      });
    });

    return {
      id: session.id,
      title: session.title,
      cardTitle: `${session.title}: ${sessionName}`,
      selectionLabel: `Pedagogy ${session.title} - ${sessionName}`,
      focus: session.focus,
      includedSections: session.includedSections,
      objectiveKeys,
    };
  });

  return {
    id: 'pedagogy-pathway',
    title: 'Pedagogy Pathway',
    summary: 'Choose sessions to build educator capability alongside technical delivery.',
    levels,
  };
}

function indexPathwayObjectives(pathway) {
  pathway.levels.forEach((level) => {
    level.includedSections.forEach((section) => {
      section.objectives.forEach((objective) => {
        const key = objectiveKey(section.course, objective);
        if (!objectiveMap.has(key)) {
          objectiveMap.set(key, { course: section.course, objective, key });
        }
      });
    });
  });
}

function renderPathwayMatrix(pathway) {
  if (!pathwayCards) return;

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
  if (pathway.levels.length === 5) {
    grid.classList.add('level-grid-balanced-five');
  }

  const includePrereqs = (levelIndex) => {
    const shouldChain = autoIncludePrereqs?.checked !== false;
    if (!shouldChain) return [levelIndex];
    return Array.from({ length: levelIndex + 1 }, (_, idx) => idx);
  };

  pathway.levels.forEach((level, index) => {
    const packageId = `${pathway.id}:${level.id}`;
    const selectionTitle = level.selectionLabel || `${pathway.title} - ${level.title}`;
    pathwayMap.set(packageId, { id: packageId, title: selectionTitle });
    pathwayObjectivesMap.set(packageId, level.objectiveKeys);

    const card = document.createElement('article');
    card.className = 'level-card';

    const levelTitle = document.createElement('h4');
    levelTitle.className = 'level-title';
    levelTitle.textContent = level.cardTitle || level.title;
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

    const showSectionList = pathway.id !== 'pedagogy-pathway';
    if (showSectionList) {
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
    }

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
  lines.push('To: codingforreproducibleresearch@exeter.ac.uk');
  lines.push('Subject: Digital Skills Accelerator Enquiry');
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
  if (pathwayStatus) {
    if (selectedPathwayIds.size === 0) {
      pathwayStatus.textContent = 'Select levels/sessions to populate the email draft below.';
    } else {
      const levelLabel = selectedPathwayIds.size === 1 ? 'selection' : 'selections';
      const objectiveLabel = selectedObjectiveKeys.size === 1 ? 'objective' : 'objectives';
      pathwayStatus.textContent = `Draft updated: ${selectedPathwayIds.size} ${levelLabel}, ${selectedObjectiveKeys.size} ${objectiveLabel}. Scroll to "Email Draft (Editable)" to review and edit.`;
    }
  }
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

    const pathways = [buildDataSciencePathway(courses), buildPedagogyPathway()];
    pathways.forEach(indexPathwayObjectives);

    if (pathwayCards) pathwayCards.innerHTML = '';
    pathwayMap.clear();
    pathwayObjectivesMap.clear();
    pathways.forEach(renderPathwayMatrix);
    renderSelectionText();
  })
  .catch(() => {
    if (pathwayCards) {
      pathwayCards.innerHTML = '<p>Pathways could not be loaded.</p>';
    }
  });
