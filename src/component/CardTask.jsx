import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  KanbanBoardList, // this will come from the firestore database later
} from "./KanbanInitialData.js";
import { workTypeIconMap, PriorityIconMap } from "./KanbanIconMap.jsx";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
const cardSx = { bgcolor: "board.card", padding: "1rem", margin: "0.2rem" };

function findTask(key) {
  for (let i = 0; i < KanbanBoardList.length; i++) {
    for (let j = 0; j < KanbanBoardList[i].tasks.length; j++) {
      if (KanbanBoardList[i].tasks[j].id === key) {
        return KanbanBoardList[i].tasks[j];
      }
    }
  }
  return null;
}

export default function CardTask({ taskId }) {
  const task = findTask(key);
  return (
    <>
      <Card key={task.id} sx={cardSx}>
        <CardActionArea>
          <CardContent>
            <Stack direction="row" spacing={1.5}>
              <Typography>{task.title}</Typography>
              <IconButton sx={{ background: "transparent" }}>
                <EditIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton sx={{ background: "transparent" }}>
                <MoreHorizIcon />
              </IconButton>
            </Stack>

            <Box sx={{ flexGrow: 1 }}></Box>
            <Stack direction="row" spacing={1.5}>
              <Box component="span"> {workTypeIconMap(task.workType)}</Box>
              <Typography> {task.projectId} </Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box component="span"> {PriorityIconMap(task.priority)}</Box>
              <Avatar
                sx={{ bgcolor: "transparent" }}
                src={task.author.photoUrl}
              >
                {" "}
              </Avatar>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
