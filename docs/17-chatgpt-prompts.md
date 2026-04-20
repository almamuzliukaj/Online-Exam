# 17. ChatGPT Prompts for the Three Teammates

## Prompt for Person 1
```text
Help me implement admin-only registration and bulk import for a university online exam system in ASP.NET Core and React. There is no public signup. Only admin can create students, professors, and assistants. Give me backend DTOs, endpoints, validation rules, UI fields, acceptance criteria, and test cases in English.
```

## Prompt for Person 2
```text
Help me design the academic structure for a faculty online exam system with 3 years, 6 semesters, and 34 courses. I need entity relationships, API design, permission rules, edge cases, and acceptance criteria for terms, courses, offerings, professor-assistant assignments, semester enrollments, and carry-over exams.
```

## Person 2 Design Blueprint

### Scope Assumptions
- The faculty has a fixed catalog of `34` courses distributed across `3` academic years and `6` semesters.
- `Term` means an academic delivery period such as `Winter 2026` or `Summer 2026`.
- `Course` is the catalog definition.
- `CourseOffering` is the term-specific delivery of a course for one cohort, semester, and assigned staff.
- A student belongs to one active semester enrollment at a time, but may also have carry-over eligibility from failed or postponed courses in earlier semesters.
- Historical data must be preserved. Staff and academic records should be deactivated or closed, not hard-deleted, once used by exams or grades.

### Recommended Entity Model

#### 1. `AcademicProgram`
Use this only if the team wants the 3-year, 6-semester structure to be configurable instead of hardcoded.

Fields:
- `Id`
- `Name`
- `TotalYears` = `3`
- `TotalSemesters` = `6`
- `IsActive`

#### 2. `Term`
Represents a real delivery window.

Fields:
- `Id`
- `Code` such as `2026-WIN`
- `Name` such as `Winter 2026`
- `Season` such as `Winter` or `Summer`
- `AcademicYearLabel` such as `2025/2026`
- `StartDate`
- `EndDate`
- `EnrollmentOpenAt`
- `EnrollmentCloseAt`
- `Status` = `Draft | Open | Active | Closed | Archived`
- `IsCurrent`

Rules:
- Only one term can be marked `IsCurrent = true`.
- `StartDate < EndDate`.
- `EnrollmentCloseAt <= EndDate`.
- `Code` must be unique.

#### 3. `Course`
Represents the permanent course catalog entry.

Fields:
- `Id`
- `Code`
- `Name`
- `Credits`
- `YearOfStudy` = `1..3`
- `DefaultSemesterNo` = `1..6`
- `IsElective`
- `IsActive`
- `Description`

Rules:
- `Code` must be unique.
- `DefaultSemesterNo` must match `YearOfStudy`.
Example:
- Year 1 -> semesters `1` or `2`
- Year 2 -> semesters `3` or `4`
- Year 3 -> semesters `5` or `6`

#### 4. `CourseOffering`
Represents a course taught in one term.

Fields:
- `Id`
- `CourseId`
- `TermId`
- `YearOfStudy`
- `SemesterNo`
- `SectionCode` such as `A` or `SE-1`
- `DeliveryType` = `Regular | RetakeOnly | Special`
- `Capacity`
- `Status` = `Draft | Published | Active | Closed | Archived`
- `PrimaryProfessorId`
- `ExamPolicyId` optional
- `CreatedAt`
- `UpdatedAt`

Rules:
- Unique combination: `CourseId + TermId + SectionCode`.
- `YearOfStudy` and `SemesterNo` must normally match the linked course defaults unless admin creates an approved exception.
- At least one professor must exist before the offering can move from `Draft` to `Published`.
- An offering may exist with no assistant.

#### 5. `CourseOfferingStaffAssignment`
Use a separate assignment table instead of storing one assistant directly on `CourseOffering`. This preserves history and supports replacement.

Fields:
- `Id`
- `CourseOfferingId`
- `UserId`
- `RoleInOffering` = `Professor | Assistant`
- `AssignmentType` = `Primary | Secondary`
- `PermissionsProfile` = `FullTeaching | LimitedTeaching | GradingOnly`
- `AssignedAt`
- `AssignedBy`
- `RevokedAt` nullable
- `RevokedBy` nullable
- `IsActive`

