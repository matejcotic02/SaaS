export type StatIconKey =
  | "phone"
  | "calendarCheck"
  | "users"
  | "phoneOutgoing"
  | "messageSquare"
  | "arrowRightLeft";

export type StatItem = {
  id: string;
  label: string;
  value: string;
  change: string;
  icon: StatIconKey;
};

export const mockStats: StatItem[] = [
  {
    id: "calls-today",
    label: "Calls Today",
    value: "24",
    change: "+18% from yesterday",
    icon: "phone",
  },
  {
    id: "bookings-week",
    label: "Bookings This Week",
    value: "18",
    change: "+6 this week",
    icon: "calendarCheck",
  },
  {
    id: "new-leads",
    label: "New Leads",
    value: "42",
    change: "12 need follow-up",
    icon: "users",
  },
  {
    id: "outbound-calls",
    label: "Outbound Calls",
    value: "31",
    change: "9 answered",
    icon: "phoneOutgoing",
  },
  {
    id: "sms-sent",
    label: "SMS Reminders Sent",
    value: "56",
    change: "4 scheduled today",
    icon: "messageSquare",
  },
  {
    id: "transfer-rate",
    label: "Transfer Rate",
    value: "12%",
    change: "Human handoff rate",
    icon: "arrowRightLeft",
  },
];

export type SetupItem = {
  id: string;
  step: number;
  label: string;
  description: string;
  complete: boolean;
  ctaLabel?: string;
  href?: string;
  secondaryNote?: string;
};

export const mockSetupChecklist: SetupItem[] = [
  {
    id: "account",
    step: 1,
    label: "Account created",
    description: "Your CallBay workspace and login are ready.",
    complete: true,
  },
  {
    id: "agent",
    step: 2,
    label: "AI agent configured",
    description: "Your booking agent has the basics it needs to answer calls.",
    complete: true,
    ctaLabel: "Review Agent",
    href: "/agent",
  },
  {
    id: "phone",
    step: 3,
    label: "Phone number assigned",
    description: "Choose the number CallBay will answer and use for customer callbacks.",
    complete: false,
    ctaLabel: "Set Up Phone Number",
    href: "/phone",
    secondaryNote: "Connect this before forwarding live customer calls.",
  },
  {
    id: "hours",
    step: 4,
    label: "Business hours added",
    description: "Set when your team is open so CallBay knows when to book or transfer.",
    complete: false,
    ctaLabel: "Set Hours",
    href: "/appointment-settings",
  },
  {
    id: "services",
    step: 5,
    label: "Services added",
    description: "Add your most common services, prices, and appointment durations.",
    complete: false,
    ctaLabel: "Setup Services",
    href: "/appointment-settings",
  },
  {
    id: "transfer",
    step: 6,
    label: "Transfer phone added",
    description: "Add a human fallback number for calls that need your team.",
    complete: false,
    ctaLabel: "Add Transfer Phone",
    href: "/phone",
  },
  {
    id: "sms",
    step: 7,
    label: "SMS reminders enabled",
    description: "Turn on automated appointment reminders to reduce no-shows.",
    complete: false,
    ctaLabel: "Manage Reminders",
    href: "/reminders",
  },
  {
    id: "billing",
    step: 8,
    label: "Billing active",
    description: "Your Pro plan is active and ready for launch.",
    complete: true,
    ctaLabel: "View Billing",
    href: "/billing",
  },
];

export type AgentStatus = {
  name: string;
  status: "Active" | "Paused" | "Inactive";
  voice: string;
  mode: string;
  lastActivity: string;
  capabilities: string[];
};

export const mockAgentStatus: AgentStatus = {
  name: "CallBay Booking Agent",
  status: "Active",
  voice: "Professional female voice",
  mode: "Inbound booking + lead follow-up",
  lastActivity: "3 minutes ago",
  capabilities: [
    "Answers inbound calls",
    "Checks availability",
    "Books appointments",
    "Follows up with leads",
    "Sends SMS reminders",
    "Transfers to human",
  ],
};

