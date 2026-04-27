import { cn } from "@/lib/utils";
import { AnimatePresence, motion, type TargetAndTransition, type Variants } from "framer-motion";
import type { ElementType, JSX } from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

type PresetType = "blur" | "shake" | "scale" | "fade" | "slide";

type TextEffectProps = {
  children: string;
  per?: "word" | "char" | "line";
  as?: keyof JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  trigger?: boolean;
  /** When true, the full enter animation runs again after exit, with `loopPauseMs` between cycles. */
  loop?: boolean;
  /** Pause (ms) after exit finishes before the next enter. Default 1800. */
  loopPauseMs?: number;
  onAnimationComplete?: () => void;
  segmentWrapperClassName?: string;
};

const defaultStaggerTimes: Record<"char" | "word" | "line", number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  exit: { opacity: 0 },
};

const presetVariants: Record<PresetType, { container: Variants; item: Variants }> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(12px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
      exit: { opacity: 0, filter: "blur(12px)" },
    },
  },
  shake: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 0 },
      visible: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.5 } },
      exit: { x: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
};

const AnimationComponent = memo(function AnimationComponent({
  segment,
  variants,
  per,
  segmentWrapperClassName,
}: {
  segment: string;
  variants: Variants;
  per: "line" | "word" | "char";
  segmentWrapperClassName?: string;
}) {
  const content =
    per === "line" ? (
      <motion.span variants={variants} className="block">
        {segment}
      </motion.span>
    ) : per === "word" ? (
      <motion.span aria-hidden="true" variants={variants} className="inline-block whitespace-pre">
        {segment}
      </motion.span>
    ) : (
      <span className="inline-block whitespace-pre">
        {segment.split("").map((char, charIndex) => (
          <motion.span
            key={`char-${charIndex}-${char}`}
            aria-hidden="true"
            variants={variants}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </span>
    );

  if (!segmentWrapperClassName) {
    return content;
  }

  const defaultWrapperClassName = per === "line" ? "block" : "inline-block";

  return <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>{content}</span>;
});

function motionTagFor(as: keyof JSX.IntrinsicElements): ElementType {
  const tag = (motion as unknown as Record<string, ElementType>)[as];
  return tag ?? motion.div;
}

export function TextEffect({
  children,
  per = "word",
  as = "p",
  variants,
  className,
  preset,
  delay = 0,
  trigger = true,
  loop = false,
  loopPauseMs = 1800,
  onAnimationComplete,
  segmentWrapperClassName,
}: TextEffectProps) {
  const [play, setPlay] = useState(true);
  const enterScheduleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopRestartRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  onAnimationCompleteRef.current = onAnimationComplete;

  const segments: string[] = useMemo(() => {
    if (per === "line") {
      return children.split("\n");
    }
    if (per === "word") {
      return children.split(/(\s+)/);
    }
    return children.split("");
  }, [children, per]);

  const MotionTag = motionTagFor(as);
  const selectedVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };
  const containerVariants = variants?.container ?? selectedVariants.container;
  const itemVariants = variants?.item ?? selectedVariants.item;
  const ariaLabel = per === "line" ? undefined : children;

  const stagger = defaultStaggerTimes[per];

  const delayedContainerVariants: Variants = {
    hidden: containerVariants.hidden,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...(containerVariants.visible as TargetAndTransition | undefined)?.transition,
        staggerChildren:
          (containerVariants.visible as TargetAndTransition | undefined)?.transition
            ?.staggerChildren ?? stagger,
        delayChildren: delay,
      },
    },
    exit: containerVariants.exit,
  };

  const visible = trigger && (loop ? play : true);

  useEffect(() => {
    if (!loop || !visible) {
      return;
    }
    const staggerT = defaultStaggerTimes[per];
    const itemSettleS = 0.45;
    const totalS = delay + Math.max(0, segments.length - 1) * staggerT + itemSettleS;
    const ms = Math.max(0, Math.round(totalS * 1000));
    enterScheduleRef.current = setTimeout(() => {
      onAnimationCompleteRef.current?.();
      setPlay(false);
    }, ms);
    return () => {
      if (enterScheduleRef.current) {
        clearTimeout(enterScheduleRef.current);
        enterScheduleRef.current = null;
      }
    };
  }, [loop, visible, per, delay, segments.length]);

  const handleExitComplete = useCallback(() => {
    if (!loop) {
      return;
    }
    if (loopRestartRef.current) {
      clearTimeout(loopRestartRef.current);
    }
    loopRestartRef.current = setTimeout(() => {
      setPlay(true);
    }, loopPauseMs);
  }, [loop, loopPauseMs]);

  useEffect(
    () => () => {
      if (loopRestartRef.current) {
        clearTimeout(loopRestartRef.current);
        loopRestartRef.current = null;
      }
    },
    [],
  );

  return (
    <AnimatePresence mode="popLayout" onExitComplete={handleExitComplete}>
      {visible ? (
        <MotionTag
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-label={ariaLabel}
          variants={delayedContainerVariants}
          className={cn("whitespace-pre-wrap", className)}
          onAnimationComplete={!loop ? onAnimationComplete : undefined}
        >
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}-${segment.length}`}
              segment={segment}
              variants={itemVariants}
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
            />
          ))}
        </MotionTag>
      ) : null}
    </AnimatePresence>
  );
}