Rules:
- Exactly one active `Primary Professor` per offering.
- Zero to many assistants per offering.
- A user cannot have two active assignments with the same role on the same offering.
- Revoking an assignment must not remove audit history.

#### 6. `SemesterEnrollment`
Represents the student's main academic placement for a term.

Fields:
- `Id`
- `StudentId`
- `TermId`
- `YearOfStudy`
- `SemesterNo`
- `Status` = `Pending | Active | Frozen | Completed | Withdrawn`
- `EnrolledAt`
- `ApprovedBy`
- `Notes`

Rules:
- Only one active semester enrollment per student per term.
- A student should not have two active semester enrollments in different semesters within the same term.
- `YearOfStudy` and `SemesterNo` must be a valid pair in the 3-year structure.

#### 7. `StudentCourseEnrollment`
Represents eligibility for a specific offering.

Fields:
- `Id`
- `StudentId`
- `CourseOfferingId`
- `EnrollmentSource` = `RegularSemester | CarryOver | ManualOverride`
- `LinkedSemesterEnrollmentId` nullable
- `Status` = `Eligible | Locked | Withdrawn | Completed`
- `EligibleForExam`
- `CreatedAt`
- `CreatedBy`

Rules:
- Unique combination: `StudentId + CourseOfferingId`.
- Regular-semester rows are created from the student's `SemesterEnrollment`.
- Carry-over rows are created only when a prior attempt/result justifies them.

#### 8. `CarryOverCourse`
Represents the business reason a student may sit a course outside the normal semester.

Fields:
- `Id`
- `StudentId`
- `CourseId`
- `OriginTermId`
- `OriginSemesterNo`
- `Reason` = `Failed | Absent | Deferred | NotCompleted`
- `SourceResultId` nullable
- `Status` = `Open | AssignedToTerm | Closed | Cancelled`
- `ResolvedByPassingOfferingId` nullable
- `CreatedAt`
- `ClosedAt` nullable

Rules:
- A student may have at most one open carry-over record per course.
- Passing the course closes the carry-over record automatically.
- Admin and professor actions should never create duplicate open carry-over records for the same student/course pair.

### Entity Relationships
- `Term 1 -> many CourseOfferings`
- `Course 1 -> many CourseOfferings`
- `CourseOffering 1 -> many CourseOfferingStaffAssignments`
- `Term 1 -> many SemesterEnrollments`
- `Student 1 -> many SemesterEnrollments`
- `SemesterEnrollment 1 -> many StudentCourseEnrollments`
- `CourseOffering 1 -> many StudentCourseEnrollments`
- `Student 1 -> many CarryOverCourses`
- `Course 1 -> many CarryOverCourses`
- `CourseOffering 1 -> many Exams`
- `StudentCourseEnrollment` should be the eligibility source for exam registration and exam attempts

### Recommended API Design

#### Terms
- `GET /api/terms`
- `GET /api/terms/{id}`
- `POST /api/terms`
- `PUT /api/terms/{id}`
- `POST /api/terms/{id}/publish`
- `POST /api/terms/{id}/close`

Example create payload:
```json
{
  "code": "2026-WIN",
  "name": "Winter 2026",
  "season": "Winter",
  "academicYearLabel": "2025/2026",
  "startDate": "2026-01-15",
  "endDate": "2026-06-15",
  "enrollmentOpenAt": "2026-01-01T08:00:00Z",
  "enrollmentCloseAt": "2026-02-01T23:59:59Z"
}
```

#### Courses
- `GET /api/courses`
- `GET /api/courses/{id}`
- `POST /api/courses`
- `PUT /api/courses/{id}`
- `POST /api/courses/{id}/deactivate`

Example create payload:
```json
{
  "code": "CS201",
  "name": "Algorithms",
  "credits": 6,
  "yearOfStudy": 2,
  "defaultSemesterNo": 3,
  "isElective": false,
  "description": "Core algorithms course"
}
```

#### Course Offerings
- `GET /api/course-offerings`
- `GET /api/course-offerings/{id}`
- `GET /api/course-offerings/mine`
- `POST /api/course-offerings`
- `PUT /api/course-offerings/{id}`
- `POST /api/course-offerings/{id}/publish`
- `POST /api/course-offerings/{id}/close`

