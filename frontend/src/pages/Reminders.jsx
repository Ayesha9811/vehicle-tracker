import { useEffect, useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import { loadJson, saveJson } from '../utils/storage';

const Reminders = () => {
  const [vehicles, setVehicles] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({
    vehicleId: '',
    title: '',
    type: 'Service due',
    dueDate: '',
    notes: '',
  });

  useEffect(() => {
    setVehicles(loadJson('vehicles', []));
    setReminders(loadJson('reminders', []));
  }, []);

  const totals = useMemo(() => ({ count: reminders.length }), [reminders]);
  const upcoming = useMemo(() => reminders.filter((item) => {
    if (!item.dueDate) return false;
    const diff = new Date(item.dueDate).getTime() - Date.now();
    return diff >= 0 && diff <= 14 * 24 * 60 * 60 * 1000;
  }).length, [reminders]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.title || !form.dueDate) {
      return;
    }
    const newReminder = {
      id: Date.now(),
      vehicleId: Number(form.vehicleId),
      title: form.title,
      type: form.type,
      dueDate: form.dueDate,
      notes: form.notes,
    };
    const updated = [newReminder, ...reminders];
    setReminders(updated);
    saveJson('reminders', updated);
    setForm({ vehicleId: '', title: '', type: 'Service due', dueDate: '', notes: '' });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reminders</h1>
          <p className="text-sm text-gray-600 mt-1">Track service dues, renewals and alerts for every vehicle.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <Bell className="h-5 w-5" />
          Upcoming reminders: {upcoming}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total reminders</p>
          <p className="mt-2 text-2xl font-semibold">{totals.count}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Due within 14 days</p>
          <p className="mt-2 text-2xl font-semibold">{upcoming}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Add Reminder</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
            <select
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Service due, renewal reminder"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option>Service due</option>
              <option>Renewal</option>
              <option>Alert</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due date</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Optional reminder notes"
            />
          </div>
          <div className="lg:col-span-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Reminder List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reminders.map((item) => {
                const vehicle = vehicles.find((v) => v.id === item.vehicleId);
                return (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{vehicle?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.dueDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.notes || '-'}</td>
                  </tr>
                );
              })}
              {reminders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-6 text-center text-sm text-gray-500">No reminders created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
