import React from 'react';

export type StatusVariant =
  | 'confirmed'
  | 'disputed'
  | 'pending'
  | 'active'
  | 'completed'
  | 'paid'
  | 'advance'
  | 'full-day'
  | 'half-day'
  | 'absent';

export interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  hindiLabel?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  hindiLabel,
  size = 'md',
  className = '',
}) => {
  const normalized = status.toLowerCase();

  // Color mapping based on Part B requirements:
  // Success: #15803D, Warning: #D97706, Danger: #DC2626, Forest: #176B45
  let styles = 'bg-gray-100 text-gray-700 border-gray-200';
  let defaultLabel = label || status;
  let defaultHindi = hindiLabel;

  switch (normalized) {
    case 'confirmed':
    case 'सत्यापित':
      styles = 'bg-forest-50 text-status-success border-forest-200';
      defaultLabel = defaultLabel || 'Confirmed';
      defaultHindi = defaultHindi || 'सत्यापित';
      break;

    case 'disputed':
    case 'विवादित':
      styles = 'bg-status-danger-bg text-status-danger border-red-200';
      defaultLabel = defaultLabel || 'Disputed';
      defaultHindi = defaultHindi || 'विवादित';
      break;

    case 'pending':
    case 'लंबित':
      styles = 'bg-status-warning-bg text-status-warning border-amber-200';
      defaultLabel = defaultLabel || 'Pending';
      defaultHindi = defaultHindi || 'प्रतीक्षारत';
      break;

    case 'active':
    case 'सक्रिय':
      styles = 'bg-forest-soft text-forest-dark border-forest-300';
      defaultLabel = defaultLabel || 'Active';
      defaultHindi = defaultHindi || 'चालू काम';
      break;

    case 'paid':
    case 'भुगतान प्राप्त':
      styles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      defaultLabel = defaultLabel || 'Paid';
      defaultHindi = defaultHindi || 'प्राप्त';
      break;

    case 'advance':
    case 'अग्रिम':
      styles = 'bg-sky-50 text-sky-800 border-sky-200';
      defaultLabel = defaultLabel || 'Advance';
      defaultHindi = defaultHindi || 'खर्चा / पेशगी';
      break;

    case 'full-day':
    case 'पूरा दिन':
      styles = 'bg-forest-50 text-forest border-forest-200';
      defaultLabel = defaultLabel || 'Full Day';
      defaultHindi = defaultHindi || 'पूरा दिन (1.0)';
      break;

    case 'half-day':
    case 'आधा दिन':
      styles = 'bg-amber-50 text-amber-800 border-amber-200';
      defaultLabel = defaultLabel || 'Half Day';
      defaultHindi = defaultHindi || 'आधा दिन (0.5)';
      break;

    case 'absent':
    case 'छुट्टी':
      styles = 'bg-rose-50 text-rose-700 border-rose-200';
      defaultLabel = defaultLabel || 'Absent';
      defaultHindi = defaultHindi || 'अनुपस्थित';
      break;
  }

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[10px]'
      : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border tracking-wide transition-colors ${sizeClasses} ${styles} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" aria-hidden="true" />
      <span>{label || defaultLabel}</span>
      {defaultHindi && (
        <span className="opacity-80 font-hindi text-[10px]">
          ({defaultHindi})
        </span>
      )}
    </span>
  );
};
