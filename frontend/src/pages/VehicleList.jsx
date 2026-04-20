import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Edit2, X, Truck, Info, User, Tag, Hash, Box, ClipboardList } from 'lucide-react';
import { loadJson, saveJson } from '../utils/storage';

const INITIAL_FORM_STATE = {
  name: '',
  model: '',
  brand: '',
  type: '',
  noOfSeats: '',
  mileage: '',
  tankCapacity: '',
  fuelType: '',
  fuelType: '',
  chassisNo: '',
  driver: '',
  assignedDriverId: '',
  plate: '',
  status: 'Idle',
  speed: 0,
  otherDetails: '',
};

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser.role === 'admin';
  const [drivers, setDrivers] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    const loaded = loadJson('vehicles', []);
    if (loaded.length === 0) {
      // Default sample data if nothing exists
      const samples = [
        { id: 1, name: 'Truck 1', model: 'FH16', brand: 'Volvo', type: 'Truck', noOfSeats: '2', mileage: '12', tankCapacity: '500', fuelType: 'Diesel', chassisNo: 'CH12345678', driver: 'John Doe', plate: 'ABC-123', status: 'Moving', speed: 60, lastUpdated: new Date().toISOString(), otherDetails: 'Long haul specialist' },
        { id: 2, name: 'Van 2', model: 'Transit', brand: 'Ford', type: 'Van', noOfSeats: '3', mileage: '25', tankCapacity: '80', fuelType: 'Diesel', chassisNo: 'CH87654321', driver: 'Jane Smith', plate: 'DEF-456', status: 'Idle', speed: 0, lastUpdated: new Date().toISOString(), otherDetails: 'City delivery' },
      ];
      setVehicles(samples);
      saveJson('vehicles', samples);
    } else {
      setVehicles(loaded);
    }
    
    // Load drivers for assignment dropdown
    const systemUsers = loadJson('users', []);
    setDrivers(systemUsers.filter(u => u.role === 'driver'));
  }, []);

  useEffect(() => {
    let filtered = vehicles;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(v =>
        (v.name && v.name.toLowerCase().includes(term)) ||
        (v.driver && v.driver.toLowerCase().includes(term)) ||
        (v.model && v.model.toLowerCase().includes(term)) ||
        (v.brand && v.brand.toLowerCase().includes(term)) ||
        (v.type && v.type.toLowerCase().includes(term)) ||
        (v.plate && v.plate.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(v => v.status === statusFilter);
    }

    if (!isAdmin) {
      filtered = filtered.filter(v => v.assignedDriverId === currentUser.id);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, statusFilter]);

  const handleOpenModal = (vehicle = null) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setForm(vehicle);
    } else {
      setEditingVehicle(null);
      setForm(INITIAL_FORM_STATE);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
    setForm(INITIAL_FORM_STATE);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let updatedVehicles;

    if (editingVehicle) {
      updatedVehicles = vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { ...form, lastUpdated: new Date().toISOString() } 
          : v
      );
    } else {
      const newVehicle = {
        ...form,
        id: Date.now(),
        lastUpdated: new Date().toISOString(),
      };
      updatedVehicles = [newVehicle, ...vehicles];
    }

    setVehicles(updatedVehicles);
    saveJson('vehicles', updatedVehicles);
    handleCloseModal();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fleet Management</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              Total Vehicles: {vehicles.length}
            </span>
            <span className="text-sm text-gray-500">
              {filteredVehicles.length !== vehicles.length && `Filtered: ${filteredVehicles.length}`}
            </span>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add New Vehicle
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, driver, plate, brand, model or type..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 rounded-xl">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="bg-transparent border-none py-2.5 text-sm font-medium focus:ring-0 cursor-pointer text-gray-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Moving">Moving</option>
            <option value="Idle">Idle</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <Truck className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex gap-2">
                  {isAdmin && (
                    <button
                      onClick={() => handleOpenModal(vehicle)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit vehicle"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                  <Link
                    to={`/vehicles/${vehicle.id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Info className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{vehicle.name}</h3>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {vehicle.brand || ''} {vehicle.model || 'Unknown Model'} {vehicle.type && `(${vehicle.type})`}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <User className="h-4 w-4 text-gray-300" />
                  <span className="font-medium">{vehicle.driver}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Hash className="h-4 w-4 text-gray-300" />
                  <span className="font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{vehicle.plate}</span>
                </div>
                
                {/* Additional Details Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                   <div className="text-xs">
                     <span className="text-gray-400 block mb-0.5">Seats</span>
                     <span className="font-medium text-gray-700">{vehicle.noOfSeats || '-'}</span>
                   </div>
                   <div className="text-xs">
                     <span className="text-gray-400 block mb-0.5">Fuel</span>
                     <span className="font-medium text-gray-700">{vehicle.fuelType || '-'} • {vehicle.tankCapacity ? `${vehicle.tankCapacity}L` : '-'}</span>
                   </div>
                   <div className="text-xs">
                     <span className="text-gray-400 block mb-0.5">Mileage</span>
                     <span className="font-medium text-gray-700">{vehicle.mileage ? `${vehicle.mileage} km/l` : '-'}</span>
                   </div>
                   <div className="text-xs">
                     <span className="text-gray-400 block mb-0.5">Chassis</span>
                     <span className="font-medium text-gray-700 truncate block" title={vehicle.chassisNo}>{vehicle.chassisNo || '-'}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-auto p-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30 rounded-b-2xl">
              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                vehicle.status === 'Moving' ? 'bg-green-100 text-green-700' :
                vehicle.status === 'Idle' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {vehicle.status}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                {new Date(vehicle.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {filteredVehicles.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white rounded-t-3xl">
              <h2 className="text-xl font-bold">{editingVehicle ? 'Edit Vehicle' : 'Register New Vehicle'}</h2>
              <button 
                onClick={handleCloseModal}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-indigo-500" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Vehicle Name</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                      placeholder="e.g. Primary Truck"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5 flex gap-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Brand</label>
                      <input
                        required
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. Volvo"
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Model Name</label>
                      <input
                        required
                        type="text"
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. FH16"
                        value={form.model}
                        onChange={(e) => setForm({ ...form, model: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Type</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                      placeholder="e.g. Truck, Van, Car"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Number Plate</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all uppercase"
                      placeholder="e.g. ABC-1234"
                      value={form.plate}
                      onChange={(e) => setForm({ ...form, plate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Technical Spec */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Box className="h-4 w-4 text-indigo-500" />
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Fuel Type</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                      placeholder="e.g. Diesel"
                      value={form.fuelType}
                      onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Tank (L)</label>
                    <input
                      required
                      type="number"
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                      placeholder="e.g. 500"
                      value={form.tankCapacity}
                      onChange={(e) => setForm({ ...form, tankCapacity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mileage (km/l)</label>
                    <input
                      required
                      type="number"
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                      placeholder="e.g. 15"
                      value={form.mileage}
                      onChange={(e) => setForm({ ...form, mileage: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Seats</label>
                    <input
                      required
                      type="number"
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                      placeholder="e.g. 4"
                      value={form.noOfSeats}
                      onChange={(e) => setForm({ ...form, noOfSeats: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Chassis No.</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all uppercase"
                    placeholder="Enter chassis number"
                    value={form.chassisNo}
                    onChange={(e) => setForm({ ...form, chassisNo: e.target.value })}
                  />
                </div>
              </div>

              {/* Assignment & Other */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-indigo-500" />
                  Assignment & Notes
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Driver Assignment</label>
                    <select
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                      value={form.assignedDriverId || ''}
                      onChange={(e) => {
                        const selectedDriver = drivers.find(d => d.id === Number(e.target.value));
                        setForm({ ...form, assignedDriverId: selectedDriver?.id || '', driver: selectedDriver?.name || 'Unassigned' });
                      }}
                    >
                      <option value="">Unassigned</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Other Details</label>
                    <textarea
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all min-h-[80px]"
                      placeholder="Notes, technical data, or insurance info..."
                      value={form.otherDetails}
                      onChange={(e) => setForm({ ...form, otherDetails: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white shadow-[0_-20px_20px_-15px_rgba(0,0,0,0.05)] rounded-b-xl z-10 p-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-sm transition-all active:scale-95"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;