import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

const MouseContext = createContext({ x: 0, y: 0 } as { x: number; y: number });

type SocialItem = {
  id: string;
  href: string;
  "aria-label": string;
  icon: ReactNode;
};

const socialItems: SocialItem[] = [
  {
    id: "linkedin",
    href: "https://www.linkedin.com/company/callbay",
    "aria-label": "CallBay on LinkedIn",
    icon: <LinkedinGlyph />,
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/callbay",
    "aria-label": "CallBay on Instagram",
    icon: <InstagramGlyph />,
  },
  {
    id: "x",
    href: "https://x.com/callbay",
    "aria-label": "CallBay on X",
    icon: <XGlyph />,
  },
  {
    id: "facebook",
    href: "https://www.facebook.com/callbay",
    "aria-label": "CallBay on Facebook",
    icon: <FacebookGlyph />,
  },
];

const iconSize = "h-3.5 w-3.5 text-primary";

function LinkedinGlyph() {
  return (
    <svg
      className={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg
      className={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function XGlyph() {
  return (
    <svg
      className={iconSize}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookGlyph() {
  return (
    <svg
      className={iconSize}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.887c0-.94.2-1.113 1.1-1.113h2.4V3.128c-.49-.05-2.2-.2-2.8-.2-2.7 0-4.6 1.5-4.6 4.2V8z" />
    </svg>
  );
}

const dockTrackClass =
  "flex h-11 items-end gap-1 rounded-xl border border-primary/20 bg-black px-2 pb-1 shadow-[0_4px_24px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(194,61,72,0.12)]";

const dockItemClass =
  "aspect-square grid place-items-center cursor-pointer rounded-full border border-primary/25 bg-primary/5 text-primary transition-colors hover:border-primary/45 hover:bg-primary/12 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black";

function StaticDock() {
  return (
    <div className={dockTrackClass}>
      {socialItems.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item["aria-label"]}
          className={cn(dockItemClass, "h-8 w-8 shrink-0")}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}

type DockIconProps = {
  href: string;
  "aria-label": string;
  icon: ReactNode;
};

function DockIcon({ href, "aria-label": ariaLabel, icon }: DockIconProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouse = useContext(MouseContext);
  const distance = useMotionValue(Infinity);

  useEffect(() => {
    if (!ref.current) {
      distance.set(Infinity);
      return;
    }
    if (mouse.x === 0) {
      distance.set(Infinity);
      return;
    }
    const iconRect = ref.current.getBoundingClientRect();
    const parent = ref.current.parentElement;
    if (!parent) {
      distance.set(Infinity);
      return;
    }
    const containerRect = parent.getBoundingClientRect();
    const iconCenterX = iconRect.left + iconRect.width / 2;
    const mouseXAbsolute = containerRect.left + mouse.x;
    distance.set(Math.abs(mouseXAbsolute - iconCenterX));
  }, [mouse.x, distance]);

  const width = useTransform(distance, [0, 80], [40, 32]);
  const springW = useSpring(width, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      style={{ width: springW }}
      className={cn(dockItemClass, "shrink-0 will-change-[width]")}
    >
      {icon}
    </motion.a>
  );
}

function MagneticDockInner() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = e;
    const { left } = currentTarget.getBoundingClientRect();
    setPos({ x: clientX - left, y: 0 });
  };

  const onMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <MouseContext.Provider value={pos}>
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className={dockTrackClass}
      >
        {socialItems.map((item) => (
          <DockIcon
            key={item.id}
            href={item.href}
            aria-label={item["aria-label"]}
            icon={item.icon}
          />
        ))}
      </div>
    </MouseContext.Provider>
  );
}

type MagneticDockProps = {
  className?: string;
};

const dockShellClass = "flex w-full justify-center sm:w-auto sm:justify-end";

export default function MagneticDock({ className }: MagneticDockProps) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <div className={cn(dockShellClass, className)}>
        <StaticDock />
      </div>
    );
  }
  return (
    <div className={cn(dockShellClass, className)}>
      <MagneticDockInner />
    </div>
  );
}
