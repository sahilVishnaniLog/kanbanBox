// KanbanInitialData.js
// This file provides initial dummy data for the Kanban board.
// It includes resolved user objects via findUser and can be extended for date-based logic.

const UserData = [
  {
    uid: "Uid-ofOmar",
    name: "Omar",
    photoUrl:
      "https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    role: "Developer",
  },
  {
    uid: "UID-ofJohn",
    name: "John",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop",
    role: "Designer",
  },
  {
    uid: "Uid-ofNadia",
    name: "Nadia",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&auto=format&fit=crop",
    role: "Manager",
  },
  {
    uid: "Uid-ofAlice",
    name: "Alice",
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop",
    role: "Developer",
  },
  {
    uid: "Uid-ofBob",
    name: "Bob",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop",
    role: "Tester",
  },
];

const findUser = (uid) => {
  return UserData?.find((user) => user.uid === uid);
};

const DummUserDefault = {
  uid: "Uid-ofOmar",
  name: "Omar",
  photoUrl:
    "https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  role: "Developer",
};

// Dummy task data for subtask references (simplified)
const findTask = (taskId) => ({ id: taskId });

// Constants for IDs (using strings for simplicity)
const C1 = "list-complete";
const C2 = "list-in-progress";
const C3 = "list-to-do";
const C4 = "list-misc";

const T1 = "task-1";
const T2 = "task-2";
const T3 = "task-3";
const T4 = "task-4";
const T5 = "task-5";
const T6 = "task-6";
const T7 = "task-7";
const T8 = "task-8";
const T9 = "task-9";
const T10 = "task-10";
const T11 = "task-11";
const T12 = "task-12";
const T13 = "task-13";

