import { useEffect, useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { loadJson, saveJson } from '../utils/storage';

const Settings = () => {
  const [settings, setSettings] = useState({
    fleetName: 'Personal Fleet',
    distanceUnit: 'km',
    currency: 'USD',
    notifications: true,
  });

  useEffect(() => {
    setSettings(loadJson('appSettings', settings));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveJson('appSettings', settings);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Configure fleet defaults, notifications and display preferences.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <SettingsIcon className="h-5 w-5" />
          Manage preferences
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fleet Name</label>
            <input
              type="text"
              value={settings.fleetName}
              onChange={(e) => setSettings({ ...settings, fleetName: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Distance unit</label>
              <select
                value={settings.distanceUnit}
                onChange={(e) => setSettings({ ...settings, distanceUnit: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="km">km</option>
                <option value="mi">mi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="LKR">LKR</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label className="text-sm text-gray-700">Enable notifications for reminders and alerts</label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