Example create payload:
```json
{
  "courseId": "guid",
  "termId": "guid",
  "yearOfStudy": 2,
  "semesterNo": 3,
  "sectionCode": "A",
  "deliveryType": "Regular",
  "capacity": 120,
  "primaryProfessorId": "guid"
}
```

#### Staff Assignments
- `GET /api/course-offerings/{offeringId}/staff`
- `POST /api/course-offerings/{offeringId}/staff`
- `PUT /api/course-offerings/{offeringId}/staff/{assignmentId}`
- `POST /api/course-offerings/{offeringId}/staff/{assignmentId}/revoke`

Example assign payload:
```json
{
  "userId": "guid",
  "roleInOffering": "Assistant",
  "assignmentType": "Secondary",
  "permissionsProfile": "GradingOnly"
}
```

#### Semester Enrollments
- `GET /api/semester-enrollments`
- `GET /api/students/{studentId}/semester-enrollments`
- `POST /api/students/{studentId}/semester-enrollments`
- `PUT /api/semester-enrollments/{id}`
- `POST /api/semester-enrollments/{id}/activate`
- `POST /api/semester-enrollments/{id}/withdraw`

Example create payload:
```json
{
  "termId": "guid",
  "yearOfStudy": 2,
  "semesterNo": 4,
  "status": "Pending",
  "notes": "Transferred from another section"
}
```

#### Student Course Eligibility
- `GET /api/students/{studentId}/course-enrollments?termId={termId}`
- `POST /api/students/{studentId}/course-enrollments/regularize`
- `POST /api/students/{studentId}/course-enrollments`
- `PUT /api/student-course-enrollments/{id}`

Use cases:
- Generate regular enrollments from semester rules.
- Add a manual carry-over enrollment to a specific offering.
- Lock or unlock exam eligibility.

#### Carry-Over Courses
- `GET /api/students/{studentId}/carry-overs`
- `POST /api/students/{studentId}/carry-overs`
- `POST /api/carry-overs/{id}/assign-offering`
- `POST /api/carry-overs/{id}/close`
- `POST /api/carry-overs/{id}/cancel`

Example create payload:
```json
{
  "courseId": "guid",
  "originTermId": "guid",
  "originSemesterNo": 2,
  "reason": "Failed"
}
```

### Permission Rules

#### Admin
- Full CRUD on terms, courses, offerings, staff assignments, semester enrollments, carry-overs, and enrollment overrides.
- Can publish or close terms and offerings.
- Can assign or revoke professors and assistants.
- Can activate, freeze, or withdraw student semester enrollments.
- Can manually open or close carry-over records when justified.

#### Professor
- Can view offerings where they have an active assignment.
- Can manage assistant assignments only if they are the primary professor and policy allows professor-managed assistants.
- Can view enrolled students and carry-over students for their offerings.
- Can unlock exam eligibility for students in their own offerings.
- Can close a carry-over only through a passing exam/result flow, not by arbitrary deletion.

#### Assistant
- Can view offerings where they have an active assignment.
- Can view enrolled students in those offerings.
- Cannot create or edit terms, catalog courses, semester enrollments, or carry-over records unless a future policy explicitly allows it.
- Should not be allowed to reassign staff.

#### Student
- Read-only access to their own active semester enrollment, course eligibility list, and carry-over status.
- Cannot self-enroll into offerings or open carry-over records.

### Business and Validation Rules
- The 34-course catalog should be seeded or imported once, then reused each term through offerings.
- Terms and course catalog entries are master data; offerings and enrollments are transactional data.
- A course cannot be hard-deleted if any offering, exam, or carry-over references it.
- A term cannot be closed while there are draft offerings or pending enrollment approvals unless admin confirms override.
- A student's regular-semester course enrollments should be generated from the semester number and the course catalog defaults.
- Carry-over enrollment should not automatically include every failed course unless policy says so; it should be reviewable.
- Exam eligibility must be tied to `StudentCourseEnrollment`, not only to student role or term.
- Assignment history must remain visible for auditing exam ownership and grading responsibility.

