import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { GripVertical, Plus, X } from "lucide-react"; // Added Plus and X
import { Card } from "./Card";

export const Column = ({
  id,
  title,
  tasks = [],
  data,
  onAddTask,
  onDeleteTask,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

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

  const setRef = (el) => {
    setSortableRef(el);
    setDroppableRef(el);
  };

  const handleAddSubmit = () => {
    if (newCardTitle.trim()) {
      onAddTask(id, newCardTitle.trim());
      setNewCardTitle("");
      setShowAddForm(false);
    }
  };

  return (
    <Paper
      ref={setRef}
      style={style}
      sx={{
        minHeight: 400,
        width: 300,
        p: 2,
        mx: 1,
        backgroundColor: (theme) => theme.palette.grey[50],
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          cursor: "grab",
        }}
      >
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <IconButton size="small" sx={{ cursor: "grab" }}>
          <GripVertical size={20} />
        </IconButton>
      </Box>

      {/* Cards List */}
      <SortableContext
        id={id}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {tasks.map((taskId) => (
            <Card
              key={taskId}
              id={taskId}
              title={data.tasks[taskId].title}
              onDelete={onDeleteTask}
            />
          ))}
        </Box>
      </SortableContext>

      {/* Add Card Form */}
      <Box sx={{ mt: 2 }}>
        {showAddForm ? (
          <Box>
            <TextField
              fullWidth
              variant="outlined"
              label="New card title"
              size="small"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              autoFocus
            />
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleAddSubmit}
              >
                Add Card
              </Button>
              <IconButton size="small" onClick={() => setShowAddForm(false)}>
                <X size={18} />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Button
            fullWidth
            startIcon={<Plus size={16} />}
            onClick={() => setShowAddForm(true)}
          >
            Add Card
          </Button>
        )}
      </Box>
    </Paper>
  );
};
