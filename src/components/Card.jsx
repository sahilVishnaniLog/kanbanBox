import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card as MuiCard,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import { Trash2 } from "lucide-react";

export const Card = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id }); //abstraction of the useDragable hook
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <MuiCard
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{ mb: 1, cursor: "grab", userSelect: "none" }}
    >
      <CardContent sx={{ "&:last-child": { pb: "16px" } }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <IconButton size="small" color="error">
          <Trash2 size={16} />
        </IconButton>
      </CardContent>
    </MuiCard>
  );
};