### Key Edge Cases
- A professor leaves mid-term and a replacement professor is assigned. Old exams and grading history must still show the previous assignment.
- An assistant is removed after helping build exams. Existing audit logs must still reference the assistant.
- A course is inactive in the catalog but still has historical offerings. Historical views must remain readable.
- A student repeats semester 3 in a new term. The system must allow a new `SemesterEnrollment` for the new term without overwriting the old one.
- A student is active in semester 4 but still carries one failed course from semester 2. Both regular and carry-over eligibilities must coexist.
- A student passes a carry-over course in the current term. The open carry-over record must close automatically and no duplicate exam eligibility should remain.
- The same course has multiple sections in the same term. Student eligibility must point to exactly one section unless faculty policy allows multi-section access.
- A term changes from `Open` to `Active`. Late changes to core semester mappings should be blocked or require elevated admin confirmation.
- A professor tries to publish an exam for a student not enrolled in that offering. The system must reject or hide that student from eligibility lists.
- A student was manually unlocked for a carry-over exam, then withdrawn from the term. The offering-specific eligibility should become locked.

### Acceptance Criteria

#### Terms
- Admin can create, update, publish, and close terms.
- The system prevents duplicate term codes.
- The system prevents more than one current term at a time.
- Closed terms remain visible in historical reporting.

#### Courses
- Admin can create and deactivate catalog courses.
- Each course is mapped to one default year and semester in the 3-year program.
- The system prevents duplicate course codes.
- Deactivated courses cannot be used for new offerings but remain visible historically.

#### Course Offerings
- Admin can create offerings by selecting term, course, year, semester, section, and primary professor.
- Offerings are grouped and filterable by year, semester, and term.
- An offering cannot be published without an active primary professor.
- Professors and assistants only see offerings where they have active assignments.

#### Professor-Assistant Assignments
- Admin can assign, replace, and revoke professors and assistants without deleting history.
- Each offering has exactly one active primary professor.
- An offering may have zero or more active assistants.
- Revoked assignments remain visible in audit/history screens.

#### Semester Enrollments
- Admin can create one active semester enrollment per student per term.
- The system rejects overlapping active semester enrollments for the same student and term.
- Regular course eligibility can be generated automatically from the semester enrollment.
- Students can view but not edit their own semester enrollment.

#### Carry-Over Exams
- Admin or approved workflow can create a carry-over record for a failed, absent, deferred, or incomplete course.
- A student can be enrolled in both regular and carry-over offerings in the same term.
- The system prevents duplicate open carry-over records for the same student and course.
- Passing the related course closes the open carry-over record automatically.
- Exam access is granted only when the student has an eligible `StudentCourseEnrollment` tied to the correct offering.

### Suggested Implementation Notes For This Repo
- Keep existing `Term`, `Course`, and `CourseOffering` names to avoid unnecessary churn.
- Refactor `CourseOffering.AssistantId` into a separate assignment table when the team is ready to support assistant history and multiple assistants.
- Add `SemesterEnrollment`, `StudentCourseEnrollment`, and `CarryOverCourse` before tying exams to academic eligibility.
- Update exam creation and exam-taking flows to reference `CourseOfferingId` and `StudentCourseEnrollmentId`.
- Seed the 34-course catalog from configuration or JSON so the faculty structure is reproducible across environments.

### Person 2 Implementation Status
- Backend for `Terms`, `Courses`, `CourseOfferings`, `CourseOfferingStaffAssignments`, `SemesterEnrollments`, `StudentCourseEnrollments`, and `CarryOverCourses` is implemented in `OnlineExam.Api`.
- Admin frontend now includes:
  - `User management` for sprint 1 identity flows
  - `Course catalog` for sprint 2 catalog CRUD and filtering
  - `Course offerings` for sprint 2 offering creation, publish/close actions, and staff assignment history
- Question authoring now supports:
  - `CSharp` questions with starter code and test case setup
  - `SQL` questions with starter query and test case setup
  - backend validation that blocks unsupported languages and empty test case foundations
- Remaining future work for Person 2 is mainly downstream integration:
  - student enrollment UI expansion
  - carry-over management UI
  - richer academic analytics and audit views

## Prompt for Person 3
```text
Help me design a professional English frontend for a university online exam system in React. I need page structure, navigation, reusable components, dashboard widgets, empty states, style direction, and acceptance criteria for admin, professor, assistant, and student roles.
```
