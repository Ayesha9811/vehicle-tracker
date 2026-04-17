import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { loadJson } from '../utils/storage';

const Reports = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [totals, setTotals] = useState({});

  useEffect(() => {
    const fuel = loadJson('fuelEntries', []);
    const services = loadJson('serviceEntries', []);
    const expenses = loadJson('expenseEntries', []);
    const modifications = loadJson('modificationEntries', []);
    const tires = loadJson('tireEntries', []);

    const data = {
      fuel: fuel.reduce((sum, item) => sum + Number(item.cost || 0), 0),
      services: services.reduce((sum, item) => sum + Number(item.cost || 0), 0),
      expenses: expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      modifications: modifications.reduce((sum, item) => sum + Number(item.cost || 0), 0),
      tires: tires.reduce((sum, item) => sum + Number(item.cost || 0), 0),
    };
    setTotals(data);
    setIsLoaded(true);
  }, []);

  const chartData = useMemo(() => [
    { name: 'Fuel', value: totals.fuel || 0 },
    { name: 'Services', value: totals.services || 0 },
    { name: 'Expenses', value: totals.expenses || 0 },
    { name: 'Mods', value: totals.modifications || 0 },
    { name: 'Tires', value: totals.tires || 0 },
  ], [totals]);

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#38bdf8'];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-gray-600 mt-1">Cost analytics, comparisons and export-ready summaries.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <BarChart3 className="h-5 w-5" />
          Summary ready
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Fuel spend</p>
          <p className="mt-2 text-2xl font-semibold">${(totals.fuel || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Service spend</p>
          <p className="mt-2 text-2xl font-semibold">${(totals.services || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total fleet cost</p>
          <p className="mt-2 text-2xl font-semibold">${Object.values(totals).reduce((sum, value) => sum + (Number(value) || 0), 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Cost Comparison</h2>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Print / Export
          </button>
        </div>
        <div style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Cost" fill="#4f46e5">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isLoaded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {chartData.map((item) => (
            <div key={item.name} className="bg-white p-5 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500">{item.name}</p>
              <p className="mt-2 text-2xl font-semibold">${item.value.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
