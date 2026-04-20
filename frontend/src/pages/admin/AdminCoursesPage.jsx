import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  createCourse,
  deactivateCourse,
  listCourses,
  updateCourse,
} from "../../lib/academicApi";

const initialCourseForm = {
  code: "",
  name: "",
  credits: 6,
  yearOfStudy: 1,
  defaultSemesterNo: 1,
  isElective: false,
  description: "",
};

export default function AdminCoursesPage() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    yearOfStudy: "all",
    semesterNo: "all",
    status: "all",
  });
  const [createForm, setCreateForm] = useState(initialCourseForm);
  const [editId, setEditId] = useState("");
  const [editForm, setEditForm] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [savingCreate, setSavingCreate] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [pageError, setPageError] = useState("");
  const [pageSuccess, setPageSuccess] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const normalizedSearch = filters.search.trim().toLowerCase();
      const matchesSearch = !normalizedSearch ||
        course.code?.toLowerCase().includes(normalizedSearch) ||
        course.name?.toLowerCase().includes(normalizedSearch);
      const matchesYear = filters.yearOfStudy === "all" || Number(filters.yearOfStudy) === course.yearOfStudy;
      const matchesSemester = filters.semesterNo === "all" || Number(filters.semesterNo) === course.defaultSemesterNo;
      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && course.isActive) ||
        (filters.status === "inactive" && !course.isActive);

      return matchesSearch && matchesYear && matchesSemester && matchesStatus;
    });
  }, [courses, filters]);

  const loadCourses = useCallback(async () => {
    try {
      setLoadingCourses(true);
      setPageError("");
      const data = await listCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(readError(error, "Failed to load course catalog."));
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  async function handleCreateCourse(event) {
    event.preventDefault();
    try {
      setSavingCreate(true);
      setPageError("");
      setPageSuccess("");
      await createCourse(createForm);
      setCreateForm(initialCourseForm);
      setPageSuccess("Course created successfully.");
      await loadCourses();
    } catch (error) {
      setPageError(readError(error, "Failed to create course."));
    } finally {
      setSavingCreate(false);
    }
  }

  function startEdit(course) {
    setEditId(course.id);
    setEditForm({
      code: course.code,
      name: course.name,
      credits: course.credits,
      yearOfStudy: course.yearOfStudy,
      defaultSemesterNo: course.defaultSemesterNo,
      isElective: course.isElective,
      isActive: course.isActive,
      description: course.description || "",
    });
    setPageSuccess("");
    setPageError("");
  }

  async function handleSaveEdit() {
    if (!editId || !editForm) {
      return;
    }

    try {
      setSavingEdit(true);
      setPageError("");
      await updateCourse(editId, editForm);
      setPageSuccess("Course updated successfully.");
      setEditId("");
      setEditForm(null);
      await loadCourses();
    } catch (error) {
      setPageError(readError(error, "Failed to update course."));
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeactivate(courseId) {
    try {
      setPageError("");
      await deactivateCourse(courseId);
      setPageSuccess("Course deactivated successfully.");
      if (editId === courseId) {
        setEditId("");
        setEditForm(null);
      }
      await loadCourses();
    } catch (error) {
      setPageError(readError(error, "Failed to deactivate course."));
    }
  }

  if (userLoading) {
    return <div className="pageState">Loading academic catalog workspace...</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || "Unable to load current user."}</div>;
  }

  const activeCount = courses.filter((course) => course.isActive).length;

  return (
    <AppShell
      user={user}
      badge="Administration"
      title="Course catalog"
      subtitle="Manage the reusable academic catalog that later powers offerings, exam ownership, and student eligibility."
      actions={
        <>
          <Link className="btn" to="/admin/offerings">Open offerings</Link>
          <Link className="btn btnPrimary" to="/dashboard">Back to overview</Link>
        </>
      }
    >
      <div className="stackXl">
        {pageError ? <div className="alert">{pageError}</div> : null}
        {pageSuccess ? <div className="successBanner">{pageSuccess}</div> : null}

        <section className="summaryStrip">
          <article className="summaryCard">
            <span className="summaryLabel">Catalog size</span>
            <strong>{courses.length}</strong>
          </article>
          <article className="summaryCard">
            <span className="summaryLabel">Active courses</span>
            <strong>{activeCount}</strong>
          </article>
          <article className="summaryCard">
            <span className="summaryLabel">Inactive courses</span>
            <strong>{courses.length - activeCount}</strong>
          </article>
        </section>

        <section className="dashboardGrid dashboardGridWide">
          <article className="surfaceCard">
            <div className="sectionHeader">
              <h3>Create course</h3>
            </div>
            <div className="sectionBody">
              <form className="stackLg" onSubmit={handleCreateCourse}>
                <div className="gridTwo">
                  <div className="field">
                    <label className="label">Code</label>
                    <input
                      className="input"
                      value={createForm.code}
                      onChange={(event) => setCreateForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
                      placeholder="CS201"
                      required
                    />
                  </div>
                  <div className="field">
                    <label className="label">Credits</label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={createForm.credits}
                      onChange={(event) => setCreateForm((current) => ({ ...current, credits: Number(event.target.value) }))}
                      required
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Name</label>
                  <input
                    className="input"
                    value={createForm.name}
                    onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Algorithms"
                    required
                  />
                </div>

                <div className="gridTwo">
                  <div className="field">
                    <label className="label">Year of study</label>
                    <select
                      className="input"
                      value={createForm.yearOfStudy}
                      onChange={(event) => setCreateForm((current) => ({
                        ...current,
                        yearOfStudy: Number(event.target.value),
                        defaultSemesterNo: semesterOptionsForYear(Number(event.target.value))[0],
                      }))}
                    >
                      {[1, 2, 3].map((value) => (
                        <option key={value} value={value}>{`Year ${value}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label className="label">Default semester</label>
                    <select
                      className="input"
                      value={createForm.defaultSemesterNo}
                      onChange={(event) => setCreateForm((current) => ({ ...current, defaultSemesterNo: Number(event.target.value) }))}
                    >
                      {semesterOptionsForYear(createForm.yearOfStudy).map((value) => (
                        <option key={value} value={value}>{`Semester ${value}`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="checkboxRow">
                  <input
                    type="checkbox"
                    checked={createForm.isElective}
                    onChange={(event) => setCreateForm((current) => ({ ...current, isElective: event.target.checked }))}
                  />
                  <span>Elective course</span>
                </label>

                <div className="field">
                  <label className="label">Description</label>
                  <textarea
                    className="input textarea"
                    value={createForm.description}
                    onChange={(event) => setCreateForm((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Short catalog description and academic intent."
                  />
                </div>

                <button className="btn btnPrimary" type="submit" disabled={savingCreate}>
                  {savingCreate ? "Creating..." : "Create course"}
                </button>
              </form>
            </div>
          </article>

          <article className="surfaceCard">
            <div className="sectionHeader">
              <h3>{editForm ? "Edit course" : "Catalog notes"}</h3>
            </div>
            <div className="sectionBody">
              {editForm ? (
                <div className="stackLg">
                  <div className="gridTwo">
                    <div className="field">
                      <label className="label">Code</label>
                      <input
                        className="input"
                        value={editForm.code}
                        onChange={(event) => setEditForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
                      />
                    </div>
                    <div className="field">
                      <label className="label">Credits</label>
                      <input
                        className="input"
                        type="number"
                        min="1"
                        value={editForm.credits}
                        onChange={(event) => setEditForm((current) => ({ ...current, credits: Number(event.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label">Name</label>
                    <input
                      className="input"
                      value={editForm.name}
                      onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))}
                    />
                  </div>

                  <div className="gridTwo">
                    <div className="field">
                      <label className="label">Year of study</label>
                      <select
                        className="input"
                        value={editForm.yearOfStudy}
                        onChange={(event) => setEditForm((current) => ({
                          ...current,
                          yearOfStudy: Number(event.target.value),
                          defaultSemesterNo: semesterOptionsForYear(Number(event.target.value))[0],
                        }))}
                      >
                        {[1, 2, 3].map((value) => (
                          <option key={value} value={value}>{`Year ${value}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label">Default semester</label>
                      <select
                        className="input"
                        value={editForm.defaultSemesterNo}
                        onChange={(event) => setEditForm((current) => ({ ...current, defaultSemesterNo: Number(event.target.value) }))}
                      >
                        {semesterOptionsForYear(editForm.yearOfStudy).map((value) => (
                          <option key={value} value={value}>{`Semester ${value}`}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="checkboxRow">
                    <input
                      type="checkbox"
                      checked={editForm.isElective}
                      onChange={(event) => setEditForm((current) => ({ ...current, isElective: event.target.checked }))}
                    />
                    <span>Elective course</span>
                  </label>

                  <label className="checkboxRow">
                    <input
                      type="checkbox"
                      checked={editForm.isActive}
                      onChange={(event) => setEditForm((current) => ({ ...current, isActive: event.target.checked }))}
                    />
                    <span>Course active in catalog</span>
                  </label>

                  <div className="field">
                    <label className="label">Description</label>
                    <textarea
                      className="input textarea"
                      value={editForm.description}
                      onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </div>

                  <div className="row rowStart rowWrap">
                    <button className="btn btnPrimary" type="button" onClick={handleSaveEdit} disabled={savingEdit}>
                      {savingEdit ? "Saving..." : "Save changes"}
                    </button>
                    <button className="btn" type="button" onClick={() => { setEditId(""); setEditForm(null); }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bulletStack">
                  <div className="listRow">
                    <span className="listDot" />
                    <span>Courses are reusable catalog records. They should stay stable even when offerings change across terms.</span>
                  </div>
                  <div className="listRow">
                    <span className="listDot" />
                    <span>Use deactivation instead of deleting courses so exam history and carry-over data remain intact.</span>
                  </div>
                  <div className="listRow">
                    <span className="listDot" />
                    <span>Each course keeps a default year and semester mapping, while offerings remain the real delivery unit for a specific term.</span>
                  </div>
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="surfaceCard">
          <div className="sectionHeader">
            <h3>Catalog directory</h3>
          </div>
          <div className="sectionBody stackLg">
            <div className="filtersRow filtersRowWide">
              <input
                className="input"
                placeholder="Search by course code or name"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              />
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
              <select
                className="input"
                value={filters.status}
                onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {loadingCourses ? (
              <div className="pageStateCard">Loading course catalog...</div>
            ) : filteredCourses.length === 0 ? (
              <div className="emptyState">No courses match the current filters.</div>
            ) : (
              <div className="tableWrap">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Year</th>
                      <th>Semester</th>
                      <th>Credits</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.code}</td>
                        <td>
                          <div className="cellTitle">{course.name}</div>
                          <div className="cellMeta">{course.description || "No description provided."}</div>
                        </td>
                        <td>{course.yearOfStudy}</td>
                        <td>{course.defaultSemesterNo}</td>
                        <td>{course.credits}</td>
                        <td>{course.isElective ? "Elective" : "Core"}</td>
                        <td>
                          <span className={`statusPill ${course.isActive ? "statusLive" : "statusDraft"}`}>
                            {course.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="row rowStart rowWrap">
                            <button className="btn" type="button" onClick={() => startEdit(course)}>Edit</button>
                            {course.isActive ? (
                              <button className="btn" type="button" onClick={() => handleDeactivate(course.id)}>
                                Deactivate
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function semesterOptionsForYear(yearOfStudy) {
  return yearOfStudy === 1 ? [1, 2] : yearOfStudy === 2 ? [3, 4] : [5, 6];
}

function readError(error, fallback) {
  return error?.response?.data?.message || fallback;
}
