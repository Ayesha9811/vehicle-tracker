import { useEffect, useMemo, useState } from 'react';
import { Circle, Plus, X } from 'lucide-react';
import { loadJson, saveJson } from '../utils/storage';

const INITIAL_FORM_STATE = {
  vehicleId: '',
  date: '',
  type: 'Alignment',
  cost: '',
  odometer: '',
  notes: '',
};

const Tires = () => {
  const [vehicles, setVehicles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setVehicles(loadJson('vehicles', []));
    setEntries(loadJson('tireEntries', []));
  }, []);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => ({
        totalCost: acc.totalCost + Number(entry.cost || 0),
        count: acc.count + 1,
      }),
      { totalCost: 0, count: 0 }
    );
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.date || !form.type) {
      return;
    }
    const newEntry = {
      id: Date.now(),
      vehicleId: Number(form.vehicleId),
      date: form.date,
      type: form.type,
      cost: Number(form.cost || 0),
      odometer: Number(form.odometer || 0),
      notes: form.notes,
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveJson('tireEntries', updated);
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tire & Alignment</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <Circle className="h-4 w-4" />
              Total tire records: {totals.count}
            </span>
            <p className="text-sm text-gray-500">Record alignments, balancing and tire replacement services.</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add Tire Record
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total records</p>
          <p className="text-3xl font-bold text-gray-900">{totals.count}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total cost</p>
          <p className="text-3xl font-bold text-gray-900">${totals.totalCost.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Tire Record History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left rounded-tl-xl rounded-bl-xl">Date</th>
                <th className="px-6 py-4 text-left">Vehicle</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-right">Cost</th>
                <th className="px-6 py-4 text-right rounded-tr-xl rounded-br-xl">Odometer</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {entries.map((entry) => {
                const vehicle = vehicles.find((v) => v.id === entry.vehicleId);
                return (
                  <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{vehicle?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">{entry.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">${entry.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{entry.odometer || '-'} km</td>
                  </tr>
                );
              })}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                    <Circle className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                    <p className="font-medium text-gray-900">No tire records yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white rounded-t-3xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Circle className="h-5 w-5" />
                Add Tire Record
              </h2>
              <button onClick={handleCloseModal} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Vehicle</label>
                  <select required value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700">
                    <option value="">Select a Vehicle</option>
                    {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Date</label>
                  <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700">
                    <option>Alignment</option>
                    <option>Balancing</option>
                    <option>Replacement</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Cost ($)</label>
                  <input type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Odometer</label>
                  <input type="number" value={form.odometer} onChange={(e) => setForm({ ...form, odometer: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all min-h-[100px]" />
                </div>

                <div className="md:col-span-2 flex gap-3 mt-4 pt-4 border-t border-gray-100 z-10 sticky bottom-0 bg-white">
                  <button type="button" onClick={handleCloseModal} className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-wider text-xs ml-auto">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-all active:scale-95 uppercase tracking-wider text-xs">Save Record</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Tires;
