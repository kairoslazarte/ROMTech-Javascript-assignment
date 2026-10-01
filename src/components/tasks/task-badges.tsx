import { Badge, type BadgeTone } from "@/components/ui/badge";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/tasks/types";

const statusTones: Record<TaskStatus, BadgeTone> = {
  todo: "neutral",
  in_progress: "info",
  done: "success",
};

const priorityTones: Record<TaskPriority, BadgeTone> = {
  low: "neutral",
  medium: "warning",
  high: "danger",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge tone={statusTones[status]}>{STATUS_LABELS[status]}</Badge>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge tone={priorityTones[priority]}>
      {PRIORITY_LABELS[priority]} priority
    </Badge>
  );
}
