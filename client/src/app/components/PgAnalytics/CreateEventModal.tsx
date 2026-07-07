import React, { useState } from 'react';
import axios from 'axios';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { serverUrl } from '@/utils';

interface CreateEventModalProps {
  communityId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const EVENT_TYPES = [
  { value: 'SOCIAL', label: 'Social' },
  { value: 'CELEBRATION', label: 'Celebration' },
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'EDUCATIONAL', label: 'Educational' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'OTHER', label: 'Other' },
];

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  communityId,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'SOCIAL',
    location: '',
    startDate: '',
    endDate: '',
    maxCapacity: '',
    estimatedCost: '',
    requiresRegistration: false,
    registrationDeadline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const toISOString = (datetimeLocal: string) => new Date(datetimeLocal).toISOString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        eventType: formData.eventType,
        location: formData.location.trim(),
        startDate: toISOString(formData.startDate),
        endDate: toISOString(formData.endDate),
        requiresRegistration: formData.requiresRegistration,
      };

      if (formData.maxCapacity) {
        payload.maxCapacity = parseInt(formData.maxCapacity, 10);
      }
      if (formData.estimatedCost) {
        payload.estimatedCost = parseFloat(formData.estimatedCost);
      }
      if (formData.requiresRegistration && formData.registrationDeadline) {
        payload.registrationDeadline = toISOString(formData.registrationDeadline);
      }

      await axios.post(`${serverUrl}/pg-analytics/${communityId}/events`, payload, {
        withCredentials: true,
      });

      onSuccess();
    } catch (err: any) {
      const message =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Failed to create event';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[24px] p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g. Community Movie Night"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Describe the event..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type *
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. Common Room"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                id="maxCapacity"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. 50"
              />
            </div>

            <div>
              <label htmlFor="estimatedCost" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Cost (₹)
              </label>
              <input
                type="number"
                id="estimatedCost"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                min={0}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g. 500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requiresRegistration"
              name="requiresRegistration"
              checked={formData.requiresRegistration}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="requiresRegistration" className="text-sm text-gray-700">
              Requires resident registration
            </label>
          </div>

          {formData.requiresRegistration && (
            <div>
              <label
                htmlFor="registrationDeadline"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Registration Deadline
              </label>
              <input
                type="datetime-local"
                id="registrationDeadline"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleChange}
                max={formData.startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-1 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#FF4500] text-white rounded-xl hover:bg-[#E03E00] transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
