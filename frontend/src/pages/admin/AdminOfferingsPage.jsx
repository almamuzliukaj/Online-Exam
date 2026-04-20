import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  assignOfferingStaff,
  closeOffering,
  createOffering,
  listCourses,
  listOfferingStaff,
  listOfferings,
  listTerms,
  publishOffering,
  revokeOfferingStaff,
  updateOffering,
} from "../../lib/academicApi";
import { listUsers } from "../../lib/usersApi";

const DELIVERY_TYPES = ["Regular", "RetakeOnly", "Special"];
const OFFERING_STATUSES = ["Draft", "Published", "Active", "Closed", "Archived"];
const PERMISSION_PROFILES = {
  Professor: ["FullTeaching", "LimitedTeaching"],
  Assistant: ["GradingOnly", "LimitedTeaching"],
};

const initialOfferingForm = {
  courseId: "",
  termId: "",
  yearOfStudy: 1,
  semesterNo: 1,
  sectionCode: "A",
  deliveryType: "Regular",
  capacity: 120,
  primaryProfessorId: "",
  assistantId: "",
};

const initialAssignmentForm = {
  userId: "",
  roleInOffering: "Assistant",
  assignmentType: "Secondary",
  permissionsProfile: "GradingOnly",
};

export default function AdminOfferingsPage() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [terms, setTerms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [staffAssignments, setStaffAssignments] = useState([]);
  const [filters, setFilters] = useState({ termId: "all", yearOfStudy: "all", semesterNo: "all" });
  const [createForm, setCreateForm] = useState(initialOfferingForm);
  const [selectedOfferingId, setSelectedOfferingId] = useState("");
  const [editForm, setEditForm] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState(initialAssignmentForm);
  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [pageError, setPageError] = useState("");
  const [pageSuccess, setPageSuccess] = useState("");

  const offeringFilters = useMemo(() => ({
    termId: filters.termId === "all" ? undefined : filters.termId,
    yearOfStudy: filters.yearOfStudy === "all" ? undefined : Number(filters.yearOfStudy),
    semesterNo: filters.semesterNo === "all" ? undefined : Number(filters.semesterNo),
  }), [filters]);

  const selectedOffering = useMemo(
    () => offerings.find((item) => item.id === selectedOfferingId) || null,
    [offerings, selectedOfferingId],
  );

  const activeAssignments = useMemo(
    () => staffAssignments.filter((assignment) => assignment.isActive),
    [staffAssignments],
  );

  const loadSupportingData = useCallback(async () => {
    const [termsData, coursesData, professorsData, assistantsData] = await Promise.all([
      listTerms(),
      listCourses(),
      listUsers({ role: "Professor", isActive: true }),
      listUsers({ role: "Assistant", isActive: true }),
    ]);

    setTerms(Array.isArray(termsData) ? termsData : []);
    setCourses(Array.isArray(coursesData) ? coursesData : []);
    setProfessors(Array.isArray(professorsData) ? professorsData : []);
    setAssistants(Array.isArray(assistantsData) ? assistantsData : []);
  }, []);

  const loadOfferings = useCallback(async () => {
    const data = await listOfferings(offeringFilters);
    setOfferings(Array.isArray(data) ? data : []);
  }, [offeringFilters]);

  const loadStaffAssignments = useCallback(async (offeringId) => {
    if (!offeringId) {
      setStaffAssignments([]);
      return;
    }

    try {
      setLoadingAssignments(true);
      const data = await listOfferingStaff(offeringId);
      setStaffAssignments(Array.isArray(data) ? data : []);
    } finally {
      setLoadingAssignments(false);
    }
  }, []);

  useEffect(() => {
    async function initialize() {
      try {
        setLoadingPage(true);
        setPageError("");
        await loadSupportingData();
      } catch (error) {
        setPageError(readError(error, "Failed to load catalog data for offerings."));
      } finally {
        setLoadingPage(false);
      }
    }

    initialize();
  }, [loadSupportingData]);

  useEffect(() => {
    async function reloadOfferings() {
      try {
        setPageError("");
        await loadOfferings();
      } catch (error) {
        setPageError(readError(error, "Failed to load offerings."));
      }
    }

    reloadOfferings();
  }, [loadOfferings]);

  useEffect(() => {
    if (!selectedOffering && offerings.length > 0) {
      const firstOffering = offerings[0];
      setSelectedOfferingId(firstOffering.id);
      setEditForm(buildEditForm(firstOffering));
      return;
    }

    if (selectedOffering) {
      setEditForm(buildEditForm(selectedOffering));
      loadStaffAssignments(selectedOffering.id).catch((error) => {
        setPageError(readError(error, "Failed to load staff assignments."));
      });
    } else {
      setEditForm(null);
      setStaffAssignments([]);
    }
  }, [selectedOffering, offerings, loadStaffAssignments]);

  async function handleCreateOffering(event) {
    event.preventDefault();
    try {
      setSavingCreate(true);
      setPageError("");
      setPageSuccess("");
      const payload = {
        ...createForm,
        assistantId: createForm.assistantId || null,
      };
      const created = await createOffering(payload);
      setCreateForm(initialOfferingForm);
      setPageSuccess("Course offering created successfully.");
      await loadOfferings();
      if (created?.id) {
        setSelectedOfferingId(created.id);
      }
    } catch (error) {
      setPageError(readError(error, "Failed to create offering."));
    } finally {
      setSavingCreate(false);
    }
  }

  async function handleSaveOffering() {
    if (!selectedOfferingId || !editForm) {
      return;
    }

    try {
      setSavingEdit(true);
      setPageError("");
      await updateOffering(selectedOfferingId, {
        ...editForm,
        assistantId: editForm.assistantId || null,
      });
      setPageSuccess("Offering updated successfully.");
      await loadOfferings();
      await loadStaffAssignments(selectedOfferingId);
    } catch (error) {
      setPageError(readError(error, "Failed to update offering."));
    } finally {
      setSavingEdit(false);
    }
  }

  async function handlePublishOffering() {
    if (!selectedOfferingId) {
      return;
    }

    try {
      setPageError("");
      await publishOffering(selectedOfferingId);
      setPageSuccess("Offering published successfully.");
      await loadOfferings();
    } catch (error) {
      setPageError(readError(error, "Failed to publish offering."));
    }
  }

  async function handleCloseOffering() {
    if (!selectedOfferingId) {
      return;
    }

    try {
      setPageError("");
      await closeOffering(selectedOfferingId);
      setPageSuccess("Offering closed successfully.");
      await loadOfferings();
    } catch (error) {
      setPageError(readError(error, "Failed to close offering."));
    }
  }

  async function handleAssignStaff(event) {
    event.preventDefault();
    if (!selectedOfferingId) {
      return;
    }

    try {
      setSavingAssignment(true);
      setPageError("");
      await assignOfferingStaff(selectedOfferingId, assignmentForm);
      setAssignmentForm(initialAssignmentForm);
      setPageSuccess("Staff assignment added successfully.");
      await loadOfferings();
      await loadStaffAssignments(selectedOfferingId);
    } catch (error) {
      setPageError(readError(error, "Failed to assign staff."));
    } finally {
      setSavingAssignment(false);
    }
  }

  async function handleRevokeAssignment(assignmentId) {
    if (!selectedOfferingId) {
      return;
    }

    try {
      setPageError("");
      await revokeOfferingStaff(selectedOfferingId, assignmentId);
      setPageSuccess("Assignment revoked successfully.");
      await loadOfferings();
      await loadStaffAssignments(selectedOfferingId);
    } catch (error) {
      setPageError(readError(error, "Failed to revoke assignment."));
    }
  }

  if (userLoading) {
    return <div className="pageState">Loading offering operations...</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || "Unable to load current user."}</div>;
  }

  return (
    <AppShell
      user={user}
      badge="Administration"
      title="Course offerings"
      subtitle="Create term-based deliveries, assign teaching staff, and keep the academic delivery unit aligned with the catalog and term structure."
      actions={
        <>
          <Link className="btn" to="/admin/courses">Open catalog</Link>
          <Link className="btn btnPrimary" to="/dashboard">Back to overview</Link>
        </>
      }
    >
      <div className="stackXl">
        {pageError ? <div className="alert">{pageError}</div> : null}
        {pageSuccess ? <div className="successBanner">{pageSuccess}</div> : null}

        <section className="summaryStrip">
          <article className="summaryCard">
            <span className="summaryLabel">Visible offerings</span>
            <strong>{offerings.length}</strong>
          </article>
          <article className="summaryCard">
            <span className="summaryLabel">Active terms</span>
            <strong>{terms.filter((term) => term.status !== "Archived").length}</strong>
          </article>
          <article className="summaryCard">
            <span className="summaryLabel">Teaching staff</span>
            <strong>{professors.length + assistants.length}</strong>
          </article>
        </section>

        <section className="dashboardGrid dashboardGridWide">
          <article className="surfaceCard">
            <div className="sectionHeader">
              <h3>Create offering</h3>
            </div>
            <div className="sectionBody">
              {loadingPage ? (
                <div className="pageStateCard">Loading terms, catalog, and staff...</div>
              ) : (
                <form className="stackLg" onSubmit={handleCreateOffering}>
                  <div className="gridTwo">
                    <div className="field">
                      <label className="label">Term</label>
                      <select
                        className="input"
                        value={createForm.termId}
                        onChange={(event) => setCreateForm((current) => ({ ...current, termId: event.target.value }))}
                        required
                      >
                        <option value="">Select term</option>
                        {terms.map((term) => (
                          <option key={term.id} value={term.id}>
                            {term.name} ({term.status})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Course</label>
                      <select
                        className="input"
                        value={createForm.courseId}
                        onChange={(event) => {
                          const course = courses.find((item) => item.id === event.target.value);
                          setCreateForm((current) => ({
                            ...current,
                            courseId: event.target.value,
                            yearOfStudy: course?.yearOfStudy ?? current.yearOfStudy,
                            semesterNo: course?.defaultSemesterNo ?? current.semesterNo,
                          }));
                        }}
                        required
                      >
                        <option value="">Select course</option>
                        {courses.filter((course) => course.isActive).map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.code} - {course.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="gridThree">
                    <div className="field">
                      <label className="label">Year of study</label>
                      <select
                        className="input"
                        value={createForm.yearOfStudy}
                        onChange={(event) => setCreateForm((current) => ({
                          ...current,
                          yearOfStudy: Number(event.target.value),
                          semesterNo: semesterOptionsForYear(Number(event.target.value))[0],
                        }))}
                      >
                        {[1, 2, 3].map((value) => (
                          <option key={value} value={value}>{`Year ${value}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Semester</label>
                      <select
                        className="input"
                        value={createForm.semesterNo}
                        onChange={(event) => setCreateForm((current) => ({ ...current, semesterNo: Number(event.target.value) }))}
                      >
                        {semesterOptionsForYear(createForm.yearOfStudy).map((value) => (
                          <option key={value} value={value}>{`Semester ${value}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Section</label>
                      <input
                        className="input"
                        value={createForm.sectionCode}
                        onChange={(event) => setCreateForm((current) => ({ ...current, sectionCode: event.target.value.toUpperCase() }))}
                        placeholder="A"
                        required
                      />
                    </div>
                  </div>

                  <div className="gridThree">
                    <div className="field">
                      <label className="label">Delivery type</label>
                      <select
                        className="input"
                        value={createForm.deliveryType}
                        onChange={(event) => setCreateForm((current) => ({ ...current, deliveryType: event.target.value }))}
                      >
                        {DELIVERY_TYPES.map((value) => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Capacity</label>
                      <input
                        className="input"
                        type="number"
                        min="0"
                        value={createForm.capacity}
                        onChange={(event) => setCreateForm((current) => ({ ...current, capacity: Number(event.target.value) }))}
                      />
                    </div>
                    <div className="field">
                      <label className="label">Primary professor</label>
                      <select
                        className="input"
                        value={createForm.primaryProfessorId}
                        onChange={(event) => setCreateForm((current) => ({ ...current, primaryProfessorId: event.target.value }))}
                        required
                      >
                        <option value="">Select professor</option>
                        {professors.map((professor) => (
                          <option key={professor.id} value={professor.id}>
                            {professor.fullName} ({professor.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Assistant</label>
                    <select
                      className="input"
                      value={createForm.assistantId}
                      onChange={(event) => setCreateForm((current) => ({ ...current, assistantId: event.target.value }))}
                    >
                      <option value="">No assistant assigned yet</option>
                      {assistants.map((assistant) => (
                        <option key={assistant.id} value={assistant.id}>
                          {assistant.fullName} ({assistant.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button className="btn btnPrimary" type="submit" disabled={savingCreate}>
                    {savingCreate ? "Creating..." : "Create offering"}
                  </button>
                </form>
              )}
            </div>
          </article>

          <article className="surfaceCard">
            <div className="sectionHeader">
              <h3>Offering filters</h3>
            </div>
            <div className="sectionBody stackLg">
              <div className="filtersRow filtersRowWide">
                <select
                  className="input"
                  value={filters.termId}
                  onChange={(event) => setFilters((current) => ({ ...current, termId: event.target.value }))}
                >
                  <option value="all">All terms</option>
                  {terms.map((term) => (
                    <option key={term.id} value={term.id}>{term.name}</option>
                  ))}
                </select>
                <select
                  className="input"
                  value={filters.yearOfStudy}
                  onChange={(event) => setFilters((current) => ({ ...current, yearOfStudy: event.target.value }))}
                >
                  <option value="all">All years</option>
                  {[1, 2, 3].map((value) => (
                    <option key={value} value={value}>{`Year ${value}`}</option>
                  ))}
                </select>
                <select
                  className="input"
                  value={filters.semesterNo}
                  onChange={(event) => setFilters((current) => ({ ...current, semesterNo: event.target.value }))}
                >
                  <option value="all">All semesters</option>
                  {[1, 2, 3, 4, 5, 6].map((value) => (
                    <option key={value} value={value}>{`Semester ${value}`}</option>
                  ))}
                </select>
              </div>

              <div className="bulletStack">
                <div className="listRow">
                  <span className="listDot" />
                  <span>Offerings are the true delivery unit. This is where staff assignment and later exam ownership attach.</span>
                </div>
                <div className="listRow">
                  <span className="listDot" />
                  <span>Use the update panel to replace the primary professor or assistant without deleting assignment history.</span>
                </div>
                <div className="listRow">
                  <span className="listDot" />
                  <span>Publishing is blocked by the backend if a valid primary professor is missing.</span>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="dashboardGrid dashboardGridWide">
          <article className="surfaceCard">
            <div className="sectionHeader">
              <h3>Offerings directory</h3>
            </div>
            <div className="sectionBody">
              {offerings.length === 0 ? (
                <div className="emptyState">No offerings match the current filters yet.</div>
              ) : (
                <div className="tableWrap">
                  <table className="dataTable">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Term</th>
                        <th>Year / Semester</th>
                        <th>Section</th>
                        <th>Delivery</th>
                        <th>Status</th>
                        <th>Staff</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offerings.map((offering) => (
                        <tr key={offering.id}>
                          <td>
                            <div className="cellTitle">{offering.course?.code} - {offering.course?.name}</div>
                            <div className="cellMeta">Capacity {offering.capacity}</div>
                          </td>
                          <td>{offering.term?.name || "Unknown term"}</td>
                          <td>{`Y${offering.yearOfStudy} / S${offering.semesterNo}`}</td>
                          <td>{offering.sectionCode}</td>
                          <td>{offering.deliveryType}</td>
                          <td><span className={`statusPill ${statusClassName(offering.status)}`}>{offering.status}</span></td>
                          <td>{renderStaffPreview(offering, professors, assistants)}</td>
                          <td>
                            <button
                              className="btn"
                              type="button"
                              onClick={() => setSelectedOfferingId(offering.id)}
                            >
                              {selectedOfferingId === offering.id ? "Selected" : "Manage"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </article>

          <article className="surfaceCard">
            <div className="sectionHeader">
              <h3>{selectedOffering ? "Manage selected offering" : "Select an offering"}</h3>
            </div>
            <div className="sectionBody">
              {!selectedOffering || !editForm ? (
                <div className="emptyState">Choose an offering from the directory to update it and manage staff history.</div>
              ) : (
                <div className="stackLg">
                  <div className="inlineMetaPanel">
                    <div>
                      <strong>{selectedOffering.course?.code} - {selectedOffering.course?.name}</strong>
                      <div className="cellMeta">{selectedOffering.term?.name} · Section {selectedOffering.sectionCode}</div>
                    </div>
                    <span className={`statusPill ${statusClassName(selectedOffering.status)}`}>{selectedOffering.status}</span>
                  </div>

                  <div className="gridThree">
                    <div className="field">
                      <label className="label">Year of study</label>
                      <select
                        className="input"
                        value={editForm.yearOfStudy}
                        onChange={(event) => setEditForm((current) => ({
                          ...current,
                          yearOfStudy: Number(event.target.value),
                          semesterNo: semesterOptionsForYear(Number(event.target.value))[0],
                        }))}
                      >
                        {[1, 2, 3].map((value) => (
                          <option key={value} value={value}>{`Year ${value}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Semester</label>
                      <select
                        className="input"
                        value={editForm.semesterNo}
                        onChange={(event) => setEditForm((current) => ({ ...current, semesterNo: Number(event.target.value) }))}
                      >
                        {semesterOptionsForYear(editForm.yearOfStudy).map((value) => (
                          <option key={value} value={value}>{`Semester ${value}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Section</label>
                      <input
                        className="input"
                        value={editForm.sectionCode}
                        onChange={(event) => setEditForm((current) => ({ ...current, sectionCode: event.target.value.toUpperCase() }))}
                      />
                    </div>
                  </div>

                  <div className="gridThree">
                    <div className="field">
                      <label className="label">Delivery type</label>
                      <select
                        className="input"
                        value={editForm.deliveryType}
                        onChange={(event) => setEditForm((current) => ({ ...current, deliveryType: event.target.value }))}
                      >
                        {DELIVERY_TYPES.map((value) => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Capacity</label>
                      <input
                        className="input"
                        type="number"
                        min="0"
                        value={editForm.capacity}
                        onChange={(event) => setEditForm((current) => ({ ...current, capacity: Number(event.target.value) }))}
                      />
                    </div>
                    <div className="field">
                      <label className="label">Status</label>
                      <select
                        className="input"
                        value={editForm.status}
                        onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))}
                      >
                        {OFFERING_STATUSES.map((value) => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="gridTwo">
                    <div className="field">
                      <label className="label">Primary professor</label>
                      <select
                        className="input"
                        value={editForm.primaryProfessorId}
                        onChange={(event) => setEditForm((current) => ({ ...current, primaryProfessorId: event.target.value }))}
                      >
                        <option value="">Select professor</option>
                        {professors.map((professor) => (
                          <option key={professor.id} value={professor.id}>
                            {professor.fullName} ({professor.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Assistant</label>
                      <select
                        className="input"
                        value={editForm.assistantId}
                        onChange={(event) => setEditForm((current) => ({ ...current, assistantId: event.target.value }))}
                      >
                        <option value="">No assistant assigned</option>
                        {assistants.map((assistant) => (
                          <option key={assistant.id} value={assistant.id}>
                            {assistant.fullName} ({assistant.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row rowStart rowWrap">
                    <button className="btn btnPrimary" type="button" onClick={handleSaveOffering} disabled={savingEdit}>
                      {savingEdit ? "Saving..." : "Save offering"}
                    </button>
                    <button className="btn" type="button" onClick={handlePublishOffering}>Publish</button>
                    <button className="btn" type="button" onClick={handleCloseOffering}>Close</button>
                  </div>
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="dashboardGrid dashboardGridWide">
          <article className="surfaceCard">
            <div className="sectionHeader">
              <h3>Assign additional staff</h3>
            </div>
            <div className="sectionBody">
              {!selectedOffering ? (
                <div className="emptyState">Select an offering first to manage assignment history.</div>
              ) : (
                <form className="stackLg" onSubmit={handleAssignStaff}>
                  <div className="gridThree">
                    <div className="field">
                      <label className="label">Role in offering</label>
                      <select
                        className="input"
                        value={assignmentForm.roleInOffering}
                        onChange={(event) => {
                          const roleInOffering = event.target.value;
                          setAssignmentForm((current) => ({
                            ...current,
                            roleInOffering,
                            permissionsProfile: PERMISSION_PROFILES[roleInOffering][0],
                          }));
                        }}
                      >
                        <option value="Assistant">Assistant</option>
                        <option value="Professor">Professor</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Assignment type</label>
                      <select
                        className="input"
                        value={assignmentForm.assignmentType}
                        onChange={(event) => setAssignmentForm((current) => ({ ...current, assignmentType: event.target.value }))}
                      >
                        <option value="Secondary">Secondary</option>
                        <option value="Primary">Primary</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Permissions profile</label>
                      <select
                        className="input"
                        value={assignmentForm.permissionsProfile}
                        onChange={(event) => setAssignmentForm((current) => ({ ...current, permissionsProfile: event.target.value }))}
                      >
                        {PERMISSION_PROFILES[assignmentForm.roleInOffering].map((value) => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">User</label>
                    <select
                      className="input"
                      value={assignmentForm.userId}
                      onChange={(event) => setAssignmentForm((current) => ({ ...current, userId: event.target.value }))}
                      required
                    >
                      <option value="">Select user</option>
                      {(assignmentForm.roleInOffering === "Professor" ? professors : assistants).map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.fullName} ({account.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button className="btn btnPrimary" type="submit" disabled={savingAssignment}>
                    {savingAssignment ? "Assigning..." : "Add assignment"}
                  </button>
                </form>
              )}
            </div>
          </article>

          <article className="surfaceCard">
            <div className="sectionHeader">
              <h3>Assignment history</h3>
            </div>
            <div className="sectionBody">
              {!selectedOffering ? (
                <div className="emptyState">Assignment history appears after an offering is selected.</div>
              ) : loadingAssignments ? (
                <div className="pageStateCard">Loading assignment history...</div>
              ) : staffAssignments.length === 0 ? (
                <div className="emptyState">No assignment history found for this offering yet.</div>
              ) : (
                <div className="tableWrap">
                  <table className="dataTable">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Assignment</th>
                        <th>Permissions</th>
                        <th>Status</th>
                        <th>Assigned</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffAssignments.map((assignment) => (
                        <tr key={assignment.id}>
                          <td>{resolveUserName(assignment.userId, professors, assistants)}</td>
                          <td>{assignment.roleInOffering}</td>
                          <td>{assignment.assignmentType}</td>
                          <td>{assignment.permissionsProfile}</td>
                          <td>
                            <span className={`statusPill ${assignment.isActive ? "statusLive" : "statusDraft"}`}>
                              {assignment.isActive ? "Active" : "Revoked"}
                            </span>
                          </td>
                          <td>{new Date(assignment.assignedAt).toLocaleString()}</td>
                          <td>
                            {assignment.isActive ? (
                              <button className="btn" type="button" onClick={() => handleRevokeAssignment(assignment.id)}>
                                Revoke
                              </button>
                            ) : (
                              <span className="cellMeta">Revoked</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {selectedOffering && activeAssignments.length > 0 ? (
                <div className="small" style={{ marginTop: 14 }}>
                  Active staff now: {activeAssignments.map((assignment) => resolveUserName(assignment.userId, professors, assistants)).join(", ")}
                </div>
              ) : null}
            </div>
          </article>
        </section>
      </div>
    </AppShell>
  );
}

function buildEditForm(offering) {
  return {
    yearOfStudy: offering.yearOfStudy,
    semesterNo: offering.semesterNo,
    sectionCode: offering.sectionCode,
    deliveryType: offering.deliveryType,
    capacity: offering.capacity,
    status: offering.status,
    primaryProfessorId: offering.primaryProfessorId || "",
    assistantId: offering.assistantId || "",
  };
}

function semesterOptionsForYear(yearOfStudy) {
  return yearOfStudy === 1 ? [1, 2] : yearOfStudy === 2 ? [3, 4] : [5, 6];
}

function statusClassName(status) {
  if (status === "Published" || status === "Active") {
    return "statusLive";
  }

  if (status === "Closed" || status === "Archived") {
    return "statusMuted";
  }

  return "statusDraft";
}

function resolveUserName(userId, professors, assistants) {
  const account = [...professors, ...assistants].find((item) => item.id === userId);
  return account ? `${account.fullName} (${account.email})` : userId;
}

function renderStaffPreview(offering, professors, assistants) {
  const professor = professors.find((item) => item.id === offering.primaryProfessorId);
  const assistant = assistants.find((item) => item.id === offering.assistantId);
  const labels = [];

  if (professor) {
    labels.push(`Prof. ${professor.fullName}`);
  }
  if (assistant) {
    labels.push(`Asst. ${assistant.fullName}`);
  }

  return labels.length > 0 ? labels.join(" / ") : "Unassigned";
}

function readError(error, fallback) {
  return error?.response?.data?.message || fallback;
}
