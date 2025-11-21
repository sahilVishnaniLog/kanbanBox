import { useDroppable } from "@dnd-kit/core";

import {
  Paper,
  Stack,
  AppBar,
  Chip,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { kanbanBoardList } from "./KanbanInitialData.js";
import AddIcon from "@mui/icons-material/Add";
import CardTask from "./CardTask.jsx";

const paperSx = {
  background: "board.paper",
  width: "100%",
  height: "fit-content",
  padding: "1rem",
};
const appBarSx = {
  background: "transparent",
  color: "text.primary",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  position: "static",
};
function findColumn(columnId) {
  return kanbanBoardList.find((column) => column.id === columnId);
}
export default function Column({ columnId, activeTaskId, setActiveTaskId }) {
  const { setNodeRef } = useDroppable({
    id: columnId,
    data: { accepts: ["taskType1", "taskType2"], type: "columnType1" },
  });

  return (
    <Paper key={columnId} ref={setNodeRef} sx={paperSx}>
      <Stack spacing="1rem">
        <AppBar sx={appBarSx} elevation={0}>
          <Typography sx={{ fontWeight: "bold", fontSize: "1rem" }}>
            {findColumn(columnId).title}
          </Typography>
          <Chip
            size="small"
            sx={{ fontSize: "0.8rem" }}
            label={
              findColumn(columnId).tasks.length +
              " OF " +
              findColumn(columnId).tasks.length
            }
          />
        </AppBar>
        {findColumn(columnId).tasks.map((task) => (
          <CardTask
            activeTaskId={activeTaskId}
            setActiveTaskId={setActiveTaskId}
            key={task.id}
            taskId={task.id}
          />
        ))}
        <Card elevation={0} sx={{ bgcolor: "transparent" }}>
          <CardActionArea>
            <CardContent>
              <Stack direction="row" spacing={1.5}>
                <AddIcon />
                <Typography
                  size="small"
                  fontWeight="300"
                  color="text.secondary"
                >
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
