import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useEffect } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  kanbanBoardList, // this will come from the firestore database later
} from "./KanbanInitialData.js";
import { workTypeIconMap, PriorityIconMap } from "./KanbanIconMap.jsx";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
const cardSx = {
  bgcolor: "board.card",
  padding: 1,
  margin: 0,
  height: "7rem",
  touchAction: "none",
}; // touchAction; 'none'  is important to avoid scroll  in mobile(device with touch screen)

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

export default function CardTask({ taskId, activeTaskId, setActiveTaskId }) {
  const task = findTask(taskId);

  const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
    {
      id: taskId,
      data: { type: "type1", index: taskId, supports: "columnType1" }, // acceptable types are 'type1' , 'type2' , INDEX is included to assist in making the sortable list ( within each column)
      disabled: false, // can be used to diable the drag functionality of the drag component ( conditionally) so that e can drag it ( it fixes itself to the column it is originally in )
    }
  );

  const style = {
    transform: CSS.Translate.toString(transform), // with the start of the drag of draggable item(component) transform gets poluted with the transform = { x: <number> , y: <nummber> , scaleX: <number> , scaleY: <number> }
    //transform = { x: ∂x(between the pointof start and where the component is dragged to ), y: ∂y( same as ∂x)  , scaleX: <difference in scale of dragged-component to that of droppable-component useful to scale the dragged-component to fit the dimension of droppable areȧ>  , scaleY: <number> }
  };
  useEffect(() => {
    const newActiveTaskId = active ? active.data.current.index : null;
    setActiveTaskId(newActiveTaskId);
  }, [active]);
  return (
    <Box
      role="button" // required
      ref={setNodeRef} // this is a basic syntax
      style={style}
      {...attributes} // these can be put in further nested components  inside which acts like a drag handle we are adding here cause we need  the whole card to  be dragable
      {...listeners} //  this is a basic call syntax
      key={task.id}
      tabIndex={0} // to include the draggable elements to recieve keyboard focus events
    >
      <Card value={taskId} sx={cardSx}>
        <CardActionArea
          sx={{ height: "100%", width: "100%", padding: "0.5rem", margin: 0 }}
        >
          <CardContent
            sx={{ height: "100%", width: "100%", padding: 0, margin: 0 }}
          >
            <Stack
              sx={{
                p: 0,
                m: 0,
                height: "100%",
                width: "100%",
                alignItems: "space-between",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ padding: 0, height: "1rem" }}
              >
                <Typography sx={{ fontSize: "0.8rem" }}>
                  {task.title}
                </Typography>
                <IconButton
                  onClick={(e) => e.stopPropagation()}
                  sx={{ background: "transparent", p: 0 }}
                >
                  <EditIcon sx={{ fontSize: 10, p: 0 }} />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  onClick={(e) => e.stopPropagation()}
                  sx={{ background: "transparent" }}
                >
                  <MoreHorizIcon />
                </IconButton>
              </Stack>
              <Box sx={{ flexGrow: 1 }} />

              <Stack
                direction="row"
                spacing={1.5}
                sx={{ padding: 0, height: "1.2rem" }}
              >
                <Box component="span"> {workTypeIconMap(task.workType)}</Box>
                <Typography sx={{ fontSize: "0.8rem" }}>
                  {" "}
                  {task.projectId}{" "}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box component="span"> {PriorityIconMap(task.priority)}</Box>
                <Tooltip content={task.author.photoUrl}>
                  <Avatar
                    onClick={(e) => e.stopPropagation()}
                    sx={{ bgcolor: "transparent", height: 24, width: 24 }}
                    src={task.author.photoUrl}
                  />
                </Tooltip>
              </Stack>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}
