"use client";

import { useEffect, useMemo, useState } from "react";
import { Ellipsis, Plus, Search, Shield, Trash2, User, X } from "lucide-react";
import toast from "react-hot-toast";

type RoleId = "owner" | "front-office" | "finance" | "super-admin" | "housekeeping" | "maintenance";
type PermissionAction = "lihat" | "buat" | "ubah" | "hapus";
type UserStatus = "active" | "inactive";

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
const ROLE_LABELS: Record<RoleId, string> = {
  owner: "Owner",
  "front-office": "Front Office",
  finance: "Finance",
  "super-admin": "Super Admin",
  housekeeping: "Housekeeping",
  maintenance: "Maintenance",
};
const ROLE_COLORS: Record<RoleId, string> = {
  owner: "#65765d",
  "front-office": "#087565",
  finance: "#c59d5f",
  "super-admin": "#59624f",
  housekeeping: "#b96f52",
  maintenance: "#77898b",
};
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

function makePermissions(): Record<RoleId, ModulePermission[]> {
  const roleModules: Record<RoleId, string[]> = {
    owner: MODULES,
    "front-office": ["Dashboard", "Kalender", "Booking", "Laporan", "Dokumentasi"],
    finance: ["Dashboard", "Keuangan", "Laporan", "Dokumentasi"],
    "super-admin": MODULES,
    housekeeping: ["Dashboard", "Kalender", "Unit & Properti", "Dokumentasi"],
    maintenance: ["Dashboard", "Kalender", "Unit & Properti", "Dokumentasi"],
  };

  return Object.fromEntries(
    (Object.keys(ROLE_LABELS) as RoleId[]).map((role) => [
      role,
      MODULES.map((module) => {
        const canAccess = roleModules[role].includes(module);
        const elevated = role === "owner" || role === "super-admin";
        const actions = {
          lihat: canAccess,
          buat: elevated || (role === "front-office" && module === "Booking"),
          ubah: elevated || (role === "front-office" && module === "Booking"),
          hapus: elevated,
        };

        return { module, actions };
      }),
    ]),
  ) as Record<RoleId, ModulePermission[]>;
}

function readSavedData(): { staff: StaffMember[]; permissions: Record<RoleId, ModulePermission[]> } {
  const defaults = { staff: DEFAULT_STAFF, permissions: makePermissions() };
  if (typeof window === "undefined") return defaults;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved) as Partial<typeof defaults>;
    const savedPermissions = parsed.permissions;
    const permissions = { ...defaults.permissions };
    if (savedPermissions) {
      (Object.keys(ROLE_LABELS) as RoleId[]).forEach((role) => {
        const savedRolePermissions = savedPermissions[role];
        if (!savedRolePermissions) return;
        permissions[role] = defaults.permissions[role].map((defaultPermission) => {
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
    };
  } catch {
    return defaults;
  }
}

export default function StafAkses() {
  const [data, setData] = useState({ staff: DEFAULT_STAFF, permissions: makePermissions() });
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleId>("front-office");
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffMember | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<RoleId>("front-office");

  useEffect(() => {
    setData(readSavedData());
  }, []);

  const filteredStaff = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data.staff;
    return data.staff.filter((member) =>
      [member.name, member.email, ROLE_LABELS[member.role]]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [data.staff, search]);

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
    const permissions = {
      ...data.permissions,
      [selectedRole]: data.permissions[selectedRole].map((entry) => ({
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
              <span className="staff-role" style={{ background: ROLE_COLORS[member.role] }}>
                {ROLE_LABELS[member.role]}
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
          <Shield size={21} />
        </div>

        <div className="role-selector" aria-label="Pilih role untuk mengatur hak akses">
          {(Object.keys(ROLE_LABELS) as RoleId[]).map((role) => (
            <button
              key={role}
              type="button"
              className={selectedRole === role ? "active" : ""}
              onClick={() => setSelectedRole(role)}
            >
              {ROLE_LABELS[role]}
            </button>
          ))}
        </div>

        <div className="permission-matrix-scroll">
          <div className="permission-grid permission-matrix">
            <div className="permission-header">
              <span>Modul</span>
              {ACTIONS.map((action) => <span key={action}>{action}</span>)}
            </div>
            {data.permissions[selectedRole].map((entry) => (
              <div className="permission-row" key={entry.module}>
                <span>{entry.module}</span>
                {ACTIONS.map((action) => (
                  <label className="permission-toggle" key={action} aria-label={`${ROLE_LABELS[selectedRole]}: ${action} ${entry.module}`}>
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
                <select value={userRole} onChange={(event) => setUserRole(event.target.value as RoleId)}>
                  {(Object.keys(ROLE_LABELS) as RoleId[]).map((role) => (
                    <option key={role} value={role}>{ROLE_LABELS[role]}</option>
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
    </>
  );
}
