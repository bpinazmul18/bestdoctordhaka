import {
  BoneIcon,
  EarIcon,
  ChildIcon,
  HeartIcon,
  SkinIcon,
  StethoscopeIcon,
  VenusIcon,
  type IconProps,
} from "./icons";
import { cx } from "./cx";

const ICON_BY_SLUG: Record<string, { Icon: (props: IconProps) => React.JSX.Element; colorClass: string }> = {
  "internal-medicine": { Icon: StethoscopeIcon, colorClass: "text-teal-600" },
  cardiology: { Icon: HeartIcon, colorClass: "text-rose-500" },
  dermatology: { Icon: SkinIcon, colorClass: "text-amber-600" },
  gynecology: { Icon: VenusIcon, colorClass: "text-fuchsia-600" },
  pediatrics: { Icon: ChildIcon, colorClass: "text-sky-600" },
  orthopedics: { Icon: BoneIcon, colorClass: "text-brand-600" },
  ent: { Icon: EarIcon, colorClass: "text-cyan-600" },
};

const DEFAULT = { Icon: StethoscopeIcon, colorClass: "text-brand-600" };

export function SpecialtyIcon({ slug, className, ...props }: { slug: string } & IconProps) {
  const { Icon, colorClass } = ICON_BY_SLUG[slug] ?? DEFAULT;
  return <Icon className={cx(colorClass, className)} {...props} />;
}