export type CallDirection = "Inbound" | "Outbound";
export type CallOutcome =
  | "Booked"
  | "Follow-up"
  | "Transferred"
  | "No answer"
  | "Voicemail";
export type CallStatus = "Completed" | "Failed" | "In Progress";

export type CallActivityRow = {
  id: string;
  time: string;
  direction: CallDirection;
  customer: string;
  phone: string;
  outcome: CallOutcome;
  duration: string;
  status: CallStatus;
};

export const mockCallActivity: CallActivityRow[] = [
  {
    id: "call-1",
    time: "9:12 AM",
    direction: "Inbound",
    customer: "Sarah M.",
    phone: "+1 (555) 201-8842",
    outcome: "Booked",
    duration: "4m 12s",
    status: "Completed",
  },
  {
    id: "call-2",
    time: "10:05 AM",
    direction: "Outbound",
    customer: "James R.",
    phone: "+1 (555) 744-1930",
    outcome: "Follow-up",
    duration: "2m 48s",
    status: "Completed",
  },
  {
    id: "call-3",
    time: "11:26 AM",
    direction: "Inbound",
    customer: "Alex P.",
    phone: "+1 (555) 482-0021",
    outcome: "Transferred",
    duration: "1m 35s",
    status: "Completed",
  },
  {
    id: "call-4",
    time: "12:14 PM",
    direction: "Outbound",
    customer: "Maria K.",
    phone: "+1 (555) 908-4412",
    outcome: "No answer",
    duration: "0m 22s",
    status: "Failed",
  },
];

export type AppointmentStatus = "Confirmed" | "Pending" | "Cancelled";
export type AppointmentSource = "AI Call" | "Lead Follow-up" | "Manual";

export type AppointmentRow = {
  id: string;
  customer: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  source: AppointmentSource;
};

export const mockAppointments: AppointmentRow[] = [
  {
    id: "appt-1",
    customer: "Sarah M.",
    service: "Window Tint",
    date: "Today",
    time: "2:00 PM",
    status: "Confirmed",
    source: "AI Call",
  },
  {
    id: "appt-2",
    customer: "James R.",
    service: "Ceramic Coating",
    date: "Tomorrow",
    time: "10:30 AM",
    status: "Confirmed",
    source: "Lead Follow-up",
  },
  {
    id: "appt-3",
    customer: "Alex P.",
    service: "Paint Protection Film",
    date: "Friday",
    time: "1:00 PM",
    status: "Pending",
    source: "Manual",
  },
  {
    id: "appt-4",
    customer: "Daniel C.",
    service: "Vehicle Wrap Consult",
    date: "Monday",
    time: "9:30 AM",
    status: "Confirmed",
    source: "AI Call",
  },
];

export type LeadPriorityRow = {
  id: string;
  name: string;
  reason: string;
  action: string;
};

export type LeadSummaryData = {
  stats: { id: string; label: string; value: string }[];
  priority: LeadPriorityRow[];
};

export const mockLeads: LeadSummaryData = {
  stats: [
    { id: "new", label: "New Leads", value: "42" },
    { id: "queued", label: "Queued for Call", value: "16" },
    { id: "booked", label: "Booked From Follow-Up", value: "8" },
    { id: "dnc", label: "Do Not Call", value: "3" },
  ],
  priority: [
    {
      id: "robert",
      name: "Robert J.",
      reason: "Requested quote",
      action: "Call today",
    },
    {
      id: "emily",
      name: "Emily S.",
      reason: "Missed call",
      action: "Follow up",
    },
    {
      id: "mark",
      name: "Mark T.",
      reason: "Interested in ceramic coating",
      action: "Call tomorrow",
    },
  ],
};

export type OutboundCampaign = {
  name: string;
  status: "Ready" | "Paused" | "Running";
  queued: number;
  completed: number;
  answerRate: string;
  bookings: number;
};

