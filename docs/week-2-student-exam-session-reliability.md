# Week 2 - Student Exam Session Reliability

## Goal

Week 2 focuses on stabilizing the student exam lifecycle before thesis-level features are added. The main reliability areas are access-code verification, staff approval, rules display, autosave, refresh/reconnect behavior, submitted-attempt lock, re-entry rules, and integrity auto-submit.

## Student Exam Lifecycle

The intended lifecycle is:

1. The student opens a published available exam.
2. The student enters the professor-generated entry code.
3. A valid code moves the student to physical verification; it does not expose questions.
4. Professor or assistant approval is required before the student can start.
5. The student reviews the exam rules.
6. The student starts the live session.
7. The backend creates or resumes the in-progress attempt and starts the server-controlled timer.
8. The student answers questions, with local and backend draft saving during the active session.
9. The student submits manually, by timer expiry, or by integrity policy.
10. Submitted attempts become locked.

## Access Code and Approval Behavior

The backend validates the entry code against the active exam code and its expiration time. A valid code sets the access state to waiting for physical verification. The student cannot retrieve questions or start the timer until staff approval exists.

The frontend treats submitted access as a terminal state and does not allow it to enter the live session route.

## Autosave Behavior

The student workspace keeps a local draft in `localStorage` for fast refresh recovery. During the active live session, answers are also synced to the existing backend draft endpoint with the current client session identifier.

Draft saving is skipped when:

- the exam is not in the live session route;
- questions are not loaded yet;
- the result/submitted state is already shown;
- the browser is offline;
- the submitted lock has already been reached.

Backend draft saving remains protected by the API and rejects submitted attempts.

## Refresh and Reconnect Behavior

If the attempt is still in progress, a refresh restores the local draft and then reloads the current backend attempt, questions, timer, and integrity summary. If the network is offline, the UI marks the connection as lost and avoids backend draft calls until connectivity returns.

If the attempt is already submitted, the backend rejects editable attempt retrieval and the frontend shows the submitted lock state instead of reopening the exam workspace.

## Submitted-Attempt Lock

The backend remains the final authority. Submitted attempts are protected from:

- editable attempt retrieval;
- draft saving;
- technical answer runs;
- duplicate submit;
- new integrity events.

The frontend clears editable exam state after submit and redirects back to the exams page when appropriate.

## Re-entry Rules

Staff approval allows the student to start or continue an in-progress approved attempt. A simple allow action must not reopen a submitted attempt. Re-entry after submit should be handled only through a separate controlled staff authorization or reset workflow.

## Network Interruption Behavior

Short interruptions preserve local draft state in the browser. When the network returns, the live session can continue and backend sync resumes. Long interruptions are visible through the online/offline UI state and heartbeat gaps in monitoring, depending on the current monitor data.

## Integrity and Auto-submit

The frontend records fullscreen exit, tab/window focus loss, copy/cut/paste, restricted shortcuts, back navigation, print attempts, and offline events. Duplicate events of the same type are suppressed in a short local window. When the policy threshold is reached, auto-submit is attempted once and the submitted result state is shown after completion.

## Current Grading Limitation

The current grading pipeline is based on expected/model answers and heuristic automatic evaluation. For the thesis roadmap, text, SQL, and C# grading should later be upgraded with OpenAI-based evaluation, while still allowing professor review and manual override as the final academic decision.

## Manual Test Checklist

- Login as student and open an available exam.
- Verify that questions are not visible before code and staff approval.
- Enter a valid entry code and confirm the waiting state appears.
- Approve the student from staff monitoring.
- Confirm the student sees rules before the live session starts.
- Start the exam and answer at least two questions.
- Refresh during the exam and confirm answers are restored.
- Turn network off briefly and confirm the UI shows connection loss.
- Submit the exam and confirm the editable workspace closes.
- Try reopening the exam URL after submit and confirm it does not reopen.
- Trigger three integrity violations and confirm auto-submit happens once.

