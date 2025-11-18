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
  verticalListSortingStrategy,
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
    if (id in data.tasks) {
      return data.tasks[id].columnId;
    }
    return null;
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    setActiveType(active.id.startsWith("task-") ? "task" : "column");
  };

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

    // Check if dragging a column
    if (activeIdStr.startsWith("column-")) {
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

    // Existing card drag logic (moving/reordering tasks)
    const activeContainer = findContainer(activeIdStr);
    const overId = overIdStr;

    if (activeContainer !== overId) {
      // Moving between columns
      const activeItems = data.columns[activeContainer]?.tasks || [];
      const overItems = data.columns[overId]?.tasks || [];

      const activeIndex = activeItems.indexOf(activeIdStr);
      const overIndex = overItems.indexOf(overIdStr);

      let newIndex;
      if (overItems.includes(activeIdStr)) {
        newIndex = overItems.indexOf(activeIdStr);
      } else {
        const isBelowLastItem =
          over && overItems.length > 0 && overIndex === overItems.length - 1;

        newIndex = isBelowLastItem ? overItems.length : overIndex;
      }

      setData((prev) => {
        const newTasks = { ...prev.tasks };
        newTasks[activeIdStr].columnId = overId;

        const newColumns = {
          ...prev.columns,
          [activeContainer]: {
            ...prev.columns[activeContainer],
            tasks: activeItems.filter((item) => item !== activeIdStr),
          },
          [overId]: {
            ...prev.columns[overId],
            tasks: [
              ...overItems.slice(0, newIndex),
              activeIdStr,
              ...overItems.slice(newIndex),
            ],
          },
        };

        return { ...prev, tasks: newTasks, columns: newColumns };
      });
    } else {
      // Reordering within the same column
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
    }

    setActiveId(null);
    setActiveType(null);
  };

  const columnItems = data.columnOrder; // Array of column IDs for horizontal sorting

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
            // Simple ghost column overlay
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
