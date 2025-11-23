import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Paper, Stack, AppBar, Chip, Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CardTask from "./CardTask.jsx";

const paperSx = {
    background: "board.paper",
    width: "100%",
    height: "fit-content",
    padding: "1rem",
    minHeight: "300px",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
};

const appBarSx = {
    background: "transparent",
    color: "text.primary",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "static",
};

const dropIndicatorSx = {
    height: "2px",
    background: "linear-gradient(90deg, #1976d2, #42a5f5)",
    borderRadius: "1px",
    opacity: 0,
    transition: "opacity 0.2s ease",
    mx: 1,
};

export default function Column({ column, activeTaskId, isDragging }) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            accepts: ["taskType1"],
            type: "columnType1",
        },
    });

    const taskIds = column.tasks.map((task) => task.id).filter((id) => id !== "skeleton"); // Exclude previews if any

    const columnSx = isDragging
        ? {
              ...paperSx,
              backgroundColor: "rgba(0,0,0,0.05)",
              boxShadow: isOver ? "0 0 0 2px #1976d2" : "none",
          }
        : paperSx;

    return (
        <Paper ref={setNodeRef} sx={columnSx}>
            <Stack spacing="1rem">
                <AppBar sx={appBarSx} elevation={0}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>{column.title}</Typography>
                    <Chip size="small" sx={{ fontSize: "0.8rem" }} label={`${column.tasks.length} tasks`} />
                </AppBar>
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {column.tasks.map((task, index) => (
                        <CardTask
                            task={task}
                            index={index}
                            activeTaskId={activeTaskId}
                            transitionDelay={`${index * 0.05}s`}
                            key={task.id}
                            isOver={isOver}
                            columnId={column.id}
                            isPreview={task.isPreview} // Add: For fade
                        />
                    ))}
                </SortableContext>
                {isOver && <Box sx={{ ...dropIndicatorSx, opacity: 1 }} />}
                {column.tasks.length === 0 && <Box sx={{ height: "60px", opacity: 0 }} />}
                <Card elevation={0} sx={{ bgcolor: "transparent" }}>
                    <CardActionArea>
                        <CardContent>
                            <Stack direction="row" spacing={1.5}>
                                <AddIcon />
                                <Typography size="small" fontWeight="300" color="text.secondary">
                                    Create new task
                                </Typography>
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Stack>
        </Paper>
    );
}