export const mockOutboundCampaign: OutboundCampaign = {
  name: "April Lead Follow-Up",
  status: "Paused",
  queued: 16,
  completed: 31,
  answerRate: "29%",
  bookings: 8,
};

export type ReminderStatusData = {
  enabled: boolean;
  reminder24h: boolean;
  reminder2h: boolean;
  weekly: number;
  today: number;
  recentPreview: string;
};

export const mockReminders: ReminderStatusData = {
  enabled: true,
  reminder24h: true,
  reminder2h: false,
  weekly: 56,
  today: 4,
  recentPreview:
    "Hi Sarah, this is a reminder for your Window Tint appointment today at 2:00 PM.",
};

export type UsageData = {
  plan: string;
  status: "Active" | "Past Due" | "Trialing";
  callsUsed: number;
  callsLimit: number;
  smsUsed: number;
  smsLimit: number;
  periodStart: string;
  periodEnd: string;
};

export const mockUsage: UsageData = {
  plan: "Pro",
  status: "Active",
  callsUsed: 248,
  callsLimit: 500,
  smsUsed: 156,
  smsLimit: 500,
  periodStart: "Apr 1",
  periodEnd: "Apr 30",
};

export type ActivityKind =
  | "booking"
  | "outbound"
  | "sms"
  | "lead"
  | "transfer"
  | "settings";

export type ActivityItem = {
  id: string;
  kind: ActivityKind;
  text: string;
  timestamp: string;
};

export const mockActivity: ActivityItem[] = [
  {
    id: "act-1",
    kind: "booking",
    text: "AI booked appointment for Sarah M.",
    timestamp: "2 min ago",
  },
  {
    id: "act-2",
    kind: "outbound",
    text: "Outbound call completed with James R.",
    timestamp: "12 min ago",
  },
  {
    id: "act-3",
    kind: "sms",
    text: "SMS reminder sent to Daniel C.",
    timestamp: "38 min ago",
  },
  {
    id: "act-4",
    kind: "lead",
    text: "Lead Maria K. marked as no answer",
    timestamp: "1 hr ago",
  },
  {
    id: "act-5",
    kind: "transfer",
    text: "Call transferred to human team",
    timestamp: "2 hr ago",
  },
  {
    id: "act-6",
    kind: "settings",
    text: "Business hours updated",
    timestamp: "Yesterday",
  },
];

export type BookingRow = {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: string;
  time: string;
  duration: string;
};

export const mockBookings: BookingRow[] = [
  {
    id: "booking-1",
    customerName: "Matteo Serrano",
    customerPhone: "507-379-4722",
    service: "Window tint - standard film - SUV - 2 windows",
    date: "Jan 26, 2026",
    time: "6:00 PM",
    duration: "60 min",
  },
  {
    id: "booking-2",
    customerName: "Mateo Aigner",
    customerPhone: "507-379-4733",
    service: "Standard film SUV 2 windows",
    date: "Jan 26, 2026",
    time: "3:00 PM",
    duration: "60 min",
  },
];

export type CustomerRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastBookingDate: string;
  bookingCount: number;
};

export const mockCustomers: CustomerRow[] = [
  {
    id: "customer-1",
    name: "Matteo Serrano",
    phone: "507-379-4722",
    email: "matteo@example.com",
    lastBookingDate: "Jan 26, 2026",
    bookingCount: 1,
  },
  {
    id: "customer-2",
    name: "Mateo Aigner",
    phone: "507-379-4733",
    email: "mateo@example.com",
    lastBookingDate: "Jan 26, 2026",
    bookingCount: 1,
  },
];

export type CallRecordingTag = "Transferred" | "Booked";
export type CallRecordingStatus = "Completed";

export type CallRecordingRow = {
  id: string;
  title: string;
  dateTime: string;
  duration: string;
  status: CallRecordingStatus;
  tags: CallRecordingTag[];
  hasTranscript: boolean;
};

