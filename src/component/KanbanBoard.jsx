// KanbanBoard.jsx
import React from "react";
import { KanbanBoardListsWithFlags as KanbanBoardLists } from "./KanbanInitialData.js"; // Now .js
import { workTypeIconMap, PriorityIconMap } from "./KanbanIconMap.jsx"; // Now .js
import { findUser } from "./KanbanInitialData.js"; // Now .js
import {
  SquarePlus,
  ShieldCheck,
  Bookmark,
  Proportions,
  Bug,
  ChevronsUp,
  ChevronUp,
  EqualApproximately,
  ChevronDown,
  ChevronsDown,
} from "lucide-react"; // Icons stay here for rendering

// Map function to return actual icon components (extend if needed)
const getWorkTypeIcon = (workType) => {
  const map = workTypeIconMap(workType);
  switch (workType) {
    case "Request":
      return <SquarePlus size={16} strokeWidth={1} />;
    case "Task":
      return <ShieldCheck size={16} strokeWidth={1} />;
    case "Story":
      return <Bookmark size={16} strokeWidth={1} />;
    case "Feature":
      return <Proportions size={16} strokeWidth={1} />;
    case "Bug":
      return <Bug size={16} strokeWidth={0.75} />;
    default:
      return null;
  }
};

const getPriorityIcon = PriorityIconMap; // Already returns components

const KanbanBoard = () => {
  return (
    <div className="kanban-board" style={{ display: "flex", gap: "1rem" }}>
      {KanbanBoardLists.map((column) => (
        <div
          key={column.id}
          className="column"
          style={{
            width: "300px",
            background: "#f4f4f4",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <h2
            style={{
              color:
                column.chipColor === "success"
                  ? "green"
                  : column.chipColor === "error"
                  ? "red"
                  : "gray",
            }}
          >
            {column.title}
          </h2>
          <div className="tasks">
            {column.tasks.map((task) => {
              const workTypeIcon = getWorkTypeIcon(task.taskType); // Use helper for icon
              const priorityIcon = getPriorityIcon(task.priority);

              return (
                <div
                  key={task.id}
                  className="task-card"
                  style={{
                    background: "white",
                    margin: "0.5rem 0",
                    padding: "1rem",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    borderLeft: task.isDueToday
                      ? "4px solid orange"
                      : task.isOverdue
                      ? "4px solid red"
                      : "none",
                  }}
                >
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>
                    <strong>Status:</strong> {task.status}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <strong>Type:</strong>
                    {workTypeIcon && (
                      <span style={{ color: "#498563" }}>{workTypeIcon}</span>
                    )}
                    {task.taskType}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <strong>Priority:</strong>
                    {priorityIcon && <span>{priorityIcon}</span>}
                    {task.priority}
                  </div>
                  <p>
                    <strong>Due:</strong> {task.dueDate}{" "}
                    {task.isDueToday && "(Today!)"}{" "}
                    {task.isOverdue && "(Overdue!)"}{" "}
                  </p>
                  <p>
                    <strong>Author:</strong> {task.author?.name || "Unknown"}
                  </p>
                  <ul>
                    <strong>Assigned To:</strong>
                    {task.assignedTo.map((uid) => (
                      <li key={uid}>{findUser(uid)?.name || uid}</li>
                    ))}
                  </ul>
                  {task.subTasks.length > 0 && (
                    <details>
                      <summary>Subtasks ({task.subTasks.length})</summary>
                      <ul>
                        {Object.values(task.subTasks[0]).map((subId) => (
                          <li key={subId}>{subId}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