export const kanbanBoardList = [
  {
    id: C1,
    title: "Complete",
    chipColor: "success",
    tasks: [
      {
        id: T1,
        title: "FLOWCHARTS",
        status: "Ready",
        workType: "Request", // possible values: Request, Task, Story, Feature, Bug
        author: findUser("Uid-ofOmar") || DummUserDefault, // (assignee)
        assignedTo: ["Uid-ofOmar", "UID-ofJohn", "Uid-ofNadia"],
        projectId: "MBA-1",
        contributors: ["Uid-ofOmar", "UID-ofJohn", "Uid-ofNadia"],
        priority: "High", // possible values: 'Highest', 'High', 'Medium', 'Low', 'Lowest'
        dueDate: "2025-11-30",
        subTasks: [
          {
            subTask1: findTask(T4).id,
            subTask2: findTask(T5).id,
            subTask3: findTask(T6).id,
          },
        ],
        description: "first test for the card",
      },
      {
        id: T2,
        title: "FLOWCHARTS",
        status: "Dormant",
        workType: "Task",
        author: findUser("UID-ofJohn") || DummUserDefault,
        assignedTo: ["UID-ofJohn", "Uid-ofAlice"],
        projectId: "MBA-1",
        contributors: ["UID-ofJohn", "Uid-ofAlice", "Uid-ofBob"],
        priority: "Medium",
        dueDate: "2025-12-15",
        subTasks: [
          {
            subTask1: findTask(T7).id,
            subTask2: findTask(T8).id,
          },
        ],
        description: "first test for the card",
      },
      {
        id: T3,
        title: "FLOWCHARTS",
        status: "Active",
        workType: "Story",
        author: findUser("Uid-ofNadia") || DummUserDefault,
        assignedTo: ["Uid-ofNadia"],
        projectId: "MBA-1",
        contributors: ["Uid-ofNadia"],
        priority: "Low",
        dueDate: "2025-11-25",
        subTasks: [],
        description: "first test for the card",
      },

      {
        id: T4,
        title: "FLOWCHARTS",
        status: "Inactive",
        workType: "Bug",
        author: findUser("Uid-ofAlice") || DummUserDefault,
        assignedTo: ["Uid-ofAlice", "Uid-ofOmar"],
        projectId: "MBA-1",
        contributors: ["Uid-ofAlice", "Uid-ofOmar"],
        priority: "Highest",
        dueDate: "2025-11-20",
        subTasks: [
          {
            subTask1: findTask(T9).id,
          },
        ],
        description: "first test for the card",
      },
    ],
  },
  {
    id: C2,
    title: "In Progress",
    chipColor: "error",
    tasks: [
      {
        id: T5,
        title: "FLOWCHARTS",
        status: "Ready",
        workType: "Feature",
        author: findUser("Uid-ofOmar") || DummUserDefault,
        assignedTo: ["Uid-ofOmar", "Uid-ofNadia"],
        projectId: "MBA-1",
        contributors: ["Uid-ofOmar", "Uid-ofNadia", "UID-ofJohn"],
        priority: "High",
        dueDate: "2025-12-10",
        subTasks: [
          {
            subTask1: findTask(T10).id,
            subTask2: findTask(T11).id,
          },
        ],
        description: "first test for the card",
      },
      {
        id: T6,
        title: "FLOWCHARTS",
        status: "Dormant",
        workType: "Request",
        author: findUser("UID-ofJohn") || DummUserDefault,
        assignedTo: ["UID-ofJohn"],
        projectId: "MBA-1",
        contributors: ["UID-ofJohn"],
        priority: "Medium",
        dueDate: "2025-12-05",
        subTasks: [],
        description: "first test for the card",
      },
      {
        id: T7,
        title: "FLOWCHARTS",
        status: "Active",
        workType: "Task",
        author: findUser("Uid-ofAlice") || DummUserDefault,
        assignedTo: ["Uid-ofAlice", "Uid-ofBob"],
        projectId: "MBA-1",
        contributors: ["Uid-ofAlice", "Uid-ofBob"],
        priority: "Low",
        dueDate: "2025-11-28",
        subTasks: [
          {
            subTask1: findTask(T12).id,
          },
        ],
        description: "first test for the card",
      },
    ],
  },

  {
    id: C3,
    title: "To Do",
    chipColor: "disabled",
    tasks: [
      {
        id: T8,
        title: "FLOWCHARTS",
        status: "Ready",
        workType: "Story",
        author: findUser("Uid-ofNadia") || DummUserDefault,
        assignedTo: ["Uid-ofNadia", "Uid-ofOmar"],
        projectId: "MBA-1",
        contributors: ["Uid-ofNadia", "Uid-ofOmar"],
        priority: "Medium",
        dueDate: "2025-12-20",
        subTasks: [
          {
            subTask1: findTask(T1).id,
          },
        ],
        description: "first test for the card",
      },
      {
        id: T9,
        title: "FLOWCHARTS",
        status: "Inactive",
        workType: "Bug",
        author: findUser("Uid-ofBob") || DummUserDefault,
        assignedTo: ["Uid-ofBob"],
        projectId: "MBA-1",
        contributors: ["Uid-ofBob"],
        priority: "Low",
        dueDate: "2025-11-30",
        subTasks: [],
        description: "first test for the card",
      },
      {
        id: T10,
        title: "FLOWCHARTS",
        status: "Dormant",
        workType: "Feature",
        author: findUser("Uid-ofAlice") || DummUserDefault,
        assignedTo: ["Uid-ofAlice", "UID-ofJohn"],
        projectId: "MBA-1",
        contributors: ["Uid-ofAlice", "UID-ofJohn"],
        priority: "High",
        dueDate: "2025-12-01",
        subTasks: [
          {
            subTask1: findTask(T2).id,
            subTask2: findTask(T3).id,
          },
        ],
        description: "first test for the card",
      },
    ],
  },
  {
    id: C4,
    title: "Misc",
    chipColor: "disabled",
    tasks: [
      {
        id: T11,
        title: "FLOWCHARTS",
        status: "Active",
        workType: "Task",
        author: findUser("Uid-ofOmar") || DummUserDefault,
        assignedTo: ["Uid-ofOmar"],
        projectId: "MBA-1",
        contributors: ["Uid-ofOmar"],
        priority: "Lowest",
        dueDate: "2025-12-31",
        subTasks: [],
        description: "first test for the card",
      },
      {
        id: T12,
        title: "FLOWCHARTS",
        status: "Ready",
        workType: "Request",
        author: findUser("UID-ofJohn") || DummUserDefault,
        assignedTo: ["UID-ofJohn", "Uid-ofNadia"],
        projectId: "MBA-1",
        contributors: ["UID-ofJohn", "Uid-ofNadia"],
        priority: "Medium",
        dueDate: "2025-11-25",
        subTasks: [
          {
            subTask1: findTask(T5).id,
          },
        ],
        description: "first test for the card",
      },
      {
        id: T13, // Reusing T1 for demo purposes, but in real app, ensure uniqueness
        title: "FLOWCHARTS",
        status: "Inactive",
        workType: "Story",
        author: findUser("Uid-ofBob") || DummUserDefault,
        assignedTo: ["Uid-ofBob"],
        projectId: "MBA-1",
        contributors: ["Uid-ofBob"],
        priority: "High",
        dueDate: "2025-12-15",
        subTasks: [
          {
            subTask1: findTask(T6).id,
            subTask2: findTask(T7).id,
          },
        ],
        description: "first test for the card",
      },
    ],
  },
];

// Optional: Add date-based flags (e.g., for current date 2025-11-20)
const addDateFlags = (lists) => {
  const currentDate = new Date("2025-11-20");
  lists.forEach((list) => {
    list.tasks.forEach((task) => {
      if (task.dueDate) {
        const due = new Date(task.dueDate);
        if (due < currentDate) {
          task.isOverdue = true;
        } else if (due.toDateString() === currentDate.toDateString()) {
          task.isDueToday = true;
        }
      }
    });
  });
  return lists;
};

// Apply flags to the data (Task T4 in Complete list is due today)
export const KanbanBoardListsWithFlags = addDateFlags([...kanbanBoardList]);

export default kanbanBoardList; // Export the base lists too, without flags
