# Week 3 - Technical Question Evaluation Design

## Goal

Week 3 defines a stronger academic evaluation model for SQL and C# questions. The purpose is to prepare the platform for reliable technical assessment without adding unsafe code execution or OpenAI integration during this sprint.

## Current Technical Question State

The platform already supports `SQL` and `CSharp` as question types. Technical questions can be authored with a prompt, starter code, SQL schema/context, expected answer, and grading note. These values are currently stored through a combination of:

- `Question.Text` with structured sections such as `Prompt`, `Schema`, `Starter SQL`, `Starter C# code`, and `Expected answer / grading note`;
- `Question.MetadataJson`;
- `Question.CorrectAnswer`;
- `Question.Topic`;
- `Question.Difficulty`;
- `Question.Points`.

The existing `QuestionTechnicalMetadataDto` supports:

- `Schema`;
- `StarterCode`;
- `ExpectedOutput`;
- `ModelAnswer`;
- `GradingNotes`.

The student exam page already uses Monaco Editor for SQL and C# answers. The current Run workflow saves the answer draft and returns a safe preview result. The backend does not execute arbitrary SQL or C# code inside the main API process. Instead, it performs structural checks and returns public feedback such as missing SQL clauses, dangerous SQL statements, C# brace balance, possible semicolon issues, blocked API usage, and starter placeholder checks.

The gradebook already supports professor review and manual score override. The current automatic grading is heuristic/model-answer based, not a real OpenAI API integration.

## SQL Metadata Design

SQL questions should use structured metadata so the professor can define both the student-visible task and the grading context.

Required fields:

- `prompt`: the academic problem statement shown to the student;
- `schema`: database tables, columns, relationships, and constraints;
- `starterSql`: optional starter query shown in the editor;
- `modelAnswer`: professor/reference SQL solution;
- `expectedOutput`: expected rows, columns, sorting, or result description;
- `points`: maximum score.

Recommended optional fields:

- `topic`: module or lecture unit;
- `difficulty`: easy, medium, hard;
- `sqlDialect`: PostgreSQL, SQL Server, MySQL, SQLite, or generic SQL;
- `datasetDescription`: short explanation of the data set;
- `publicTestCases`: visible checks that help students validate structure;
- `hiddenTestCases`: private checks used only during grading;
- `gradingNotes`: rubric for human/OpenAI review;
- `comparisonMode`: exact rows, unordered rows, aggregate tolerance, semantic intent, or manual review.

Student-facing responses must never expose `modelAnswer`, `hiddenTestCases`, or private grading notes during the exam.

## C# Metadata Design

C# questions also need structured metadata so the student works inside a clear programming task instead of a plain text answer.

Required fields:

- `prompt`: the problem statement shown to the student;
- `starterCode`: initial code template in the editor;
- `modelAnswer`: professor/reference solution;
- `expectedOutput`: expected console output, return value, or behavior;
- `points`: maximum score.

Recommended optional fields:

- `requiredSignature`: method/class signature that must be implemented;
- `allowedLibraries`: allowed namespaces/packages;
- `timeoutMs`: execution timeout for future sandbox runner;
- `memoryMb`: memory limit for future sandbox runner;
- `publicTestCases`: visible examples and checks;
- `hiddenTestCases`: private grading checks;
- `gradingNotes`: rubric for professor/OpenAI review;
- `topic`: module or lecture unit;
- `difficulty`: easy, medium, hard.

Student-facing responses must never expose hidden tests or the full model answer during the exam.

## Test Case Model

The recommended initial approach is to store technical test cases inside `Question.MetadataJson` as structured JSON. This is safer for the current project because the database already has `MetadataJson`, and it avoids a large migration before the final data model is fully proven.

Later, if test execution grows, test cases can be moved into separate relational tables.

Suggested shared test case shape:

```json
{
  "id": "stable-guid-or-client-id",
  "title": "Public example 1",
  "visibility": "Public",
  "input": "...",
  "setup": "...",
  "expectedOutput": "...",
  "points": 2,
  "gradingNote": "What this test validates"
}
```

SQL-specific additions:

- `schemaSetup`;
- `seedData`;
- `expectedColumns`;
- `expectedRows`;
- `comparisonMode`;
- `datasetReference`.

C#-specific additions:

- `methodCall`;
- `testCode`;
- `expectedReturnValue`;
- `expectedConsoleOutput`;
- `expectedException`.

## Backend DTO Design

Recommended DTOs:

### TechnicalQuestionMetadataDto

- `schema`;
- `starterCode`;
- `expectedOutput`;
- `modelAnswer`;
- `gradingNotes`;
- `sqlDialect`;
- `requiredSignature`;
- `allowedLibraries`;
- `timeoutMs`;
- `memoryMb`;
- `publicTestCases`;
- `hiddenTestCases`.

### TechnicalTestCaseDto

- `id`;
- `title`;
- `visibility`;
- `input`;
- `setup`;
- `expectedOutput`;
- `points`;
- `gradingNote`;
- `comparisonMode`;
- SQL-only fields;
- C#-only fields.

### StudentTechnicalQuestionDto

Student DTO must include only safe fields:

- `questionId`;
- `type`;
- `prompt`;
- `schema`;
- `starterCode`;
- `expectedOutputSummary` only if safe;
- `publicTestCases`;
- `points`;
- `topic`;
- `difficulty`.

It must exclude:

- `modelAnswer`;
- `hiddenTestCases`;
- private grading notes;
- exact hidden expected outputs.

