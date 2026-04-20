import { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, X, UserCog, ShieldCheck, Truck } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'driver'
  });

  useEffect(() => {
    // Ensure default admin exists
    let storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (storedUsers.length === 0) {
      storedUsers = [{
        id: 1,
        name: 'System Admin',
        email: 'admin@test.com',
        password: 'admin',
        role: 'admin'
      }];
      localStorage.setItem('users', JSON.stringify(storedUsers));
    }
    setUsers(storedUsers);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;

    let updatedUsers = [...users];
    
    if (form.id) {
      // Edit mode
      updatedUsers = updatedUsers.map(u => u.id === form.id ? form : u);
    } else {
      // Add mode
      const newUser = {
        ...form,
        id: Date.now()
      };
      updatedUsers.push(newUser);
    }

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setIsModalOpen(false);
    setForm({ id: '', name: '', email: '', password: '', role: 'driver' });
  };

  const handleEdit = (user) => {
    setForm(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm({ id: '', name: '', email: '', password: '', role: 'driver' });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <UsersIcon className="h-4 w-4" />
              Total users: {users.length}
            </span>
            <p className="text-sm text-gray-500">Manage admin credentials and register drivers for vehicle assignment.</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Registered System Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left rounded-tl-xl rounded-bl-xl">Name</th>
                <th className="px-6 py-4 text-left">Email / Login</th>
                <th className="px-6 py-4 text-left">System Role</th>
                <th className="px-6 py-4 text-right rounded-tr-xl rounded-br-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {u.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-700 uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                        <Truck className="w-3 h-3" />
                        Driver
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      onClick={() => handleEdit(u)}
                      className="inline-flex items-center justify-center p-2 text-gray-400 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                      title="Edit User"
                    >
                      <UserCog className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md my-auto animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white rounded-t-3xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                {form.id ? 'Edit User' : 'Register User'}
              </h2>
              <button type="button" onClick={handleCloseModal} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="E.g. John Doe" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email / Login ID</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium" placeholder="driver@fleet.com" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                  <input required type="text" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-600" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">System Role</label>
                  <select required value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-gray-700">
                    <option value="driver">Driver (Restricted Access)</option>
                    <option value="admin">System Admin (Full Access)</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-wider text-xs ml-auto">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-all active:scale-95 uppercase tracking-wider text-xs">Save User</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
