import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  cardSx,
  cardContentSx,
  stack1Sx,
  stack2Props,
  avatarSx,
} from "./CardTask.jsx";
import { useState } from "react";
import {
  Container,
  Stack,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { kanbanBoardList } from "./KanbanInitialData.js";
import Column from "./Column";
import { workTypeIconMap, PriorityIconMap } from "./KanbanIconMap.jsx";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";

function findTask(key) {
  for (let i = 0; i < kanbanBoardList.length; i++) {
    for (let j = 0; j < kanbanBoardList[i].tasks.length; j++) {
      if (kanbanBoardList[i].tasks[j].id === key) {
        return kanbanBoardList[i].tasks[j];
      }
    }
  }
  return null;
}
const DragOverlayCard = ({ value }) => {
  const task = findTask(value);
  if (!task) return null;
  return (
    <Card sx={cardSx}>
      <CardContent sx={cardContentSx}>
        <Stack sx={stack1Sx}>
          <Stack {...stack2Props}>
            <Box> {workTypeIconMap(task.workType)}</Box>
            <Typography sx={{ fontSize: "0.8rem" }}>
              {" "}
              {task.projectId}{" "}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box> {PriorityIconMap(task.priority)} </Box>

            <Avatar sx={avatarSx} src={task.author.photoUrl} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
const findColumn = (columnId) => {
  return kanbanBoardList.find((column) => column.id === columnId);
};

const handleDragEnd = (event, setActiveTaskId) => {
  const { active, over } = event;
  if (over && active.data.current.suppports?.includes(over.data.current.type)) {
    console.log("handleDragEnd was called successfuly ");
  }
  setActiveTaskId(null);
};
export default function Board() {
  const [kanboardList, setKanboardList] = useState(kanbanBoardList);
  const [activeTaskId, setActiveTaskId] = useState(null);

  return (
    <>
      <DndContext
        onDragEnd={(event, setActiveTaskId) =>
          handleDragEnd(event, setActiveTaskId)
        }
      >
        {/* <PresetTest />  to set the custom presets ( like configuring the highlevelt events and event handlers */}
        <Container sx={{ background: "transparent" }}>
          <Stack direction="row" spacing={2}>
            {kanbanBoardList.map((column) => {
              return (
                <Column
                  activeTaskId={activeTaskId}
                  setActiveTaskId={setActiveTaskId}
                  key={column.id}
                  columnId={findColumn(column.id).id}
                />
              );
            })}
          </Stack>
        </Container>
        <DragOverlay>
          {activeTaskId ? <DragOverlayCard value={activeTaskId} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
