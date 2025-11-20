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
export default function Column({ columnId }) {
  return (
    <Paper key={columnId} sx={paperSx}>
      <Stack spacing="1rem">
        <AppBar sx={appBarSx}>
          <Typography sx={{ fontWeight: "bold" }}>
            {findColumn(columnId).title}{" "}
          </Typography>
          <Chip
            label={
              findColumn(columnId).tasks.length +
              " OF " +
              findColumn(columnId).tasks.length
            }
          />
        </AppBar>
        {findColumn(columnId).tasks.map((task) => (
          <CardTask key={task.id} taskId={task.id} />
        ))}
        <Card sx={{ bgcolor: "transparent" }}>
          <CardActionArea>
            <CardContent>
              <Stack direction="row" spacing={1.5}>
                <AddIcon />
                <Typography> CREATE NEW TASK </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </Stack>
    </Paper>
  );
}
