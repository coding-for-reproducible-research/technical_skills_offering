# CfRR Learning Objectives

This document provides a cleaned, readable list of learning objectives by course.

Last reformatted: 2026-03-10

## How to Read This File

- Each course is listed with its learning objectives as bullets.
- Objectives are written in plain language to support pick-and-mix planning.
- Use this alongside `course_list.md` for the full catalogue split (full, short, overview).

## Courses (28)

### Introduction to Julia

- Understand Julia’s design philosophy and interact fluently with its REPL, including both the package and help modes.
- Define and manipulate basic data types and variables, and apply control-flow constructs (if, for, while) to express algorithmic logic.
- Encapsulate functionality in Julia functions, leveraging multiple dispatch to write clean, type-specific methods.
- Work with arrays and matrices, perform element-wise and linear algebra operations, and harness Julia’s native array abstractions for efficient numerical computing.
- Read from and write to external data sources using Julia’s I/O facilities, and parse or format data in common file formats.
- Create informative visualisations of data and simulation output with Plots.jl (and other graphics packages).
- Manage project dependencies and packages using Julia’s built-in package manager (Pkg), and organise your code into multi-file, reproducible projects.
- Diagnose and eliminate performance bottlenecks by profiling your code.
- Apply your skills to a capstone project, implementing and optimizing Conway’s Game of Life from first principles, and extending it with custom rules, GUIs, or advanced visualizations.

### Introduction to Python

- Understand and declare the basic data types in Python.
- Understand the basic principles of control flow and for loops.
- Describe what a function is and define one that takes user-specified parameters.
- Perform simple data analysis/visualisation of a table of data.
- Recognise concepts in other programming languages.

### Python for Data Analysis

- Grasp the fundamentals of Python programming, including data types, control structures, and functions.
- Learn how to load, clean, and manipulate data using Pandas for effective data analysis.
- Learn to use NumPy for numerical operations and handling large datasets efficiently.
- Understand the use of Pandas for handling research problem datasets.
- Create a variety of static and interactive visualisations to represent data insights, covering Matplotlib and Plotly.
- Apply machine learning techniques using Scikit-Learn for predictive modelling.
- Implement testing framework, manage dependencies with virtual environment.
- Learn methods to ensure that research and analyses can be reproduced and validated by other s.

### Introduction to Machine Learning

- Explain the main theoretical concepts of machine learning (at a high level), the machine learning landscape, and be able to provide some examples of machine learning applications.
- Train basic linear models using scikit-learn, building understanding of model-based learning.
- Understand concepts such as model selection, error, evaluation, validation, and be able to put these into practice with Python.
- Explain the main stages of the machine learning pipeline, and be able to create a pipeline running on real-world data.

### Using Markdown for Python

- Understand the benefits of dynamic documents—including how they streamline workflows, enhance reproducibility, and foster collaboration.
- Navigate and use JupyterLab for creating interactive documents that integrate code and documentation seamlessly.
- Apply basic Markdown syntax to format text, structure content, and create readable, well-organized documents.
- Embed Python code within Markdown documents to generate dynamic outputs, such as plots, tables, and results.
- Create a dynamic document that integrates Python code and Markdown to combine narrative, code, and output into a single cohesive document.
- Export and save dynamic documents in various formats (e.g., HTML, PDF, Markdown) for sharing, publishing, or printing.

### Python Environments

- Explain the role of virtual environments: Understand why virtual environments are essential in Python development and how they help manage project dependencies and avoid conflicts.
- Create and activate a virtual environment with venv: Learn how to set up and use virtual environments using the built-in Python venv module on both macOS and Windows.
- Highlight different virtual environment tools: Identify the differences and advantages of venv, Conda, Pipenv, and Poetry for Python environment and dependency management.

### Python Advanced Language Features

- Understand the use and significance of docstrings and type hints in Python for better code documentation and type-checking.
- Utilize introspection to inspect objects, functions, and modules.
- Apply decorators to modify the behaviour of functions and methods.
- Implement useful techniques such as casting and error handling with try-except blocks.
- Create and use lambda functions, list comprehensions, and generator expressions for efficient Python programming.
- Define and use classes in Python, including understanding inheritance and operator overloading.

### Python Checking and Testing Code

- Understand the importance and limitations of software testing.
- Recognize different types of testing such as system-level and defect testing.
- Learn how to implement and interpret assert statement in Python code.
- Understand when and why to use assert statements.
- Understand the concept of unit testing and Test Driven Development (TDD).
- Write and execute unit tests using the unit test module.
- Learn the purpose and implementation of fixtures and mocks in testing.
- Apply these concepts to test code that depends on external resources.
- Understand the role of code linting and type checking.
- Use tools like Flake8 and my[py] to ensure code quality and adherence to style guidelines.

### Introduction to R

- Learn how to use Rstudio to write scripts and run R commands.
- Learn the different types of objects for storing data and the importance of different data types.
- Know how to read in data, manipulate it and save the output.
- Know how to visualise data in commonly used figures.
- Understand how to perform some basic inferential statistical tests.
- Learn definitions of fundamental programming terminology and concepts such as variable, function and for loops that are transferable to other programming languages.

### Introduction to Regression with R

- Understand the types of questions regression can be used to answer.
- Learn to fit a linear regression model with multiple predictor variables.
- Understand how to extract and interpret the results from a range of regression models.
- Describe the concept of and evaluate the assumptions behind hypothesis testing in regression analysis.

### Regression Analysis in R Adapting to Varied Data Types

