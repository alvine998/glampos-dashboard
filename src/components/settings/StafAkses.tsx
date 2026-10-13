"use client";

import { useEffect, useMemo, useState } from "react";
import { Ellipsis, Pencil, Plus, Search, Shield, Trash2, User, X } from "lucide-react";
import toast from "react-hot-toast";

type RoleId = string;
type PermissionAction = "lihat" | "buat" | "ubah" | "hapus";
type UserStatus = "active" | "inactive";

interface RoleDefinition {
  id: string;
  label: string;
  color: string;
  textColor: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: RoleId;
  status: UserStatus;
}

interface ModulePermission {
  module: string;
  actions: Record<PermissionAction, boolean>;
}

const STORAGE_KEY = "glampos-staff-access";
// Warna teks badge bawaan dipilih per role agar kontras memenuhi WCAG AA (≥4.5:1).
// Hanya Finance (emas terang) yang memakai teks gelap; sisanya teks putih.
const BUILT_IN_ROLES: RoleDefinition[] = [
  { id: "owner", label: "Owner", color: "#65765d", textColor: "#ffffff" },
  { id: "front-office", label: "Front Office", color: "#087565", textColor: "#ffffff" },
  { id: "finance", label: "Finance", color: "#c59d5f", textColor: "#2a2417" },
  { id: "super-admin", label: "Super Admin", color: "#59624f", textColor: "#ffffff" },
  { id: "housekeeping", label: "Housekeeping", color: "#9e563d", textColor: "#ffffff" },
  { id: "maintenance", label: "Maintenance", color: "#5a6e70", textColor: "#ffffff" },
];
const BUILT_IN_ROLE_IDS = new Set(BUILT_IN_ROLES.map((role) => role.id));
// Palet earth-tone untuk role kustom — semuanya lolos kontras ≥4.5:1 dengan teks putih.
const ROLE_COLOR_SUGGESTIONS = ["#7a5c4f", "#476b4f", "#8a6d3b", "#4f6b6b", "#94552f", "#5f6e46"];
const ROLE_DARK_TEXT = "#2a2417";
const ROLE_LIGHT_TEXT = "#ffffff";
const FALLBACK_ROLE_COLOR = "#6b7280";
const MODULES = [
  "Dashboard",
  "Kalender",
  "Booking",
  "Unit & Properti",
  "Rate & Harga",
  "Keuangan",
  "Laporan",
  "Pengaturan",
  "Dokumentasi",
];
const ACTIONS: PermissionAction[] = ["lihat", "buat", "ubah", "hapus"];
const DEFAULT_STAFF: StaffMember[] = [
  { id: "s1", name: "Lucy Andriani", email: "lucy@niskalaretreat.co.id", role: "owner", status: "active" },
  { id: "s2", name: "Rina Wulandari", email: "rina@niskalaretreat.co.id", role: "front-office", status: "active" },
  { id: "s3", name: "Adi Nugroho", email: "adi@niskalaretreat.co.id", role: "housekeeping", status: "active" },
  { id: "s4", name: "Putri Sari", email: "putri@niskalaretreat.co.id", role: "finance", status: "active" },
  { id: "s5", name: "Budi Santoso", email: "budi@niskalaretreat.co.id", role: "maintenance", status: "inactive" },
];