### ProfessorTechnicalQuestionDto

Professor DTO can include:

- all metadata;
- model answer;
- public and hidden test cases;
- grading notes;
- audit/readiness information.

### TechnicalRunRequestDto

- `examId`;
- `attemptId`;
- `questionId`;
- `response`;
- `clientSessionId`;

### TechnicalRunResultDto

The existing DTO is a good base:

- `status`;
- `language`;
- `output`;
- `errors`;
- `notes`;
- `executionTimeMs`;
- `runNumber`;
- `executedAt`;
- `testResults`.

Future additions:

- `runnerMode`: `Preview`, `Sandbox`, or `ExternalService`;
- `usedPublicTestsOnly`;
- `sandboxTraceId`;
- `resourceLimitHit`;
- `compileSucceeded`;
- `executionSucceeded`.

### TechnicalGradingReviewDto

- `attemptId`;
- `questionId`;
- `studentAnswer`;
- `modelAnswer`;
- `expectedOutput`;
- `publicTestResults`;
- `hiddenTestResults`;
- `automaticSuggestedPoints`;
- `openAiSuggestedPoints`;
- `professorFinalPoints`;
- `professorFeedback`;
- `reviewStatus`;

## Student Technical Answer Workspace

The student workspace should remain compact and exam-focused.

Recommended UI:

- prompt and schema/context on the left or above the editor;
- Monaco Editor for SQL/C#;
- Run button near the editor;
- output panel;
- error panel;
- public test result list;
- autosave status;
- normal exam submit remains the only final submission.

Rules:

- Run does not submit the exam.
- Run may save the current draft.
- Refresh restores the latest answer.
- Submitted attempts cannot run again.
- Public tests are visible.
- Hidden tests and model answers stay private.

## Professor Review Workflow

Professor review should clearly separate:

- student answer;
- expected/model answer;
- test results;
- automatic/OpenAI suggestion;
- final professor decision.

Recommended layout:

- compact summary row: student, score, percentage, grade, review status;
- per-question review panel;
- side-by-side or stacked comparison for technical answers;
- code blocks for SQL/C#;
- public and hidden test results;
- suggested score;
- editable final points;
- professor feedback;
- save grading;
- publish result only after review.

The professor must always be the final academic authority.

## Security Limitations

The main API must not execute arbitrary student SQL or C# code.

Unsafe actions include:

- running SQL against the production database;
- compiling C# inside the API process;
- allowing file system, process, network, reflection, or environment access;
- exposing hidden tests to the client;
- trusting client-side execution results.

Safe future execution options:

- isolated Docker runner;
- separate execution worker service;
- external secure code runner API;
- read-only SQL sandbox with per-attempt database;
- queue-based job execution with timeout and resource limits.

Until sandboxing exists, the current safe preview approach is acceptable for thesis baseline because it avoids unsafe execution while preparing the result shape for a future runner.

## Future OpenAI Grading Plan

OpenAI evaluation should be implemented after the technical metadata and review workflow are stable. Recommended timing: Week 5, after Week 4 implements or refines the SQL/C# metadata and UI.

OpenAI should receive:

- question prompt;
- question type;
- model answer;
- expected output;
- grading rubric;
- student answer;
- public/hidden test results if available;
- maximum points.

OpenAI should return structured JSON:

```json
{
  "suggestedPoints": 7.5,
  "confidence": "Medium",
  "feedback": "The answer solves the main requirement but misses one edge case.",
  "detectedIssues": ["Missing null handling"],
  "rationale": "Explanation of the score",
  "requiresHumanReview": true
}
```

OpenAI must assist grading, not replace professor review. The final score must remain editable by the professor.

OpenAI API usage is not normally free for production use. It requires an API key and billing/credits, and the cost depends on the selected model and token usage.

## Recommended Implementation Order for Week 4

1. Expand `QuestionTechnicalMetadataDto` with test cases and technical settings.
2. Update question authoring UI to edit structured SQL/C# metadata instead of relying on text sections.
3. Ensure student-facing DTOs hide private fields.
4. Improve student technical workspace to show public test cases and clearer run results.
5. Improve professor review UI for technical answers.
6. Keep run behavior as safe preview until sandbox execution is designed.
7. Add tests for DTO privacy and submitted-attempt lock around technical run.

## Risks and Limitations

- JSON metadata is flexible but harder to query than relational tables.
- Real SQL/C# execution requires sandbox infrastructure.
- OpenAI evaluation needs cost control, prompt design, structured output validation, and audit logging.
- Student-facing DTO privacy is critical; hidden tests and model answers must never leak.
- Automatic scoring must not be treated as final academic grading.

## Files Inspected

- `backend/OnlineExam.Api/Models/Question.cs`
- `backend/OnlineExam.Api/DTOs/CreateQuestionDto.cs`
- `backend/OnlineExam.Api/DTOs/CreateExamAttemptDto.cs`
- `backend/OnlineExam.Api/DTOs/QuestionTechnicalMetadataDto.cs`
- `backend/OnlineExam.Api/DTOs/ExamResultsDtos.cs`
- `backend/OnlineExam.Api/Controllers/QuestionsController.cs`
- `backend/OnlineExam.Api/Controllers/ExamsController.cs`
- `frontend/src/pages/exams/QuestionCreatePage.jsx`
- `frontend/src/pages/exams/StudentExamSessionPage.jsx`
- `frontend/src/pages/exams/ExamGradebookPage.jsx`
- `frontend/src/lib/examsApi.js`