- Understand what a generalised linear model is.
- Fit logistic regression models with R.
- Select the appropriate regression model for either a continuous or binary outcome.
- Include a range of different types of predictor variables in regression models.
- Interpret the coefficients of a regression model.

### Mixed Effects Regression with R

- Use regression answer to answer a wide range of research questions .
- Fit a regression model with interactions between predictor variables.
- Fit multi-level regression models.
- Extract and interpret the results from a range of regression models.
- Design a regression model appropriate for addressing a specific research question.

### Working with Data in R

- Learn to explain what is meant by the ‘tidy’ format (a widely recognised convention for structuring data).
- Know how to read tabular data from a file to a dataframe.
- Manipulate datasets, including creating new variables, filtering data, summarising and sorting data.
- Know how to join multiple datasets together and reshape data.
- Learn how to work with strings and dates (as time permits).
- Gain hands on experience working with R notebooks for analysis.

### Improve Your R Code

- Be able to write clean, readable, and maintainable R code following the tidyverse style guide.
- Be able to measure and benchmark code performance using microbenchmark.
- Understand and apply tools such as parallel, data.table, and Rcpp to improve execution speed.
- Use styler to automatically format and clean your code.
- Understand when optimisation is appropriate and how to identify performance bottlenecks.

### Introduction to Markdown in R

- Describe what Markdown is and why it is useful.
- Recognise the main components of a Markdown document.
- Use basic Markdown syntax.
- Generate Markdown documents using R/RStudio.

### R Environments

- Environments: What R environments are and why they matter.
- R version: Switching between versions of R.
- Packages: Dependency management using renv.
- Other: Handling system libraries and project settings.
- Recreate & troubleshoot: Restoring environments and common fixes.
- Activities: Have a go at R environment management!
- Further ideas: Advanced tools and workflows for managing R environments.

### Writing Function in R

- Understand and write functions in R.
- Understand the difference between local and global variables.
- Apply best practices to avoid common programming errors related to variable usage.

### Unit Testing in R with testthat

- Understand why automated testing is valuable.
- Learn how to use the testthat package to write tests for functions in R.
- Learn a standard practice for organising your functions and tests.
- Gain some tips and advice for writing tests.

### Introduction to UNIX

- Describe what the shell is and how to access it.
- Navigate around the Unix filesystem.
- Inspect and manipulate files.
- Automate tasks via scripts.
- Run programs outside of IDEs and notebooks.

### Computational Thinking

- Understand what an algorithm is and the role it plays in coding.
- Learn a number of computational thinking approaches and concepts for developing algorithms.
- Know how to differentiate between bugs related to syntax from those related to the underlying algorithm to facilitate more effective troubleshooting.

### Introduction to HPC

- Know what an high performance computing (HPC) cluster is and what type of tasks it is suited to.
- Know what computing resources are necessary to run a large workload.
- Understand how to log on to the cluster and navigate around the file system.
- Learn how to submit and manage job tasks in the scheduler’s queue.
- Use the array jobs syntax - a tool to efficiently parallel repetitive tasks.

### Parallel Computing

- Be able to explain what is meant by distributed and shared-memory parallelism.
- Know how to write software that can run across multiple processes using MPI.
- Be able to write code that utilizes multithreading for parallel execution.
- Be able to identify how a problem can be divided and parallelised effectively.
- Gain hands-on experience writing and optimizing parallel code.

### Software Development Best Practice

- Develop a high-level understanding of software development for research.
- Learn how to collaborate on code effectively.
- Understand how to make code useful to others to improve the reproducibility of research.
- Build the necessary foundations for intermediate level courses that will delve deeper into software development topics.

### Introduction to Version Control

- Use Git to manage their software development.
- Explain what repositories and commits are in Git.
- Apply standard Git commands as part of their development workflow: cloning, pulling from and pushing to repositories; adding and committing file changes.
- Give examples of what should and should not be included in Git repositories.
- Describe how Git and platforms like GitHub and GitLab relate to each other and their differences.
- Understand how to share their work with others and/or make it publicly available through GitHub.
- Have the confidence to learn more advanced features of Git and GitHub as required for their work, such as working with branches and pull requests.

### Intermediate Version Control

- Understand and configure advanced Git settings.
- Master branching and merging strategies.
- Implement effective GitHub workflows for collaboration.
- Manage remote repositories and synchronize local changes.
- Learn techniques for rewriting Git history and recovering from mistakes.

### Introduction to GPUs

- Understand the fundamental principles of GPU architectures and parallel programming models.
- Configure and manage software environments for GPU computing using Spack.
- Submit and manage GPU-enabled jobs on HPC systems with Slurm.
- Diagnose performance bottlenecks using profiling tools, and apply strategies for performance optimisation.
- Implement GPU-accelerated numerical models, such as a temperature diffusion solver.
- Apply knowledge to a capstone project, extending Conway’s Game of Life to explore GPU performance, scalability, and custom extensions.

### Data Science Project Best Practices

- Develop a reproducible Python data science project using a clear project structure, appropriate documentation, and effective dependency management.
- Apply good software development practices such as version control, configuration management, code formatting, and testing to improve the quality and maintainability of research code.
- Use notebooks, scripts, and supporting files appropriately to create research workflows that are transparent, reusable, and easier for others to understand and build upon.

### Using Git and GitHub via Graphical User Interfaces (GUIs)

- Explain the purpose of Git and GitHub in collaborative work.
- Describe key Git concepts using plain language.
- Use GitHub Desktop to clone a repository and make changes safely.
- Create commits and understand what they represent.
- Push changes to GitHub and open a pull request for review.
