/**
 * NotificationPreferences Component (PRE-LAUNCH BLOCKER #2)
 * Spec: Board Condition #2 — Email notifications for percentile changes
 *
 * User controls for managing Pulse notification settings:
 * - Email notifications toggle
 * - Threshold setting (points change to trigger notification)
 * - Weekly digest toggle
 * - Unsubscribe option
 */

"use client";

import React, { useState, useCallback } from "react";

export interface NotificationPreferencesData {
  emailEnabled: boolean;
  threshold: number;
  weeklyDigest: boolean;
}

export interface NotificationPreferencesProps {
  /** Current preferences */
  preferences: NotificationPreferencesData;
  /** Callback when preferences are updated */
  onUpdate: (preferences: NotificationPreferencesData) => Promise<void>;
  /** Optional className for styling */
  className?: string;
  /** Whether the form is currently saving */
  isSaving?: boolean;
}

/**
 * Toggle switch component with accessibility
 */
function Toggle({
  checked,
  onChange,
  disabled = false,
  id,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id: string;
  label: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/**
 * Info icon with tooltip
 */
function InfoTooltip({ text }: { text: string }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block ml-2">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
        aria-label="More information"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg whitespace-nowrap z-10"
          role="tooltip"
        >
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
}

/**
 * NotificationPreferences Component
 */
export function NotificationPreferences({
  preferences,
  onUpdate,
  className = "",
  isSaving = false,
}: NotificationPreferencesProps) {
  // Local state for form
  const [localPrefs, setLocalPrefs] = useState<NotificationPreferencesData>(preferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Update local state
  const updatePref = useCallback(
    <K extends keyof NotificationPreferencesData>(
      key: K,
      value: NotificationPreferencesData[K]
    ) => {
      setLocalPrefs((prev) => ({ ...prev, [key]: value }));
      setHasChanges(true);
      setSaveStatus("idle");
    },
    []
  );

  // Handle save
  const handleSave = useCallback(async () => {
    try {
      setSaveStatus("saving");
      await onUpdate(localPrefs);
      setSaveStatus("saved");
      setHasChanges(false);
      // Reset status after a moment
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
    }
  }, [localPrefs, onUpdate]);

  // Handle threshold input
  const handleThresholdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value) && value >= 1 && value <= 50) {
        updatePref("threshold", value);
      }
    },
    [updatePref]
  );

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-md ${className}`}
      role="region"
      aria-label="Notification preferences"
    >
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Notification Settings
      </h3>

      {/* Email Notifications Toggle */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex-1">
          <label
            htmlFor="email-notifications"
            className="font-medium text-gray-700"
          >
            Email Notifications
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Get notified when your percentile changes significantly
          </p>
        </div>
        <Toggle
          id="email-notifications"
          checked={localPrefs.emailEnabled}
          onChange={(checked) => updatePref("emailEnabled", checked)}
          disabled={isSaving}
          label="Toggle email notifications"
        />
      </div>

      {/* Threshold Setting (only shown if email enabled) */}
      {localPrefs.emailEnabled && (
        <div className="py-4 border-b border-gray-100">
          <div className="flex items-center mb-2">
            <label
              htmlFor="threshold"
              className="font-medium text-gray-700"
            >
              Notification Threshold
            </label>
            <InfoTooltip text="Notify me when my percentile changes by this many points" />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              id="threshold"
              min="1"
              max="50"
              value={localPrefs.threshold}
              onChange={handleThresholdChange}
              disabled={isSaving}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              aria-describedby="threshold-description"
            />
            <span
              id="threshold-description"
              className="text-sm text-gray-500"
            >
              points change (default: 5)
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            You&apos;ll be notified when your ranking goes up or down by{" "}
            {localPrefs.threshold} or more points.
          </p>
        </div>
      )}

      {/* Weekly Digest Toggle */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100">
        <div className="flex-1">
          <label htmlFor="weekly-digest" className="font-medium text-gray-700">
            Weekly Digest
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Receive a weekly summary of your performance
          </p>
        </div>
        <Toggle
          id="weekly-digest"
          checked={localPrefs.weeklyDigest}
          onChange={(checked) => updatePref("weeklyDigest", checked)}
          disabled={isSaving}
          label="Toggle weekly digest"
        />
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || saveStatus === "saving"}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saveStatus === "saving" ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>

          {saveStatus === "saved" && (
            <span className="text-green-600 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </span>
          )}

          {saveStatus === "error" && (
            <span className="text-red-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Error saving. Try again.
            </span>
          )}
        </div>
      )}

      {/* Unsubscribe Link */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => {
            updatePref("emailEnabled", false);
            updatePref("weeklyDigest", false);
          }}
          className="text-sm text-gray-400 hover:text-gray-600 underline focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
        >
          Unsubscribe from all Pulse notifications
        </button>
      </div>
    </div>
  );
}

export default NotificationPreferences;
