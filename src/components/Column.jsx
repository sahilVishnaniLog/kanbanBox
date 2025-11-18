import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import { GripVertical } from "lucide-react"; // Optional: Drag handle icon
import { Card } from "./Card";

export const Column = ({ id, title, tasks = [], data }) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({ id });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Combine refs for sortable and droppable
  const setRef = (el) => {
    setSortableRef(el);
    setDroppableRef(el);
  };

  return (
    <Paper
      ref={setRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        minHeight: 400,
        width: 300,
        p: 2,
        mx: 1,
        backgroundColor: (theme) => theme.palette.grey[50],
        cursor: "grab",
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <IconButton size="small" {...listeners} sx={{ cursor: "grab" }}>
          <GripVertical size={20} />
        </IconButton>
      </Box>
      <SortableContext
        id={id}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <Box>
          {tasks.map((taskId) => (
            <Card key={taskId} id={taskId} title={data.tasks[taskId].title} />
          ))}
        </Box>
      </SortableContext>
    </Paper>
  );
};
