import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import { SortableContext } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { Card } from "./Card";
import { initialData } from "../data/initialData";

const Board = () => {
  const [data, setData] = useState(initialData);
  const [activeId, setActiveId] = useState(null);
  const [activeType, setActiveType] = useState(null); // 'task' or 'column'

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id) => {
    if (id.startsWith("column-")) {
      return id;
    }
    return data.tasks[id]?.columnId;
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    setActiveType(active.id.startsWith("task-") ? "task" : "column");
  };

  // NEW FUNCTION: Add a new task
  const handleAddTask = (columnId, title) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      title,
      columnId,
    };

    setData((prev) => {
      const newTasks = {
        ...prev.tasks,
        [newTaskId]: newTask,
      };
      const newColumns = {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          tasks: [...prev.columns[columnId].tasks, newTaskId],
        },
      };
      return { ...prev, tasks: newTasks, columns: newColumns };
    });
  };

  // NEW FUNCTION: Delete a task
  const handleDeleteTask = (taskId) => {
    setData((prev) => {
      const newTasks = { ...prev.tasks };
      const columnId = newTasks[taskId].columnId;
      delete newTasks[taskId];

      const newColumns = {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          tasks: prev.columns[columnId].tasks.filter((id) => id !== taskId),
        },
      };

      return { ...prev, tasks: newTasks, columns: newColumns };
    });
  };

  // REFACTORED: handleDragEnd to fix the bug
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveType(null);
      return;
    }

    const activeIdStr = active.id;
    const overIdStr = over.id;

    if (activeIdStr === overIdStr) {
      setActiveId(null);
      setActiveType(null);
      return;
    }

    // Handle Column Dragging
    if (activeType === "column") {
      const oldIndex = data.columnOrder.indexOf(activeIdStr);
      const newIndex = data.columnOrder.indexOf(overIdStr);

      if (oldIndex !== newIndex) {
        setData((prev) => ({
          ...prev,
          columnOrder: arrayMove(prev.columnOrder, oldIndex, newIndex),
        }));
      }
      setActiveId(null);
      setActiveType(null);
      return;
    }

    // Handle Task Dragging
    if (activeType === "task") {
      const activeContainer = findContainer(activeIdStr);
      const overContainer = findContainer(overIdStr);

      if (!activeContainer || !overContainer) {
        setActiveId(null);
        setActiveType(null);
        return;
      }

      if (activeContainer === overContainer) {
        // --- Reordering within the SAME column ---
        const columnItems = data.columns[activeContainer]?.tasks || [];
        const oldIndex = columnItems.indexOf(activeIdStr);
        const newIndex = columnItems.indexOf(overIdStr);

        if (oldIndex !== newIndex) {
          setData((prev) => ({
            ...prev,
            columns: {
              ...prev.columns,
              [activeContainer]: {
                ...prev.columns[activeContainer],
                tasks: arrayMove(columnItems, oldIndex, newIndex),
              },
            },
          }));
        }
      } else {
        // --- Moving between DIFFERENT columns ---
        const activeItems = data.columns[activeContainer]?.tasks || [];
        const overItems = data.columns[overContainer]?.tasks || [];

        const activeIndex = activeItems.indexOf(activeIdStr);

        // Find index to insert at
        let newIndex;
        if (overIdStr.startsWith("task-")) {
          // Dropped on a task
          newIndex = overItems.indexOf(overIdStr);
        } else {
          // Dropped on the column (or empty space)
          newIndex = overItems.length; // Add to the end
        }

        setData((prev) => {
          // 1. Remove from old column
          const newActiveTasks = activeItems.filter((id) => id !== activeIdStr);

          // 2. Add to new column
          const newOverTasks = [
            ...overItems.slice(0, newIndex),
            activeIdStr,
            ...overItems.slice(newIndex),
          ];

          // 3. Update the task's parent column ID
          const newTasks = { ...prev.tasks };
          newTasks[activeIdStr].columnId = overContainer;

          return {
            ...prev,
            tasks: newTasks,
            columns: {
              ...prev.columns,
              [activeContainer]: {
                ...prev.columns[activeContainer],
                tasks: newActiveTasks,
              },
              [overContainer]: {
                ...prev.columns[overContainer],
                tasks: newOverTasks,
              },
            },
          };
        });
      }
    }

    setActiveId(null);
    setActiveType(null);
  };

  const columnItems = data.columnOrder;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Kanban Board
        </Typography>
        <Grid container justifyContent="center" spacing={2}>
          <SortableContext
            items={columnItems}
            strategy={horizontalListSortingStrategy}
          >
            {columnItems.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.tasks || [];
              return (
                <Grid item key={columnId}>
                  <Column
                    id={columnId}
                    title={column.title}
                    tasks={tasks}
                    data={data}
                    onAddTask={handleAddTask}
                    onDeleteTask={handleDeleteTask}
                  />
                </Grid>
              );
            })}
          </SortableContext>
        </Grid>
        <DragOverlay>
          {activeType === "task" && activeId ? (
            <Card id={activeId} title={data.tasks[activeId]?.title} />
          ) : activeType === "column" && activeId ? (
            <Paper
              sx={{
                minHeight: 400,
                width: 300,
                p: 2,
                backgroundColor: (theme) => theme.palette.grey[100],
                opacity: 0.8,
              }}
            >
              <Typography variant="h5" align="center">
                {data.columns[activeId]?.title}
              </Typography>
              <Box sx={{ mt: 2, fontStyle: "italic", color: "grey.600" }}>
                (Dragging column...)
              </Box>
            </Paper>
          ) : null}
        </DragOverlay>
      </Container>
    </DndContext>
  );
};
export default Board;