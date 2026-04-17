import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  createUser,
  importUsers,
  listUsers,
  resetUserPassword,
  updateUser,
  updateUserStatus,
} from "../../lib/usersApi";

const ROLE_OPTIONS = ["Student", "Professor", "Assistant"];
const CSV_TEMPLATE = `FullName,Email,Role,IsActive,Password
Alice Student,alice@student.edu,Student,true,
Bob Professor,bob@university.edu,Professor,true,Welcome123
Sara Assistant,sara@university.edu,Assistant,true,`;

const initialCreateForm = {
  fullName: "",
  email: "",
  role: "Student",
  password: "",
  isActive: true,
};

export default function AdminUsersPage() {
  const { user, loading: userLoading, error: userError } = useCurrentUser();
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ search: "", role: "", status: "all" });
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [pageError, setPageError] = useState("");
  const [pageSuccess, setPageSuccess] = useState("");
  const [createForm, setCreateForm] = useState(initialCreateForm);
  const [creating, setCreating] = useState(false);
  const [importText, setImportText] = useState(CSV_TEMPLATE);
  const [defaultPassword, setDefaultPassword] = useState("Welcome123");
  const [generatePasswords, setGeneratePasswords] = useState(false);
  const [importPreview, setImportPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", role: "Student", isActive: true });
  const [passwordDrafts, setPasswordDrafts] = useState({});

  const queryFilters = useMemo(() => {
    const statusFilter = filters.status === "all" ? {} : { isActive: filters.status === "active" };
    return {
      search: filters.search || undefined,
      role: filters.role || undefined,
      ...statusFilter,
    };
  }, [filters]);

  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      setPageError("");
      const data = await listUsers(queryFilters);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(readError(error, "Failed to load users."));
    } finally {
      setLoadingUsers(false);
    }
  }, [queryFilters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleCreateUser(e) {
    e.preventDefault();
    try {
      setCreating(true);
      setPageError("");
      setPageSuccess("");
      await createUser(createForm);
      setCreateForm(initialCreateForm);
      setPageSuccess("User created successfully.");
      await loadUsers();
    } catch (error) {
      setPageError(readError(error, "Failed to create user."));
    } finally {
      setCreating(false);
    }
  }

  function handlePreviewImport() {
    const { rows, errors } = parseCsvRows(importText);
    setImportPreview(rows.map((row) => ({ ...row, error: errors[row.__line] || "" })));
    setImportResult(null);
    setPageError(Object.keys(errors).length > 0 ? "Some CSV rows need attention before import." : "");
  }

  async function handleImportUsers() {
    try {
      const { rows, errors } = parseCsvRows(importText);
      setImportPreview(rows.map((row) => ({ ...row, error: errors[row.__line] || "" })));
      if (Object.keys(errors).length > 0) {
        setPageError("Fix CSV validation issues before importing.");
        return;
      }

      setImporting(true);
      setPageError("");
      setPageSuccess("");

      const payload = {
        defaultPassword: defaultPassword || null,
        generatePasswords,
        users: rows.map((row) => {
          const payloadRow = { ...row };
          delete payloadRow.__line;
          return payloadRow;
        }),
      };

      const result = await importUsers(payload);
      setImportResult(result);
      setPageSuccess(`Import completed. ${result.imported} users added.`);
      await loadUsers();
    } catch (error) {
      setPageError(readError(error, "Failed to import users."));
    } finally {
      setImporting(false);
    }
  }

  function beginEdit(account) {
    setEditingId(account.id);
    setEditForm({
      fullName: account.fullName,
      role: account.role,
      isActive: account.isActive,
    });
  }

  async function saveEdit(userId) {
    try {
      setPageError("");
      await updateUser(userId, editForm);
      setEditingId(null);
      setPageSuccess("User updated successfully.");
      await loadUsers();
    } catch (error) {
      setPageError(readError(error, "Failed to update user."));
    }
  }

  async function toggleStatus(account) {
    try {
      setPageError("");
      await updateUserStatus(account.id, !account.isActive);
      setPageSuccess(`User ${account.isActive ? "deactivated" : "activated"} successfully.`);
      await loadUsers();
    } catch (error) {
      setPageError(readError(error, "Failed to update user status."));
    }
  }

  async function handleResetPassword(userId) {
    const newPassword = passwordDrafts[userId];
    if (!newPassword) {
      setPageError("Enter a new password before resetting.");
      return;
    }

    try {
      setPageError("");
      await resetUserPassword(userId, newPassword);
      setPasswordDrafts((current) => ({ ...current, [userId]: "" }));
      setPageSuccess("Password reset successfully.");
    } catch (error) {
      setPageError(readError(error, "Failed to reset password."));
    }
  }

  if (userLoading) {
    return <div className="pageState">Loading administration workspace...</div>;
  }

  if (!user) {
    return <div className="pageState">{userError || "Unable to load user profile."}</div>;
  }

  return (
    <AppShell
      user={user}
      badge="Administration"
      title="User management"
      subtitle="Provision students, professors, and assistants with an interface designed for real departmental operations."
      actions={<Link className="btn" to="/dashboard">Back to overview</Link>}
    >
      <div className="stackXl">
        {pageError ? <div className="alert">{pageError}</div> : null}
        {pageSuccess ? <div className="successBanner">{pageSuccess}</div> : null}

        <section className="dashboardGrid dashboardGridWide">
          <article className="surfaceCard">
            <div className="sectionHeader"><h3>Create user</h3></div>
            <div className="sectionBody">
              <form className="stackLg" onSubmit={handleCreateUser}>
                <div className="field">
                  <label className="label">Full name</label>
                  <input className="input" value={createForm.fullName} onChange={(e) => setCreateForm((c) => ({ ...c, fullName: e.target.value }))} required />
                </div>
                <div className="field">
                  <label className="label">Email</label>
                  <input className="input" type="email" value={createForm.email} onChange={(e) => setCreateForm((c) => ({ ...c, email: e.target.value }))} required />
                </div>
                <div className="field">
                  <label className="label">Role</label>
                  <select className="input" value={createForm.role} onChange={(e) => setCreateForm((c) => ({ ...c, role: e.target.value }))}>
                    {ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label className="label">Temporary password</label>
                  <input className="input" value={createForm.password} onChange={(e) => setCreateForm((c) => ({ ...c, password: e.target.value }))} required />
                </div>
                <label className="checkboxRow">
                  <input type="checkbox" checked={createForm.isActive} onChange={(e) => setCreateForm((c) => ({ ...c, isActive: e.target.checked }))} />
                  <span>Active account</span>
                </label>
                <button className="btn btnPrimary" type="submit" disabled={creating}>{creating ? "Creating..." : "Create user"}</button>
              </form>
            </div>
          </article>

          <article className="surfaceCard">
            <div className="sectionHeader"><h3>Bulk import</h3></div>
            <div className="sectionBody stackLg">
              <div className="field">
                <label className="label">Default password</label>
                <input className="input" value={defaultPassword} onChange={(e) => setDefaultPassword(e.target.value)} placeholder="Used when a row password is empty" />
              </div>
              <label className="checkboxRow">
                <input type="checkbox" checked={generatePasswords} onChange={(e) => setGeneratePasswords(e.target.checked)} />
                <span>Generate passwords when none are provided</span>
              </label>
              <div className="field">
                <label className="label">CSV rows</label>
                <textarea className="input textarea" value={importText} onChange={(e) => setImportText(e.target.value)} />
              </div>
              <div className="row" style={{ justifyContent: "flex-start", gap: 10, flexWrap: "wrap" }}>
                <button className="btn" type="button" onClick={handlePreviewImport}>Validate file</button>
                <button className="btn btnPrimary" type="button" onClick={handleImportUsers} disabled={importing}>
                  {importing ? "Importing..." : "Import users"}
                </button>
              </div>
            </div>
          </article>
        </section>

        <section className="surfaceCard">
          <div className="sectionHeader"><h3>Import preview</h3></div>
          <div className="sectionBody">
            {importPreview.length === 0 ? (
              <div className="pageStateCard">Validate the CSV content to preview rows before import.</div>
            ) : (
              <div className="tableWrap">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Line</th>
                      <th>Full name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Validation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.map((row) => (
                      <tr key={`${row.email}-${row.__line}`}>
                        <td>{row.__line}</td>
                        <td>{row.fullName}</td>
                        <td>{row.email}</td>
                        <td>{row.role}</td>
                        <td>{String(row.isActive)}</td>
                        <td>{row.error || "Ready"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {importResult ? (
          <section className="dashboardGrid">
            <article className="surfaceCard">
              <div className="sectionHeader"><h3>Import summary</h3></div>
              <div className="sectionBody">
                <div className="summaryStrip">
                  <article className="summaryCard"><span className="summaryLabel">Requested</span><strong>{importResult.requested}</strong></article>
                  <article className="summaryCard"><span className="summaryLabel">Imported</span><strong>{importResult.imported}</strong></article>
                  <article className="summaryCard"><span className="summaryLabel">Failed</span><strong>{importResult.failed}</strong></article>
                </div>
              </div>
            </article>

            {importResult.users?.length > 0 ? (
              <article className="surfaceCard">
                <div className="sectionHeader"><h3>Imported accounts</h3></div>
                <div className="sectionBody">
                  <div className="tableWrap">
                    <table className="dataTable">
                      <thead>
                        <tr>
                          <th>Full name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Temporary password</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.users.map((account) => (
                          <tr key={account.id}>
                            <td>{account.fullName}</td>
                            <td>{account.email}</td>
                            <td>{account.role}</td>
                            <td>{account.temporaryPassword || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            ) : null}

            {importResult.errors?.length > 0 ? (
              <article className="surfaceCard">
                <div className="sectionHeader"><h3>Failed rows</h3></div>
                <div className="sectionBody">
                  <div className="tableWrap">
                    <table className="dataTable">
                      <thead>
                        <tr>
                          <th>Email</th>
                          <th>Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {importResult.errors.map((item, index) => (
                          <tr key={`${item.email}-${index}`}>
                            <td>{item.email}</td>
                            <td>{item.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            ) : null}
          </section>
        ) : null}

        <section className="surfaceCard">
          <div className="sectionHeader"><h3>User directory</h3></div>
          <div className="sectionBody stackLg">
            <div className="filtersRow">
              <input className="input" placeholder="Search by full name or email" value={filters.search} onChange={(e) => setFilters((c) => ({ ...c, search: e.target.value }))} />
              <select className="input" value={filters.role} onChange={(e) => setFilters((c) => ({ ...c, role: e.target.value }))}>
                <option value="">All roles</option>
                {ROLE_OPTIONS.map((role) => <option key={role} value={role}>{role}</option>)}
                <option value="Admin">Admin</option>
              </select>
              <select className="input" value={filters.status} onChange={(e) => setFilters((c) => ({ ...c, status: e.target.value }))}>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {loadingUsers ? (
              <div className="pageStateCard">Loading user records...</div>
            ) : (
              <div className="tableWrap">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Full name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((account) => {
                      const isEditing = editingId === account.id;
                      return (
                        <tr key={account.id}>
                          <td>{isEditing ? <input className="input" value={editForm.fullName} onChange={(e) => setEditForm((c) => ({ ...c, fullName: e.target.value }))} /> : account.fullName}</td>
                          <td>{account.email}</td>
                          <td>{isEditing ? (
                            <select className="input" value={editForm.role} onChange={(e) => setEditForm((c) => ({ ...c, role: e.target.value }))}>
                              {[...ROLE_OPTIONS, "Admin"].map((role) => <option key={role} value={role}>{role}</option>)}
                            </select>
                          ) : account.role}</td>
                          <td><span className={`statusPill ${account.isActive ? "statusLive" : "statusDraft"}`}>{account.isActive ? "Active" : "Inactive"}</span></td>
                          <td>{new Date(account.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="actionsCol">
                              {isEditing ? (
                                <>
                                  <label className="checkboxRow">
                                    <input type="checkbox" checked={editForm.isActive} onChange={(e) => setEditForm((c) => ({ ...c, isActive: e.target.checked }))} />
                                    <span>Active</span>
                                  </label>
                                  <div className="row" style={{ gap: 8, justifyContent: "flex-start" }}>
                                    <button className="btn btnPrimary" type="button" onClick={() => saveEdit(account.id)}>Save</button>
                                    <button className="btn" type="button" onClick={() => setEditingId(null)}>Cancel</button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="row" style={{ gap: 8, flexWrap: "wrap", justifyContent: "flex-start" }}>
                                    <button className="btn" type="button" onClick={() => beginEdit(account)}>Edit</button>
                                    <button className="btn" type="button" onClick={() => toggleStatus(account)}>
                                      {account.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                  </div>
                                  <div className="row" style={{ gap: 8, justifyContent: "flex-start" }}>
                                    <input className="input" placeholder="New password" value={passwordDrafts[account.id] || ""} onChange={(e) => setPasswordDrafts((c) => ({ ...c, [account.id]: e.target.value }))} />
                                    <button className="btn" type="button" onClick={() => handleResetPassword(account.id)}>Reset</button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

function parseCsvRows(rawText) {
  const lines = rawText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length <= 1) {
    return { rows: [], errors: {} };
  }

  const rows = [];
  const errors = {};
  const seenEmails = new Set();

  for (let index = 1; index < lines.length; index += 1) {
    const parts = lines[index].split(",").map((part) => part.trim());
    const [fullName = "", email = "", role = "", isActive = "true", password = ""] = parts;
    const key = email.toLowerCase();
    const lineNumber = index + 1;
    let error = "";

    if (!fullName || !email || !role) {
      error = "FullName, Email, and Role are required.";
    } else if (!ROLE_OPTIONS.includes(role) && role !== "Admin") {
      error = "Role must be Student, Professor, Assistant, or Admin.";
    } else if (seenEmails.has(key)) {
      error = "Duplicate email in CSV.";
    } else if (password && !isStrongPassword(password)) {
      error = "Password must be at least 8 characters and include upper, lower, and number.";
    }

    seenEmails.add(key);

    if (error) {
      errors[lineNumber] = error;
    }

    rows.push({
      __line: lineNumber,
      fullName,
      email,
      role,
      isActive: isActive.toLowerCase() !== "false",
      password,
    });
  }

  return { rows, errors };
}

function isStrongPassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

function readError(error, fallback) {
  return error?.response?.data?.message || fallback;
}
