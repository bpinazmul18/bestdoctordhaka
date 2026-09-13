export type IconProps = React.SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5c0 8.284 6.716 15 15 15 .552 0 1-.448 1-1v-3.28a1 1 0 0 0-.76-.97l-3.5-.875a1 1 0 0 0-1.023.372l-1.1 1.467a12.06 12.06 0 0 1-5.33-5.33l1.467-1.1a1 1 0 0 0 .372-1.023l-.875-3.5A1 1 0 0 0 8.28 4H5c-.552 0-1 .448-1 1Z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 20l1.3-3.9A8 8 0 1 1 8.5 19L4 20Z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function GraduationCapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12.5V17c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
    </svg>
  );
}

export function StethoscopeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 4v6a5 5 0 0 0 10 0V4" />
      <path d="M10 15v2a5 5 0 0 0 10 0v-1" />
      <circle cx="20" cy="10" r="1.5" />
    </svg>
  );
}

export function HeartPulseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5c-.5 1-1.1 1.9-1.8 2.8" />
      <path d="M3 12h4l1.5-3L11 15l1.5-3H17" />
    </svg>
  );
}

export function SkinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3c4 3 6 6.5 6 10a6 6 0 0 1-12 0c0-3.5 2-7 6-10Z" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M15.5 14a5 5 0 0 1 5.5 5" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 20s-6.5-4.2-9-8.4C1.3 8.4 2.6 5 6 5c1.9 0 3.3 1 4.4 2.6.4.6.6.6 1.1.6 1.1-1.6 2.6-3.2 4.5-3.2 3.4 0 4.7 3.4 3 6.6-2.5 4.2-9 8.4-9 8.4Z" />
    </svg>
  );
}

export function VenusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="9" r="5" />
      <path d="M12 14v7" />
      <path d="M9 18h6" />
    </svg>
  );
}

export function ChildIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="6" r="3" />
      <path d="M6 21v-4a6 6 0 0 1 12 0v4" />
      <path d="M9 21v-3" />
      <path d="M15 21v-3" />
    </svg>
  );
}

export function BoneIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 17 17 7" />
      <path d="M5.5 8.5a2 2 0 1 1 3-3 2 2 0 0 1 3 3l-6 6a2 2 0 0 1-3 3 2 2 0 0 1 3-3" />
      <path d="M15.5 18.5a2 2 0 1 0 3 3 2 2 0 0 0 3-3l-6-6" />
    </svg>
  );
}

export function EarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 13a5 5 0 1 1 8-4c0 2-1 3-2 4s-2 2-2 4a3 3 0 0 1-6 0" />
      <path d="M13 9a2 2 0 0 1 0 4" />
    </svg>
  );
}

export function BuildingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="3" width="10" height="18" rx="1" />
      <path d="M15 21h4V9l-4-2" />
      <path d="M8 7h1M11 7h1M8 11h1M11 11h1M8 15h1M11 15h1" />
    </svg>
  );
}

export function FlaskIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 3h6" />
      <path d="M10 3v6.5L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.5V3" />
      <path d="M7 15h10" />
    </svg>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}
