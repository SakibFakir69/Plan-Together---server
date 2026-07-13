

export enum FamilyTaskCategory {
  HOME = "home",
  SHOPPING = "shopping",
  BILLS = "bills",
  MEALS = "meals",
  HEALTH = "health",
  KIDS = "kids",
  PETS = "pets",
  VEHICLE = "vehicle",
  EVENTS = "events",
  MAINTENANCE = "maintenance",
  FINANCE = "finance",
  OTHER = "other",
}

export enum RecurrenceFrequency {
  NONE = "none",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  CUSTOM = "custom",
}

export enum MemberRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

export enum InvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
  EXPIRED = "expired",
}

export enum InvitationDirection {
  SENT = "sent",
  RECEIVED = "received",
}

export enum ActivityAction {
  TASK_CREATED = "task_created",
  TASK_COMPLETED = "task_completed",
  TASK_ASSIGNED = "task_assigned",
  TASK_DELETED = "task_deleted",
  MEMBER_JOINED = "member_joined",
  MEMBER_LEFT = "member_left",
  SHOPPING_ITEM_ADDED = "shopping_item_added",
  SHOPPING_ITEM_CHECKED = "shopping_item_checked",
  BILL_PAID = "bill_paid",
}

// ---- Workspace ----

export interface WorkspaceMember {
  userId: string;
  name: string;
  avatarUrl?: string;
  role: MemberRole;
  joinedAt?: string; // ISO date, optional until invite accepted
}

export interface FamilyWorkspace {
  _id: string;
  name: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceInvitation {
  _id: string;
  workspaceId: string;
  inviterId: string;
  inviteeEmail?: string;
  inviteeUserId?: string;
  code: string;
  direction: InvitationDirection;
  status: InvitationStatus;
  createdAt: string;
  expiresAt?: string;
}

// ---- Recurrence ----

export interface RecurrenceRule {
  frequency: RecurrenceFrequency;
  interval?: number;
  daysOfWeek?: number[]; // 0 (Sun) - 6 (Sat)
  dayOfMonth?: number;
  endDate?: string;
}

// ---- Task ----

export interface FamilyTask {
  _id: string;
  workspaceId: string;
  title: string;
  description?: string;
  category: FamilyTaskCategory;
  assigneeId?: string;
  createdBy: string;
  dueDate?: string;
  recurrence?: RecurrenceRule;
  nextDueDate?: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  priority?: "low" | "medium" | "high";
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  _id: string;
  taskId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

// ---- Shopping List ----

export interface ShoppingItem {
  _id: string;
  workspaceId: string;
  name: string;
  quantity?: string;
  checked: boolean;
  addedBy: string;
  checkedBy?: string;
  createdAt: string;
}

// ---- Bills & Finance ----

export interface Bill {
  _id: string;
  workspaceId: string;
  name: string; // e.g. "Electricity"
  amount?: number;
  currency?: string;
  dueDate: string;
  recurrence?: RecurrenceRule;
  paid: boolean;
  paidAt?: string;
  paidBy?: string;
  createdAt: string;
}

export interface SavingsGoal {
  _id: string;
  workspaceId: string;
  title: string; // e.g. "Save for vacation"
  targetAmount: number;
  currentAmount: number;
  currency?: string;
  targetDate?: string;
  createdAt: string;
}

// ---- Activity Log ----

export interface ActivityLogEntry {
  _id: string;
  workspaceId: string;
  actorId: string;
  actorName: string;
  action: ActivityAction;
  taskId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// ---- API payloads (create/update DTOs) ----

export interface CreateFamilyTaskInput {
  title: string;
  description?: string;
  category: FamilyTaskCategory;
  assigneeId?: string;
  dueDate?: string;
  recurrence?: RecurrenceRule;
  priority?: FamilyTask["priority"];
}

export interface UpdateFamilyTaskInput extends Partial<CreateFamilyTaskInput> {
  completed?: boolean;
}

export interface CreateFamilyWorkspaceInput {
  name: string;
}

export interface InviteMemberInput {
  workspaceId: string;
  inviteeEmail: string;
}

export interface CreateShoppingItemInput {
  name: string;
  quantity?: string;
}

export interface CreateBillInput {
  name: string;
  amount?: number;
  currency?: string;
  dueDate: string;
  recurrence?: RecurrenceRule;
}

export interface CreateSavingsGoalInput {
  title: string;
  targetAmount: number;
  currency?: string;
  targetDate?: string;
}