function hexLuminance(hex: string): number {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return 0;
  const channels = [0, 2, 4].map((offset) => parseInt(normalized.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(background: string, foreground: string): number {
  const lighter = Math.max(hexLuminance(background), hexLuminance(foreground));
  const darker = Math.min(hexLuminance(background), hexLuminance(foreground));
  return (lighter + 0.05) / (darker + 0.05);
}

// Pilih warna teks badge (putih atau tinta gelap) dengan kontras terbaik untuk background.
function pickRoleTextColor(background: string): string {
  return contrastRatio(background, ROLE_LIGHT_TEXT) >= contrastRatio(background, ROLE_DARK_TEXT)
    ? ROLE_LIGHT_TEXT
    : ROLE_DARK_TEXT;
}

function slugifyRoleId(label: string): string {
  const slug = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || `role-${Date.now()}`;
}

function isValidHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);
}

function defaultPermissionsForRole(roleId: string): ModulePermission[] {
  const roleModules: Record<string, string[]> = {
    owner: MODULES,
    "front-office": ["Dashboard", "Kalender", "Booking", "Laporan", "Dokumentasi"],
    finance: ["Dashboard", "Keuangan", "Laporan", "Dokumentasi"],
    "super-admin": MODULES,
    housekeeping: ["Dashboard", "Kalender", "Unit & Properti", "Dokumentasi"],
    maintenance: ["Dashboard", "Kalender", "Unit & Properti", "Dokumentasi"],
  };
  // Role kustom mulai tanpa akses; admin mengaturnya lewat matriks hak akses.
  const modules = roleModules[roleId] ?? [];
  const elevated = roleId === "owner" || roleId === "super-admin";

  return MODULES.map((module) => {
    const canAccess = modules.includes(module);
    return {
      module,
      actions: {
        lihat: canAccess,
        buat: elevated || (roleId === "front-office" && module === "Booking"),
        ubah: elevated || (roleId === "front-office" && module === "Booking"),
        hapus: elevated,
      },
    };
  });
}

function makePermissions(roles: RoleDefinition[]): Record<RoleId, ModulePermission[]> {
  return Object.fromEntries(
    roles.map((role) => [role.id, defaultPermissionsForRole(role.id)]),
  ) as Record<RoleId, ModulePermission[]>;
}

interface StaffAccessData {
  staff: StaffMember[];
  permissions: Record<RoleId, ModulePermission[]>;
  customRoles: RoleDefinition[];
}

function defaultAccessData(): StaffAccessData {
  return { staff: DEFAULT_STAFF, permissions: makePermissions(BUILT_IN_ROLES), customRoles: [] };
}

function sanitizeCustomRoles(value: unknown): RoleDefinition[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const roles: RoleDefinition[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) continue;
    const candidate = entry as Partial<RoleDefinition>;
    if (typeof candidate.id !== "string" || typeof candidate.label !== "string") continue;
    const id = candidate.id.trim();
    const label = candidate.label.trim();
    if (!id || !label || BUILT_IN_ROLE_IDS.has(id) || seen.has(id)) continue;
    seen.add(id);
    roles.push({
      id,
      label,
      color: isValidHexColor(candidate.color) ? candidate.color : FALLBACK_ROLE_COLOR,
      textColor: candidate.textColor === ROLE_LIGHT_TEXT || candidate.textColor === ROLE_DARK_TEXT
        ? candidate.textColor
        : pickRoleTextColor(isValidHexColor(candidate.color) ? candidate.color : FALLBACK_ROLE_COLOR),
    });
  }
  return roles;
}

function readSavedData(): StaffAccessData {
  const defaults = defaultAccessData();
  if (typeof window === "undefined") return defaults;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved) as Partial<StaffAccessData>;
    const customRoles = sanitizeCustomRoles(parsed.customRoles);
    const roles = [...BUILT_IN_ROLES, ...customRoles];
    const defaultsByRole = makePermissions(roles);
    const permissions: Record<RoleId, ModulePermission[]> = { ...defaultsByRole };
    const savedPermissions = parsed.permissions;
    if (savedPermissions) {
      roles.forEach((role) => {
        const savedRolePermissions = savedPermissions[role.id];
        if (!savedRolePermissions) return;
        permissions[role.id] = defaultsByRole[role.id].map((defaultPermission) => {
          const savedPermission = savedRolePermissions.find((permission) => permission.module === defaultPermission.module);
          return savedPermission
            ? { ...defaultPermission, actions: { ...defaultPermission.actions, ...savedPermission.actions } }
            : defaultPermission;
        });
      });
    }
    return {
      staff: Array.isArray(parsed.staff) ? parsed.staff : defaults.staff,
      permissions,
      customRoles,
    };
  } catch {
    return defaults;
  }
}

