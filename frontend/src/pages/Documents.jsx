import { useEffect, useMemo, useState } from 'react';
import { FileText, Plus, X } from 'lucide-react';
import { loadJson, saveJson } from '../utils/storage';

const INITIAL_FORM_STATE = {
  vehicleId: '',
  title: '',
  type: 'Registration',
  expiryDate: '',
  notes: '',
};

const Documents = () => {
  const [vehicles, setVehicles] = useState([]);
  const [docs, setDocs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    setVehicles(loadJson('vehicles', []));
    setDocs(loadJson('documents', []));
  }, []);

  const totals = useMemo(() => ({ count: docs.length }), [docs]);
  const upcoming = useMemo(() => docs.filter((doc) => {
    if (!doc.expiryDate) return false;
    const diff = new Date(doc.expiryDate).getTime() - Date.now();
    return diff >= 0 && diff <= 30 * 24 * 60 * 60 * 1000;
  }).length, [docs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.title || !form.type) {
      return;
    }
    const newDoc = {
      id: Date.now(),
      vehicleId: Number(form.vehicleId),
      title: form.title,
      type: form.type,
      expiryDate: form.expiryDate,
      notes: form.notes,
    };
    const updated = [newDoc, ...docs];
    setDocs(updated);
    saveJson('documents', updated);
    setForm(INITIAL_FORM_STATE);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm(INITIAL_FORM_STATE);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Document Vault</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <FileText className="h-4 w-4" />
              Total docs: {totals.count}
            </span>
            <p className="text-sm text-gray-500">Store active vehicle documents, licenses and renewals</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Document count</p>
          <p className="text-3xl font-bold text-gray-900">{totals.count}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Expiring soon</p>
          <p className="text-3xl font-bold text-gray-900">{upcoming}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Document Vault</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left rounded-tl-xl rounded-bl-xl">Title</th>
                <th className="px-6 py-4 text-left">Vehicle</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Expiry</th>
                <th className="px-6 py-4 text-left rounded-tr-xl rounded-br-xl">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {docs.map((doc) => {
                const vehicle = vehicles.find((v) => v.id === doc.vehicleId);
                return (
                  <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{vehicle?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">{doc.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.expiryDate || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-sm truncate">{doc.notes || '-'}</td>
                  </tr>
                );
              })}
              {docs.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                    <FileText className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                    <p className="font-medium text-gray-900">No documents stored yet.</p>
                    <p className="mt-1">Click 'Add Document' to log a new file.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white rounded-t-3xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Add Document
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Vehicle</label>
                  <select
                    required
                    value={form.vehicleId}
                    onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                  >
                    <option value="">Select a Vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>{vehicle.name} ({vehicle.plate})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Document Title</label>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="e.g. Registration Certificate"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Document Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                  >
                    <option>Registration</option>
                    <option>License</option>
                    <option>Insurance</option>
                    <option>Renewal</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                  />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]"
                    placeholder="Optional details..."
                  />
                </div>

                {/* Footer buttons fixed at bottom */}
                <div className="md:col-span-2 flex gap-3 mt-4 pt-4 border-t border-gray-100 z-10 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-wider text-xs ml-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-all active:scale-95 uppercase tracking-wider text-xs"
                  >
                    Save Document
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
