import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core"; //NOTE: Add for smooth collision { closestCorners}
import { cardSx, cardContentSx, stack1Sx, stack2Props, avatarSx } from "./CardTask.jsx";
import { useState } from "react";
import { Container, Stack, Card, CardContent, Typography, Box, Avatar, IconButton, Tooltip, Chip } from "@mui/material";
import { kanbanBoardList } from "./KanbanInitialData.js";
//EventX
//EventHandlerX
//EventY
//EventHandlerY
//EventZ
//EventHandlerZ

import Column from "./Column";
import { workTypeIconMap, PriorityIconMap } from "./KanbanIconMap.jsx";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
// tracking boardList dynamic pass
/*CONTAINED*/ function findTask(key, boardList) {
    // kanbanBoardList=> boardList
    for (let i = 0; i < boardList.length; i++) {
        // REPLACE
        for (let j = 0; j < boardList[i].tasks.length; j++) {
            //REPLACE
            if (boardList[i].tasks[j].id === key) {
                //REPLACE
                return boardList[i].tasks[j]; //REPLACE
            }
        }
    }
    return null;
}
const DragOverlayCard = ({ value, boardList }) => {
    // REPLACE
    const task = findTask(value, boardList);
    if (!task) return null;
    return (
        <Card sx={cardSx}>
            <CardContent sx={cardContentSx}>
                <Stack sx={stack1Sx}>
                    <Stack {...stack2Props}>
                        <Box> {workTypeIconMap(task.workType)}</Box>
                        <Typography sx={{ fontSize: "0.8rem" }}> {task.projectId} </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box> {PriorityIconMap(task.priority)} </Box>

                        <Avatar sx={avatarSx} src={task.author.photoUrl} />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default function Board() {
    const [kanboardList, setKanboardList] = useState(kanbanBoardList); //REVIEW
    const [activeTaskId, setActiveTaskId] = useState(null);

    const handleDragEnd = (event) => {
        //
        // FIXXED
        const { active, over } = event;
        const activeId = active.id;
        const overId = over?.id;
        if (over && active.data.current?.accepts?.includes(active.data.current?.type)) {
            console.log("valid drop "); //LOG: valid drop, handleDragEnd event was successful
            //NOTE:  will take care of the logic of moving the task from one column to another
            setKanboardList((prev) => {
                const sourceColumn = prev.find((column) => column.id === activeId);
                const targetColumn = prev.find((column) => column.id === overId);
                if (!sourceColumn || !targetColumn || sourceColumn.id === targetColumn.id) return prev;

                const taskToMove = sourceColumn.taks.find((t) => t.id === activeId);
                const sourceTasks = sourceColumn.tasks.filter((t) => t.id !== activeId);
                const newTargetTasks = [...targetColumn.tasks, taskToMove]; //append to ennd

                return prev.map((col) => {
                    if (col.id === sourceColumn.id) return { ...col, tasks: sourceTasks };
                    if (col.id === targetColumn.id) return { ...col, tasks: newTargetTasks };
                    return col;
                });
            });
        } else {
            console.log("invalid drop or no over."); //LOG
        }
        setActiveTaskId(null);
    };

    return (
        <>
            /*NOTE*/
            <DndContext
                collisionDetection={closestCorners}
                onDragStart={({ active }) => setActiveTaskId(active.id)} //EventX
                // EventHandlerX
                onDragEnd={(event) => handleDragEnd(event)} // EventY
            >
                {/* <PresetTest />  to set the custom presets ( like configuring the highlevelt events and event handlers */}
                <Container sx={{ background: "transparent" }}>
                    <Stack direction="row" spacing={2}>
                        {kanboardList.map((column) => {
                            //INFO: using dynamic data ( not static )
                            return (
                                <Column
                                    column={column} // INFO: passing whole column object
                                    activeTaskId={activeTaskId}
                                    key={column.id}
                                />
                            );
                        })}
                    </Stack>
                </Container>
                <DragOverlay>{activeTaskId ? <DragOverlayCard value={activeTaskId} /> : null}</DragOverlay>
            </DndContext>
        </>
    );
}