export default function StafAkses() {
  const [data, setData] = useState<StaffAccessData>(defaultAccessData);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleId>("front-office");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffMember | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<RoleId>("front-office");
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [roleName, setRoleName] = useState("");
  const [roleColor, setRoleColor] = useState(ROLE_COLOR_SUGGESTIONS[0]);

  useEffect(() => {
    setData(readSavedData());
  }, []);

  const roles = useMemo(() => [...BUILT_IN_ROLES, ...data.customRoles], [data.customRoles]);
  const roleById = useMemo(() => new Map(roles.map((role) => [role.id, role])), [roles]);
  const roleLabel = (roleId: RoleId) => roleById.get(roleId)?.label ?? roleId;
  const selectedRoleDef = roleById.get(selectedRole);
  const isSelectedRoleCustom = selectedRoleDef !== undefined && !BUILT_IN_ROLE_IDS.has(selectedRoleDef.id);
  const selectedPermissions = data.permissions[selectedRole] ?? [];

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data.staff;
    return data.staff.filter((member) =>
      [member.name, member.email, roleById.get(member.role)?.label ?? member.role]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [data.staff, roleById, search]);

  const persist = (next: typeof data) => {
    setData(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("glampos-access-updated"));
    } catch {
      toast.error("Perubahan belum dapat disimpan di perangkat ini.");
    }
  };

  const openCreateForm = () => {
    setEditingUser(null);
    setUserName("");
    setUserEmail("");
    setUserRole("front-office");
    setShowUserForm(true);
  };

  const openEditForm = (member: StaffMember) => {
    setEditingUser(member);
    setUserName(member.name);
    setUserEmail(member.email);
    setUserRole(member.role);
    setShowUserForm(true);
  };

  const saveUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const duplicate = data.staff.some((member) =>
      member.email.toLowerCase() === userEmail.trim().toLowerCase() && member.id !== editingUser?.id,
    );
    if (duplicate) {
      toast.error("Email sudah digunakan oleh pengguna lain.");
      return;
    }

    const member: StaffMember = {
      id: editingUser?.id ?? `staff-${Date.now()}`,
      name: userName.trim(),
      email: userEmail.trim(),
      role: userRole,
      status: editingUser?.status ?? "active",
    };
    const staff = editingUser
      ? data.staff.map((item) => item.id === editingUser.id ? member : item)
      : [...data.staff, member];
    persist({ ...data, staff });
    setShowUserForm(false);
    toast.success(editingUser ? "Pengguna berhasil diperbarui." : "Pengguna berhasil ditambahkan.");
  };

  const updatePermission = (module: string, action: PermissionAction, checked: boolean) => {
    const current = data.permissions[selectedRole] ?? [];
    const permissions = {
      ...data.permissions,
      [selectedRole]: current.map((entry) => ({
          ...entry,
          actions: entry.module !== module
            ? entry.actions
            : action === "lihat" && !checked
              ? { lihat: false, buat: false, ubah: false, hapus: false }
              : action === "lihat"
                ? { ...entry.actions, lihat: true }
                : { ...entry.actions, lihat: true, [action]: checked },
        })),
    };
    persist({ ...data, permissions });
  };

  const toggleUserStatus = (member: StaffMember) => {
    const status: UserStatus = member.status === "active" ? "inactive" : "active";
    persist({
      ...data,
      staff: data.staff.map((item) => item.id === member.id ? { ...item, status } : item),
    });
    toast.success(`Pengguna ${status === "active" ? "diaktifkan" : "dinonaktifkan"}.`);
  };

  const removeUser = (member: StaffMember) => {
    if (!window.confirm(`Hapus akses ${member.name}?`)) return;
    persist({ ...data, staff: data.staff.filter((item) => item.id !== member.id) });
    toast.success("Pengguna berhasil dihapus.");
  };

  const openCreateRoleForm = () => {
    const usedColors = new Set([...BUILT_IN_ROLES, ...data.customRoles].map((role) => role.color));
    setEditingRole(null);
    setRoleName("");
    setRoleColor(ROLE_COLOR_SUGGESTIONS.find((color) => !usedColors.has(color)) ?? ROLE_COLOR_SUGGESTIONS[0]);
    setShowRoleForm(true);
  };

  const openEditRoleForm = (role: RoleDefinition) => {
    setEditingRole(role);
    setRoleName(role.label);
    setRoleColor(role.color);
    setShowRoleForm(true);
  };

  const saveRole = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = roleName.trim();
    if (!label) return;
    const duplicate = roles.some((role) =>
      role.label.toLowerCase() === label.toLowerCase() && role.id !== editingRole?.id,
    );
    if (duplicate) {
      toast.error("Nama role sudah digunakan.");
      return;
    }
    if (!isValidHexColor(roleColor)) {
      toast.error("Pilih warna badge yang valid.");
      return;
    }

    if (editingRole) {
      // Role bawaan tidak dapat diubah; jalur ini hanya untuk role kustom.
      if (BUILT_IN_ROLE_IDS.has(editingRole.id)) {
        setShowRoleForm(false);
        return;
      }
      const updated: RoleDefinition = {
        ...editingRole,
        label,
        color: roleColor,
        textColor: pickRoleTextColor(roleColor),
      };
      persist({
        ...data,
        customRoles: data.customRoles.map((item) => item.id === updated.id ? updated : item),
      });
      setShowRoleForm(false);
      toast.success(`Role "${label}" berhasil diperbarui.`);
      return;
    }

    const taken = new Set(roles.map((role) => role.id));
    const base = slugifyRoleId(label);
    let id = base;
    let counter = 2;
    while (taken.has(id)) id = `${base}-${counter++}`;

    const role: RoleDefinition = { id, label, color: roleColor, textColor: pickRoleTextColor(roleColor) };
    persist({
      ...data,
      customRoles: [...data.customRoles, role],
      permissions: { ...data.permissions, [id]: defaultPermissionsForRole(id) },
    });
    setSelectedRole(id);
    setShowRoleForm(false);
    toast.success(`Role "${label}" berhasil ditambahkan. Atur hak aksesnya di bawah.`);
  };

  const removeRole = (roleId: RoleId) => {
    const role = roleById.get(roleId);
    if (!role || BUILT_IN_ROLE_IDS.has(roleId)) return;
    const inUse = data.staff.filter((member) => member.role === roleId).length;
    if (inUse > 0) {
      toast.error(`Role "${role.label}" masih dipakai ${inUse} pengguna. Pindahkan dulu ke role lain.`);
      return;
    }
    if (!window.confirm(`Hapus role "${role.label}"?`)) return;
    const permissions = { ...data.permissions };
    delete permissions[roleId];
    persist({
      ...data,
      customRoles: data.customRoles.filter((item) => item.id !== roleId),
      permissions,
    });
    if (selectedRole === roleId) setSelectedRole("front-office");
    toast.success(`Role "${role.label}" berhasil dihapus.`);
  };

  return (
    <>
      <div className="settings-section">
        <div className="section-title">
          <div>
            <span className="card-kicker">MANAJEMEN PENGGUNA</span>
            <h2>Pengguna</h2>
          </div>
          <button className="primary-button" type="button" onClick={openCreateForm}>
            <Plus size={16} />
            Tambah pengguna
          </button>
        </div>

        <div className="staff-search">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama, email, atau role..."
            aria-label="Cari pengguna"
          />
        </div>

        <div className="staff-list">
          {filteredStaff.map((member) => (
            <div className="staff-row" key={member.id}>
              <div className="guest-avatar"><User size={14} /></div>
              <div className="staff-identity">
                <strong>{member.name}</strong>
                <span>{member.email}</span>
              </div>
              <span
                className="staff-role"
                style={{
                  background: roleById.get(member.role)?.color ?? FALLBACK_ROLE_COLOR,
                  color: roleById.get(member.role)?.textColor ?? ROLE_LIGHT_TEXT,
                }}
              >
                {roleLabel(member.role)}
              </span>
              <span className={`staff-status ${member.status}`}>
                {member.status === "active" ? "Aktif" : "Nonaktif"}
              </span>
              <details className="staff-actions">
                <summary className="row-more" aria-label={`Aksi untuk ${member.name}`}><Ellipsis size={18} /></summary>
                <div className="staff-action-menu">
                  <button type="button" onClick={() => openEditForm(member)}>Ubah pengguna</button>
                  <button type="button" onClick={() => toggleUserStatus(member)}>
                    {member.status === "active" ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button type="button" className="danger" onClick={() => removeUser(member)}>
                    <Trash2 size={14} /> Hapus pengguna
                  </button>
                </div>
              </details>
            </div>
          ))}
          {filteredStaff.length === 0 && <p className="staff-empty">Pengguna tidak ditemukan.</p>}
        </div>
      </div>

      <div className="settings-section">
        <div className="section-title permission-title">
          <div>
            <span className="card-kicker">ROLE-BASED ACCESS CONTROL</span>
            <h2>Role & hak akses</h2>
            <p>Atur izin lihat, buat, ubah, dan hapus untuk setiap modul.</p>
          </div>
          <div className="role-title-actions">
            <button className="secondary-button" type="button" onClick={openCreateRoleForm}>
              <Plus size={16} />
              Tambah role
            </button>
            <Shield size={21} />
          </div>
        </div>

        <div className="role-selector" aria-label="Pilih role untuk mengatur hak akses">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              className={selectedRole === role.id ? "active" : ""}
              onClick={() => setSelectedRole(role.id)}
            >
              <span className="role-dot" style={{ background: role.color }} aria-hidden="true" />
              {role.label}
            </button>
          ))}
        </div>
        {isSelectedRoleCustom && selectedRoleDef && (
          <div className="custom-role-bar">
            <span>Role kustom buatan Anda</span>
            <div className="custom-role-actions">
              <button type="button" className="custom-role-edit" onClick={() => openEditRoleForm(selectedRoleDef)}>
                <Pencil size={14} /> Ubah
              </button>
              <button type="button" className="custom-role-delete" onClick={() => removeRole(selectedRoleDef.id)}>
                <Trash2 size={14} /> Hapus role
              </button>
            </div>
          </div>
        )}

        <div className="permission-matrix-scroll">
          <div className="permission-grid permission-matrix">
            <div className="permission-header">
              <span>Modul</span>
              {ACTIONS.map((action) => <span key={action}>{action}</span>)}
            </div>
            {selectedPermissions.map((entry) => (
              <div className="permission-row" key={entry.module}>
                <span>{entry.module}</span>
                {ACTIONS.map((action) => (
                  <label className="permission-toggle" key={action} aria-label={`${roleLabel(selectedRole)}: ${action} ${entry.module}`}>
                    <input
                      type="checkbox"
                      checked={entry.actions[action]}
                      onChange={(event) => updatePermission(entry.module, action, event.target.checked)}
                    />
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="permission-note">Hak akses disimpan pada browser ini dan berlaku saat role digunakan dalam preview.</p>
      </div>

      {showUserForm && (
        <div className="modal-layer" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowUserForm(false);
        }}>
          <div className="user-modal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title">
            <div className="modal-head">
              <div>
                <span className="card-kicker">MANAJEMEN PENGGUNA</span>
                <h2 id="user-modal-title">{editingUser ? "Ubah pengguna" : "Tambah pengguna"}</h2>
                <p>Lengkapi identitas dan role akses pengguna.</p>
              </div>
              <button type="button" aria-label="Tutup" onClick={() => setShowUserForm(false)}><X size={17} /></button>
            </div>
            <form className="user-form" onSubmit={saveUser}>
              <label>
                Nama lengkap
                <input required value={userName} onChange={(event) => setUserName(event.target.value)} placeholder="Nama pengguna" />
              </label>
              <label>
                Email
                <input required type="email" value={userEmail} onChange={(event) => setUserEmail(event.target.value)} placeholder="nama@properti.co.id" />
              </label>
              <label>
                Role
                <select value={userRole} onChange={(event) => setUserRole(event.target.value)}>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
              </label>
              <div className="user-form-actions">
                <button className="secondary-button" type="button" onClick={() => setShowUserForm(false)}>Batal</button>
                <button className="primary-button" type="submit">Simpan pengguna</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRoleForm && (
        <div className="modal-layer" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowRoleForm(false);
        }}>
          <div className="user-modal" role="dialog" aria-modal="true" aria-labelledby="role-modal-title">
            <div className="modal-head">
              <div>
                <span className="card-kicker">ROLE-BASED ACCESS CONTROL</span>
                <h2 id="role-modal-title">{editingRole ? "Ubah role" : "Tambah role"}</h2>
                <p>{editingRole
                  ? "Ubah nama dan warna badge role kustom ini."
                  : "Role baru mulai tanpa akses; atur izinnya lewat matriks hak akses."}</p>
              </div>
              <button type="button" aria-label="Tutup" onClick={() => setShowRoleForm(false)}><X size={17} /></button>
            </div>
            <form className="user-form" onSubmit={saveRole}>
              <label>
                Nama role
                <input
                  required
                  maxLength={30}
                  value={roleName}
                  onChange={(event) => setRoleName(event.target.value)}
                  placeholder="cth. Marketing"
                />
              </label>
              <div className="role-color-field">
                <span className="role-color-label">Warna badge</span>
                <div className="role-swatches">
                  {ROLE_COLOR_SUGGESTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={roleColor === color ? "role-swatch active" : "role-swatch"}
                      style={{ background: color }}
                      aria-label={`Warna ${color}`}
                      aria-pressed={roleColor === color}
                      onClick={() => setRoleColor(color)}
                    />
                  ))}
                  <input
                    type="color"
                    className="role-color-picker"
                    value={isValidHexColor(roleColor) ? roleColor : "#7a5c4f"}
                    onChange={(event) => setRoleColor(event.target.value)}
                    aria-label="Warna badge kustom"
                    title="Warna badge kustom"
                  />
                </div>
                <span
                  className="staff-role role-preview"
                  style={{
                    background: isValidHexColor(roleColor) ? roleColor : FALLBACK_ROLE_COLOR,
                    color: pickRoleTextColor(isValidHexColor(roleColor) ? roleColor : FALLBACK_ROLE_COLOR),
                  }}
                >
                  {roleName.trim() || "Pratinjau role"}
                </span>
              </div>
              <div className="user-form-actions">
                <button className="secondary-button" type="button" onClick={() => setShowRoleForm(false)}>Batal</button>
                <button className="primary-button" type="submit">Simpan role</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
