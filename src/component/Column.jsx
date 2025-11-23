import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"; //ADDED
import { Paper, Stack, AppBar, Chip, Card, CardActionArea, CardContent, Typography, Box } from "@mui/material"; // ADDED Box to add place holder
import { kanbanBoardList } from "./KanbanInitialData.js"; //REMOVED
import AddIcon from "@mui/icons-material/Add";
import CardTask from "./CardTask.jsx";

const paperSx = {
    background: "board.paper",
    width: "100%",
    height: "fit-content",
    padding: "1rem",
    minHeight: "300px", //ADDED:
};
const appBarSx = {
    background: "transparent",
    color: "text.primary",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "static",
};

export default function Column({ column, activeTaskId }) {
    // REMOVED: setActiveTaskId
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: { accepts: ["taskType1"], type: "columnType1" },
    });
    /*ADDED*/
    const taskIds = column.tasks.map((task) => task.id); //  for SortableContext

    return (
        <Paper ref={setNodeRef} sx={paperSx}>
            <Stack spacing="1rem">
                <AppBar sx={appBarSx} elevation={0}>
                    <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>{column.title}</Typography>
                    <Chip size="small" sx={{ fontSize: "0.8rem" }} label={`${column.tasks.length} tasks`} />
                </AppBar>
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    // ADDED
                    {column.tasks.map(
                        // REPLACE
                        (
                            task,
                            index //ADDED: index
                        ) => (
                            <CardTask key={task.id} index={index} task={task} activeTaskId={activeTaskId} /> //ADDED: for sortable functionality index is required  />
                        )
                    )}
                    // ADDED
                </SortableContext>
                {column.tasks.length === 0 && ( //ADDED ; invisible placeholder for empty sorts/drops )}
                    <Box sx={{ height: "60px", opacity: 0.2 }} />
                )}

                <Card elevation={0} sx={{ bgcolor: "transparent" }}>
                    <CardActionArea>
                        <CardContent>
                            <Stack direction="row" spacing={1.5}>
                                <AddIcon />
                                <Typography size="small" fontWeight="300" color="text.secondary">
                                    {" "}
                                    Create new task{" "}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Stack>
        </Paper>
    );
}
