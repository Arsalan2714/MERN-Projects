import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsers, deleteUserLocal } from "../store/slices/adminSlice";
import AdminLayout from "../components/AdminLayout";

const UsersPage = () => {
    const dispatch = useDispatch();
    const adminToken = useSelector((s) => s.admin.adminToken);
    const { users, usersMeta } = useSelector((s) => s.admin);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchUsers = async (p = page, q = search) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3001/api/admin/users?page=${p}&limit=15&search=${q}`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });
            const data = await res.json();
            if (res.ok) dispatch(setUsers(data));
        } catch { }
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, [page]);

    const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchUsers(1, search); };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this user? This cannot be undone.")) return;
        setDeleteId(id);
        try {
            await fetch(`http://localhost:3001/api/admin/users/${id}`, {
                method: "DELETE", headers: { Authorization: `Bearer ${adminToken}` },
            });
            dispatch(deleteUserLocal(id));
        } catch { }
        setDeleteId(null);
    };

    return (
        <AdminLayout>
            <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-bold text-white">Users <span className="text-slate-500 text-lg font-normal">({usersMeta.total})</span></h1>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email…" className="px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-56" />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium cursor-pointer transition-colors">Search</button>
                    </form>
                </div>
                <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 bg-slate-800/80">
                                    {["Name", "Email", "Type", "Joined", "Orders", ""].map((h) => (
                                        <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-12 text-slate-500">Loading…</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-12 text-slate-500">No users found.</td></tr>
                                ) : users.map((u) => (
                                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{u.firstName?.[0]?.toUpperCase()}</div>
                                                <span className="text-slate-200 font-medium">{u.firstName} {u.lastName}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-400">{u.email}</td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${u.userType === "seller" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"}`}>{u.userType}</span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                                        <td className="px-5 py-3 text-slate-400">{u.orders?.length ?? 0}</td>
                                        <td className="px-5 py-3">
                                            <button onClick={() => handleDelete(u._id)} disabled={deleteId === u._id} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-50">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {usersMeta.pages > 1 && (
                        <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-slate-700/50">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm disabled:opacity-40 cursor-pointer hover:bg-slate-600 transition-colors">← Prev</button>
                            <span className="text-slate-400 text-sm">Page {page} of {usersMeta.pages}</span>
                            <button onClick={() => setPage(p => Math.min(usersMeta.pages, p + 1))} disabled={page === usersMeta.pages} className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-sm disabled:opacity-40 cursor-pointer hover:bg-slate-600 transition-colors">Next →</button>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default UsersPage;
