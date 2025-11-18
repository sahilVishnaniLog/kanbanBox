export const initialData = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Take out the trash",
      columnId: "column-1",
    },
    "task-2": { id: "task-2", title: "Finish tutorial", columnId: "column-1" },
    "task-3": { id: "task-3", title: "Review code", columnId: "column-2" },
    "task-4": { id: "task-4", title: "Deploy app", columnId: "column-2" },
    "task-5": {
      id: "task-5",
      title: "Celebrate success",
      columnId: "column-3",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      tasks: ["task-1", "task-2"], // Add task IDs per column
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      tasks: ["task-3", "task-4"],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      tasks: ["task-5"],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};
