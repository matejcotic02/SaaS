import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, Link as LinkIcon, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

const getStatusStyles = (status: TimelineItem["status"]): string => {
  switch (status) {
    case "completed":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
    case "in-progress":
      return "bg-primary/15 text-primary border-primary/25";
    case "pending":
      return "bg-white/5 text-muted-foreground border-white/10";
  }
};

const statusLabel = (status: TimelineItem["status"]): string => {
  switch (status) {
    case "completed":
      return "COMPLETE";
    case "in-progress":
      return "IN PROGRESS";
    case "pending":
      return "PENDING";
  }
};

function MobileTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="relative mx-auto max-w-sm space-y-0">
      {timelineData.map((item, i) => {
        const Icon = item.icon;
        const isExpanded = expandedId === item.id;
        const isLast = i === timelineData.length - 1;

        return (
          <div key={item.id} className="relative flex gap-4">
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  setExpandedId(isExpanded ? null : item.id)
                }
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isExpanded
                    ? "border-primary bg-primary/20 text-primary shadow-lg shadow-red-400/30 scale-110"
                    : "border-white/[0.15] bg-card text-foreground hover:border-primary/40"
                }`}
              >
                <Icon size={16} />
              </button>
              {!isLast && (
                <div className="h-full w-px bg-white/[0.08]" />
              )}
            </div>

            <div className="min-w-0 flex-1 pb-8">
              <button
                type="button"
                onClick={() =>
                  setExpandedId(isExpanded ? null : item.id)
                }
                className="mb-1 flex items-center gap-2 text-left"
              >
                <span className="text-sm font-semibold text-foreground">
                  {item.title}
                </span>
                <Badge
                  className={`px-1.5 py-0 text-[9px] ${getStatusStyles(item.status)}`}
                >
                  {statusLabel(item.status)}
                </Badge>
              </button>

              {isExpanded ? (
                <Card className="mt-2 border-primary/30 bg-card/95 shadow-xl shadow-red-500/10 backdrop-blur-lg">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        className={`px-2 text-[10px] ${getStatusStyles(item.status)}`}
                      >
                        {statusLabel(item.status)}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {item.date}
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-sm">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                    <p>{item.content}</p>

                    <div className="mt-4 border-t border-white/10 pt-3">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="flex items-center">
                          <Zap size={10} className="mr-1" />
                          Automation Impact
                        </span>
                        <span className="font-mono">{item.energy}%</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                          style={{ width: `${item.energy}%` }}
                        />
                      </div>
                    </div>

                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 border-t border-white/10 pt-3">
                        <div className="mb-2 flex items-center">
                          <LinkIcon
                            size={10}
                            className="mr-1 text-muted-foreground"
                          />
                          <h4 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            Connected Steps
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relatedId) => {
                            const related = timelineData.find(
                              (t) => t.id === relatedId,
                            );
                            return (
                              <Button
                                key={relatedId}
                                variant="outline"
                                size="sm"
                                className="h-6 rounded-md border-white/20 bg-transparent px-2 py-0 text-[10px] text-muted-foreground hover:bg-white/10 hover:text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedId(relatedId);
                                }}
                              >
                                {related?.title}
                                <ArrowRight size={8} className="ml-1 text-muted-foreground" />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {},
  );
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");

  const orbitRadius = isMd ? 200 : 130;
  const nodeSize = isMd ? 10 : 9;

  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === containerRef.current || e.target === orbitRef.current) {
        setExpandedItems({});
        setActiveNodeId(null);
        setPulseEffect({});
        setAutoRotate(true);
      }
    },
    [],
  );

  const getRelatedItems = useCallback(
    (itemId: number): number[] => {
      const currentItem = timelineData.find((item) => item.id === itemId);
      return currentItem ? currentItem.relatedIds : [];
    },
    [timelineData],
  );

  const centerViewOnNode = useCallback(
    (nodeId: number) => {
      const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
      const totalNodes = timelineData.length;
      const targetAngle = (nodeIndex / totalNodes) * 360;
      setRotationAngle(270 - targetAngle);
    },
    [timelineData],
  );

  const toggleItem = useCallback(
    (id: number) => {
      setExpandedItems((prev) => {
        const newState: Record<number, boolean> = {};
        const willExpand = !prev[id];
        newState[id] = willExpand;

        if (willExpand) {
          setActiveNodeId(id);
          setAutoRotate(false);
          const related = getRelatedItems(id);
          const newPulse: Record<number, boolean> = {};
          related.forEach((relId) => {
            newPulse[relId] = true;
          });
          setPulseEffect(newPulse);
          centerViewOnNode(id);
        } else {
          setActiveNodeId(null);
          setAutoRotate(true);
          setPulseEffect({});
        }

        return newState;
      });
    },
    [getRelatedItems, centerViewOnNode],
  );

  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);
    return () => clearInterval(timer);
  }, [autoRotate]);

  const calculateNodePosition = useCallback(
    (index: number, total: number) => {
      const angle = ((index / total) * 360 + rotationAngle) % 360;
      const radian = (angle * Math.PI) / 180;
      const x = orbitRadius * Math.cos(radian);
      const y = orbitRadius * Math.sin(radian);
      const zIndex = Math.round(100 + 50 * Math.cos(radian));
      const opacity = Math.max(
        0.4,
        Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)),
      );
      return { x, y, angle, zIndex, opacity };
    },
    [rotationAngle, orbitRadius],
  );

  const isRelatedToActive = useCallback(
    (itemId: number): boolean => {
      if (!activeNodeId) return false;
      return getRelatedItems(activeNodeId).includes(itemId);
    },
    [activeNodeId, getRelatedItems],
  );

  if (!isSm) {
    return <MobileTimeline timelineData={timelineData} />;
  }

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden"
      style={{ minHeight: isMd ? 760 : 600 }}
      ref={containerRef}
      onClick={handleContainerClick}
      onMouseEnter={() => {
        if (!activeNodeId) setAutoRotate(false);
      }}
      onMouseLeave={() => {
        if (!activeNodeId) setAutoRotate(true);
      }}
    >
      <div className="relative flex h-full w-full max-w-4xl items-center justify-center">
        <div
          className="absolute flex h-full w-full items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Center orb */}
          <div className="absolute z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-red-600 shadow-[0_0_40px_rgba(248,113,113,0.3)]">
            <div className="absolute h-20 w-20 animate-ping rounded-full border border-red-400/20 opacity-70" />
            <div
              className="absolute h-24 w-24 animate-ping rounded-full border border-red-400/10 opacity-50"
              style={{ animationDelay: "0.5s" }}
            />
            <div className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-md" />
          </div>

          {/* Orbit ring */}
          <div
            className="absolute rounded-full border border-white/[0.08]"
            style={{
              width: orbitRadius * 2,
              height: orbitRadius * 2,
            }}
          />

          {/* Nodes */}
          {timelineData.map((item, index) => {
            const position = calculateNodePosition(
              index,
              timelineData.length,
            );
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute cursor-pointer transition-all duration-700"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                {/* Energy / glow halo */}
                <div
                  className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(248,113,113,0.15) 0%, rgba(248,113,113,0) 70%)",
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                />

                {/* Node circle */}
                <div
                  className={`flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isExpanded
                      ? "border-primary bg-primary/20 text-primary shadow-lg shadow-red-400/30 scale-150"
                      : isRelated
                        ? "animate-pulse border-primary/60 bg-card text-primary"
                        : "border-white/[0.15] bg-card text-foreground hover:border-primary/40"
                  }`}
                  style={{
                    width: `${nodeSize * 4}px`,
                    height: `${nodeSize * 4}px`,
                  }}
                >
                  <Icon size={nodeSize * 1.6} />
                </div>

                {/* Label */}
                <div
                  className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${
                    isExpanded
                      ? "scale-110 text-foreground"
                      : "text-foreground/70"
                  }`}
                  style={{ left: "50%", transform: "translateX(-50%)" }}
                >
                  {item.title}
                </div>

                {/* Expanded detail card */}
                {isExpanded && (
                  <Card className="absolute left-1/2 top-20 z-50 w-64 -translate-x-1/2 overflow-visible border-primary/30 bg-card/95 shadow-xl shadow-red-500/10 backdrop-blur-lg">
                    <div className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2 bg-primary/40" />
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          className={`px-2 text-[10px] ${getStatusStyles(item.status)}`}
                        >
                          {statusLabel(item.status)}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="mt-2 text-sm">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
                      <p>{item.content}</p>

                      <div className="mt-4 border-t border-white/10 pt-3">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="flex items-center">
                            <Zap size={10} className="mr-1" />
                            Automation Impact
                          </span>
                          <span className="font-mono">{item.energy}%</span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-400"
                            style={{ width: `${item.energy}%` }}
                          />
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 border-t border-white/10 pt-3">
                          <div className="mb-2 flex items-center">
                            <LinkIcon
                              size={10}
                              className="mr-1 text-muted-foreground"
                            />
                            <h4 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              Connected Steps
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find(
                                (i) => i.id === relatedId,
                              );
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="h-6 rounded-md border-white/20 bg-transparent px-2 py-0 text-[10px] text-muted-foreground hover:bg-white/10 hover:text-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight
                                    size={8}
                                    className="ml-1 text-muted-foreground"
                                  />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
