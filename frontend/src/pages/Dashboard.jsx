import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Activity, Bell, CreditCard, Droplet, FileText, Truck, Wrench, CircleDollarSign, Calendar } from 'lucide-react';
import { loadJson, saveJson } from '../utils/storage';

const sampleVehicles = [
  {
    id: 1,
    name: 'Truck 1',
    driver: 'John Doe',
    status: 'Moving',
    speed: 60,
    plate: 'ABC-123',
    type: 'Truck',
    lastUpdated: new Date().toISOString(),
    lat: 51.505,
    lng: -0.09,
  },
  {
    id: 2,
    name: 'Van 2',
    driver: 'Jane Smith',
    status: 'Idle',
    speed: 0,
    plate: 'DEF-456',
    type: 'Van',
    lastUpdated: new Date().toISOString(),
    lat: 51.51,
    lng: -0.1,
  },
  {
    id: 3,
    name: 'Truck 3',
    driver: 'Bob Johnson',
    status: 'Offline',
    speed: 0,
    plate: 'GHI-789',
    type: 'Truck',
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    lat: 51.515,
    lng: -0.08,
  },
];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [fuelEntries, setFuelEntries] = useState([]);
  const [serviceEntries, setServiceEntries] = useState([]);
  const [expenseEntries, setExpenseEntries] = useState([]);
  const [modificationEntries, setModificationEntries] = useState([]);
  const [tireEntries, setTireEntries] = useState([]);
  const [documentEntries, setDocumentEntries] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewAllTime, setViewAllTime] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isAdmin = currentUser.role === 'admin';
    const storedVehicles = loadJson('vehicles', []);
    let loadedVehicles = storedVehicles.length ? storedVehicles : sampleVehicles;
    if (!storedVehicles.length) {
      saveJson('vehicles', loadedVehicles);
    }
    
    if (!isAdmin) {
      loadedVehicles = loadedVehicles.filter(v => v.assignedDriverId === currentUser.id);
    }
    setVehicles(loadedVehicles);

    const validIds = loadedVehicles.map(v => v.id);
    const filterEntries = (entries) => isAdmin ? entries : entries.filter(e => validIds.includes(e.vehicleId));

    setFuelEntries(filterEntries(loadJson('fuelEntries', [])));
    setServiceEntries(filterEntries(loadJson('serviceEntries', [])));
    setExpenseEntries(filterEntries(loadJson('expenseEntries', [])));
    setModificationEntries(filterEntries(loadJson('modificationEntries', [])));
    setTireEntries(filterEntries(loadJson('tireEntries', [])));
    setDocumentEntries(filterEntries(loadJson('documentEntries', [])));
    setJourneys(filterEntries(loadJson('journeyEntries', [])));
    setReminders(filterEntries(loadJson('reminders', [])));

    let loadedAlerts = loadJson('alerts', []);
    if (!loadedAlerts.length) {
      loadedAlerts = [
        { id: 1, message: 'Oil change due soon', vehicleName: loadedVehicles[0]?.name || 'Fleet', timestamp: new Date().toISOString(), severity: 'medium' },
        { id: 2, message: 'Tire pressure warning', vehicleName: loadedVehicles[1]?.name || 'Fleet', timestamp: new Date().toISOString(), severity: 'high' },
      ];
    }
    setAlerts(isAdmin ? loadedAlerts : loadedAlerts.filter(a => loadedVehicles.some(v => v.name === a.vehicleName)));
  }, []);

  const years = useMemo(() => {
    const allDates = [
      ...fuelEntries.map(e => e.date),
      ...serviceEntries.map(e => e.date),
      ...expenseEntries.map(e => e.date),
      ...modificationEntries.map(e => e.date),
      ...tireEntries.map(e => e.date),
    ].filter(Boolean);
    
    if (allDates.length === 0) return [new Date().getFullYear()];
    
    const yearsSet = new Set(allDates.map(d => new Date(d).getFullYear()));
    yearsSet.add(new Date().getFullYear());
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [fuelEntries, serviceEntries, expenseEntries, modificationEntries, tireEntries]);

  const filterByDate = (dateStr) => {
    if (viewAllTime) return true;
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
  };

  const totals = useMemo(() => {
    const filteredFuel = fuelEntries.filter(e => filterByDate(e.date));
    const filteredService = serviceEntries.filter(e => filterByDate(e.date));
    const filteredExpense = expenseEntries.filter(e => filterByDate(e.date));
    const filteredMod = modificationEntries.filter(e => filterByDate(e.date));
    const filteredTire = tireEntries.filter(e => filterByDate(e.date));
    const filteredJourneys = journeys.filter(e => filterByDate(e.date));

    const totalFuelCost = filteredFuel.reduce((sum, entry) => sum + Number(entry.cost || 0), 0);
    const totalServiceCost = filteredService.reduce((sum, entry) => sum + Number(entry.cost || 0), 0);
    const totalTireCost = filteredTire.reduce((sum, entry) => sum + Number(entry.cost || 0), 0);
    
    // Grouping "Other Expenses" (Expenses + Modifications)
    const totalOtherCost = [
      ...filteredExpense.map(e => Number(e.amount || 0)),
      ...filteredMod.map(e => Number(e.cost || 0))
    ].reduce((sum, cost) => sum + cost, 0);

    const totalCost = totalFuelCost + totalServiceCost + totalTireCost + totalOtherCost;

    const activeCount = vehicles.filter((vehicle) => vehicle.status !== 'Offline').length;
    const inactiveCount = vehicles.filter((vehicle) => vehicle.status === 'Offline').length;
    
    const upcomingReminders = reminders.filter((item) => {
      if (!item.dueDate) return false;
      const diff = new Date(item.dueDate).getTime() - Date.now();
      return diff >= 0 && diff <= 14 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      totalCost,
      totalFuelCost,
      totalServiceCost,
      totalOtherCost,
      totalTireCost,
      activeCount,
      inactiveCount,
      upcomingReminders,
      totalJourneyCount: filteredJourneys.length,
      totalDocumentCount: documentEntries.length, // Documents might not be date-filtered the same way
      totalAlerts: alerts.length,
    };
  }, [vehicles, fuelEntries, serviceEntries, expenseEntries, modificationEntries, tireEntries, documentEntries, reminders, journeys, alerts, selectedMonth, selectedYear, viewAllTime]);

  const recentActivity = useMemo(() => {
    const activityItems = [
      ...fuelEntries.map((entry) => ({
        id: `fuel-${entry.id}`,
        type: 'Fuel',
        description: `Refueled ${entry.liters} L for ${entry.cost ? `$${entry.cost}` : 'unknown cost'}`,
        vehicleName: vehicles.find((v) => Number(v.id) === Number(entry.vehicleId))?.name || 'Unknown',
        timestamp: entry.date,
      })),
      ...serviceEntries.map((entry) => ({
        id: `service-${entry.id}`,
        type: 'Service',
        description: entry.description,
        vehicleName: vehicles.find((v) => Number(v.id) === Number(entry.vehicleId))?.name || 'Unknown',
        timestamp: entry.date,
      })),
      ...expenseEntries.map((entry) => ({
        id: `expense-${entry.id}`,
        type: 'Expense',
        description: entry.description,
        vehicleName: vehicles.find((v) => Number(v.id) === Number(entry.vehicleId))?.name || 'Unknown',
        timestamp: entry.date,
      })),
      ...reminders.map((entry) => ({
        id: `reminder-${entry.id}`,
        type: 'Reminder',
        description: entry.title,
        vehicleName: vehicles.find((v) => Number(v.id) === Number(entry.vehicleId))?.name || 'Unknown',
        timestamp: entry.dueDate,
      })),
    ];

    return activityItems
      .filter((item) => item.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  }, [fuelEntries, serviceEntries, expenseEntries, reminders, vehicles]);

  return (
    <div className="p-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 line-clamp-1">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {viewAllTime ? 'Complete fleet overview' : `Fleet overview for ${months[selectedMonth]} ${selectedYear}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 px-2 border-r border-gray-200">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Filter</span>
          </div>
          
          <button
            onClick={() => setViewAllTime(!viewAllTime)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewAllTime 
                ? 'bg-indigo-100 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Time
          </button>

          {!viewAllTime && (
            <>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>{month}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {totals.activeCount} Active
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-4">Total Vehicles</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{vehicles.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-50 rounded-xl">
              <CircleDollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-4">Total Cost</p>
          <p className="text-3xl font-bold text-red-600 mt-1">${totals.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-indigo-50 rounded-xl">
              <Droplet className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-4">Fuel Costs</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">${totals.totalFuelCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Wrench className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 mt-4">Services</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">${totals.totalServiceCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-2 bg-purple-50 rounded-lg">
            <CreditCard className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Other Expenses</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">${totals.totalOtherCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tire Costs</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">${totals.totalTireCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-2 bg-green-50 rounded-lg">
            <Activity className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Journeys</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{totals.totalJourneyCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'Fuel' ? 'bg-indigo-50 text-indigo-600' :
                    activity.type === 'Service' ? 'bg-orange-50 text-orange-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {activity.type === 'Fuel' ? <Droplet className="h-4 w-4" /> :
                     activity.type === 'Service' ? <Wrench className="h-4 w-4" /> :
                     <FileText className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.type}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activity.vehicleName}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[10px] font-medium text-gray-500">{new Date(activity.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-400">No recent activity detected.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">System Alerts</h2>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md uppercase">Critical {alerts.length}</span>
          </div>
          <div className="space-y-4">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-white border-l-4 border-red-500 shadow-sm">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm font-bold">{alert.message}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-red-600 uppercase tracking-wider">{alert.vehicleName}</span>
                  <span className="text-[10px] text-gray-400">{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;