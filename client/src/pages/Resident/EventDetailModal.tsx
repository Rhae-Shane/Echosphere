import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  CalendarDays,
  MapPin,
  User,
  Users,
  Clock,
  Tag,
} from 'lucide-react';

export interface ResidentEvent {
  id: string;
  title: string;
  description?: string;
  eventType: string;
  location?: string;
  startDate: string;
  endDate: string;
  maxCapacity?: number;
  estimatedCost?: number;
  requiresRegistration?: boolean;
  registrationDeadline?: string;
  userAttendanceStatus?: 'REGISTERED' | 'ATTENDED' | 'MISSED';
  attendedAt?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  pgCommunity?: {
    id: string;
    name: string;
  };
  _count?: {
    attendances: number;
    feedbacks: number;
  };
}

interface EventDetailModalProps {
  event: ResidentEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDateTime = (date: string) =>
  new Date(date).toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 py-5 rounded-t-2xl text-white"
          style={{
            background:
              'linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)',
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/90 mb-1">{event.eventType}</p>
              <h2 className="text-xl font-bold leading-tight">{event.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {event.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                About
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50">
              <CalendarDays className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Start</p>
                <p className="text-sm text-gray-900">{formatDateTime(event.startDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50">
              <Clock className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">End</p>
                <p className="text-sm text-gray-900">{formatDateTime(event.endDate)}</p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Location</p>
                  <p className="text-sm text-gray-900">{event.location}</p>
                </div>
              </div>
            )}

            {event.createdBy && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <User className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Organizer</p>
                  <p className="text-sm text-gray-900">{event.createdBy.name}</p>
                  <p className="text-xs text-gray-500">{event.createdBy.email}</p>
                </div>
              </div>
            )}

            {(event.maxCapacity || event._count) && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <Users className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Attendance</p>
                  <p className="text-sm text-gray-900">
                    {event._count?.attendances ?? 0} registered
                    {event.maxCapacity ? ` / ${event.maxCapacity} max` : ''}
                  </p>
                </div>
              </div>
            )}

            {event.pgCommunity && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                <Tag className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Community</p>
                  <p className="text-sm text-gray-900">{event.pgCommunity.name}</p>
                </div>
              </div>
            )}
          </div>

          {event.userAttendanceStatus && (
            <div className="pt-2 border-t border-gray-100">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  event.userAttendanceStatus === 'ATTENDED'
                    ? 'bg-green-100 text-green-800'
                    : event.userAttendanceStatus === 'MISSED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                }`}
              >
                Your status: {event.userAttendanceStatus}
              </span>
            </div>
          )}

          {event.requiresRegistration && event.registrationDeadline && (
            <p className="text-xs text-gray-500">
              Registration deadline: {formatDateTime(event.registrationDeadline)}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventDetailModal;
