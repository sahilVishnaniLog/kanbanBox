import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card as MuiCard,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Trash2 } from "lucide-react";

export const Card = ({ id, title, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };
  return (
    <MuiCard
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{ mb: 1, userSelect: "none" }}
    >
      <CardContent
        sx={{
          "&:last-child": { pb: "16px" },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          p: 2,
        }}
      >
        <Typography
          variant="body1"
          component="h3"
          sx={{ wordBreak: "break-word", pr: 1 }}
        >
          {title}
        </Typography>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(id)}
          sx={{ flexShrink: 0, mt: -0.5, mr: -0.5 }}
        >
          <Trash2 size={16} />
        </IconButton>
      </CardContent>
    </MuiCard>
  );
};