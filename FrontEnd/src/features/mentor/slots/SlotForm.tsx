import React, { useState } from 'react';

const SlotBookingForm = () => {
  const [formData, setFormData] = useState({
    programType: '',
    selectedDays: [],
    startTime: '',
    endTime: '',
    capacity: '1'
  });

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];



  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.programType && formData.selectedDays.length > 0 && formData.startTime && formData.endTime) {
     
      setFormData({
        programType: '',
        selectedDays: [],
        startTime: '',
        endTime: '',
        capacity: '1'
      });
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Slot</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Program Type */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Program Type<span className="text-red-600">*</span>
          </label>
          <select
            value={formData.programType}
            onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          >
            <option value="">Select a program</option>
            <option value="Strength & Conditioning Basics">Strength & Conditioning Basics</option>
            <option value="Advanced Training">Advanced Training</option>
            <option value="Cardio Sessions">Cardio Sessions</option>
            <option value="Yoga & Flexibility">Yoga & Flexibility</option>
          </select>
        </div>

        {/* Select Days */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Select Days<span className="text-red-600">*</span>
          </label>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                // onClick={}
                className={`py-2 px-3 border rounded text-sm font-medium transition-colors ${
                  formData.selectedDays.includes(day)
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Start Time<span className="text-red-600">*</span>
            </label>
            <select
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            >
              <option value="">Select start time</option>
              <option value="1:30 AM">1:30 AM</option>
              <option value="6:00 AM">6:00 AM</option>
              <option value="7:00 AM">7:00 AM</option>
              <option value="8:00 AM">8:00 AM</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="5:00 PM">5:00 PM</option>
              <option value="6:00 PM">6:00 PM</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              End Time<span className="text-red-600">*</span>
            </label>
            <select
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            >
              <option value="">Select end time</option>
              <option value="2:30 AM">2:30 AM</option>
              <option value="7:00 AM">7:00 AM</option>
              <option value="8:00 AM">8:00 AM</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="6:00 PM">6:00 PM</option>
              <option value="7:00 PM">7:00 PM</option>
            </select>
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Capacity<span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />
        </div>

        {/* Note */}
        <div className="bg-gray-50 border border-gray-200 rounded p-3">
          <p className="text-sm text-gray-600">
            Note: The system prevents overlapping slots automatically.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors font-medium"
        >
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default SlotBookingForm;