export const mockCallRecordings: CallRecordingRow[] = [
  {
    id: "recording-1",
    title: "Conversation",
    dateTime: "11/27/2026, 10:45:26 PM",
    duration: "8:11",
    status: "Completed",
    tags: ["Transferred"],
    hasTranscript: true,
  },
  {
    id: "recording-2",
    title: "Conversation",
    dateTime: "11/27/2026, 5:14:54 PM",
    duration: "0:11",
    status: "Completed",
    tags: ["Transferred"],
    hasTranscript: true,
  },
  {
    id: "recording-3",
    title: "Conversation",
    dateTime: "11/26/2026, 2:51:34 PM",
    duration: "0:08",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-4",
    title: "Conversation",
    dateTime: "11/26/2026, 1:49:03 PM",
    duration: "2:58",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-5",
    title: "Conversation",
    dateTime: "11/27/2026, 4:07:59 PM",
    duration: "2:01",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-6",
    title: "Conversation",
    dateTime: "11/26/2026, 5:21:48 PM",
    duration: "0:00",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-7",
    title: "Conversation",
    dateTime: "11/27/2026, 8:34:30 PM",
    duration: "0:06",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-8",
    title: "Conversation",
    dateTime: "11/26/2026, 6:54:32 PM",
    duration: "0:28",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-9",
    title: "Conversation",
    dateTime: "11/26/2026, 7:37:14 PM",
    duration: "0:26",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-10",
    title: "Conversation",
    dateTime: "11/26/2026, 11:24:12 PM",
    duration: "1:16",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-11",
    title: "Conversation",
    dateTime: "11/26/2026, 7:40:37 PM",
    duration: "0:18",
    status: "Completed",
    tags: ["Transferred"],
    hasTranscript: true,
  },
  {
    id: "recording-12",
    title: "Conversation",
    dateTime: "11/26/2026, 10:34:54 PM",
    duration: "1:17",
    status: "Completed",
    tags: ["Transferred"],
    hasTranscript: true,
  },
  {
    id: "recording-13",
    title: "Conversation",
    dateTime: "11/25/2026, 10:30:00 PM",
    duration: "0:17",
    status: "Completed",
    tags: ["Transferred"],
    hasTranscript: true,
  },
  {
    id: "recording-14",
    title: "Conversation",
    dateTime: "11/26/2026, 5:11:12 PM",
    duration: "1:42",
    status: "Completed",
    tags: ["Booked"],
    hasTranscript: true,
  },
  {
    id: "recording-15",
    title: "Conversation",
    dateTime: "11/26/2026, 8:07:19 PM",
    duration: "1:41",
    status: "Completed",
    tags: ["Booked"],
    hasTranscript: true,
  },
  {
    id: "recording-16",
    title: "Conversation",
    dateTime: "11/26/2026, 8:08:06 PM",
    duration: "1:00",
    status: "Completed",
    tags: ["Booked"],
    hasTranscript: true,
  },
  {
    id: "recording-17",
    title: "Conversation",
    dateTime: "11/26/2026, 8:22:38 PM",
    duration: "1:39",
    status: "Completed",
    tags: ["Booked", "Transferred"],
    hasTranscript: true,
  },
  {
    id: "recording-18",
    title: "Conversation",
    dateTime: "11/26/2026, 10:25:39 PM",
    duration: "0:54",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-19",
    title: "Conversation",
    dateTime: "11/26/2026, 7:41:13 PM",
    duration: "1:23",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-20",
    title: "Conversation",
    dateTime: "11/25/2026, 7:54:19 PM",
    duration: "1:06",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
  {
    id: "recording-21",
    title: "Conversation",
    dateTime: "11/27/2026, 7:32:03 PM",
    duration: "1:06",
    status: "Completed",
    tags: [],
    hasTranscript: true,
  },
];
