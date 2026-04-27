import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, type PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardData {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface MorphingCardStackProps {
  cards: CardData[];
  className?: string;
  autoAdvanceMs?: number;
  onCardClick?: (card: CardData) => void;
}

const SWIPE_THRESHOLD = 50;

export function MorphingCardStack({
  cards,
  className,
  autoAdvanceMs = 3800,
  onCardClick,
}: MorphingCardStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (cards.length <= 1 || isPaused || isDragging || autoAdvanceMs <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, autoAdvanceMs);

    return () => window.clearInterval(timer);
  }, [autoAdvanceMs, cards.length, isDragging, isPaused]);

  if (!cards.length) {
    return null;
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) * velocity.x;

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }

    setIsDragging(false);
  };

  const stackedCards = Array.from({ length: cards.length }, (_, i) => {
    const index = (activeIndex + i) % cards.length;
    return { ...cards[index], stackPosition: i };
  }).reverse();

  return (
    <div
      className={cn("space-y-3", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between px-1">
        <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-300">
          Live workflow
        </span>
        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Drag cards
        </span>
      </div>

      <LayoutGroup>
        <motion.div layout className="relative mx-auto h-[230px] w-[230px] sm:h-[260px] sm:w-[260px]">
          <AnimatePresence mode="popLayout">
            {stackedCards.map((card) => {
              const isTopCard = card.stackPosition === 0;
              const top = card.stackPosition * 8;
              const left = card.stackPosition * 7;
              const rotate = (card.stackPosition - 1) * 2;

              return (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{
                    opacity: 1,
                    scale: isTopCard ? 1 : 0.96 - card.stackPosition * 0.02,
                    x: 0,
                    top,
                    left,
                    rotate,
                    zIndex: cards.length - card.stackPosition,
                  }}
                  exit={{ opacity: 0, scale: 0.86, x: -140 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.65}
                  onDragStart={() => {
                    setIsDragging(true);
                    setIsPaused(true);
                  }}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                  onClick={() => {
                    if (!isDragging) {
                      onCardClick?.(card);
                    }
                  }}
                  className={cn(
                    "absolute h-[170px] w-[205px] cursor-pointer rounded-2xl border border-white/10 bg-[#111111] p-4 text-white shadow-[0_18px_45px_rgba(0,0,0,0.42)] transition-colors duration-300 sm:h-[190px] sm:w-[230px]",
                    "hover:border-red-400/40 hover:shadow-[0_0_25px_rgba(248,113,113,0.12)]",
                    isTopCard && "cursor-grab ring-2 ring-red-400/40 shadow-[0_0_35px_rgba(248,113,113,0.18)] active:cursor-grabbing",
                  )}
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-start gap-3">
                      {card.icon ? (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300">
                          {card.icon}
                        </div>
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold leading-snug text-white sm:text-base">
                          {card.title}
                        </h3>
                        <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        CallBay handles this
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(248,113,113,0.55)]" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {cards.length > 1 ? (
        <div className="flex justify-center gap-1.5">
          {cards.map((card, index) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === activeIndex ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
              aria-label={`Show ${card.title}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
