import { DndContext, DragOverlay } from "@dnd-kit/core";
import { closestCorners } from "@dnd-kit/core"; // Add for smooth collision
import { arrayMove } from "@dnd-kit/sortable"; // ADDED
import { cardSx, cardContentSx, stack1Sx, stack2Props, avatarSx } from "./CardTask.jsx";
import { useState } from "react";
import { Container, Stack, Card, CardContent, Typography, Box, Avatar, IconButton, Tooltip, Chip } from "@mui/material";
import { kanbanBoardList } from "./KanbanInitialData.js"; // Initial data
import Column from "./Column";
import { workTypeIconMap, PriorityIconMap } from "./KanbanIconMap.jsx";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";

function findTask(key, boardList) {
    // Make dynamic: pass boardList
    for (let i = 0; i < boardList.length; i++) {
        for (let j = 0; j < boardList[i].tasks.length; j++) {
            if (boardList[i].tasks[j].id === key) {
                return boardList[i].tasks[j];
            }
        }
    }
    return null;
}

const DragOverlayCard = ({ value, boardList }) => {
    // Pass boardList
    const task = findTask(value, boardList);
    if (!task) return null;
    return (
        <Card sx={cardSx}>
            <CardContent sx={cardContentSx}>
                <Stack sx={stack1Sx}>
                    <Stack {...stack2Props}>
                        <Typography sx={{ fontSize: "0.8rem" }}> {task.title} </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    <Stack {...stack2Props}>
                        <Box> {workTypeIconMap(task.workType)} </Box>
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

const handleDragEnd = (event, setKanboardList, setActiveTaskId, kanboardList) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;

    if (!overId) {
        // ADDED
        setActiveTaskId(null);
        return;
    }

    const activeType = active.data.curent?.type;
    const overType = over.data.current?.type;
    const overAccepts = over.data.current?.accepts;

    if (overAccepts?.includes(activeType) || overType === "taskType1") {
        // REPLACE
        // Fixed: accepts/type match, no typo
        console.log("Valid drop! Moving task...");

        // Immutable reordering: Find source/target, move task
        setKanboardList((prev) => {
            const sourceColumn = prev.find((col) => col.tasks.some((t) => t.id === activeId));
            const targetColumn = prev.find((col) => col.id === overId || col.id === sourceColumn.id); //ADDED same or target

            if (!sourceColumn || !targetColumn) {
                return prev; // Same column: No-op (add sortable later)
            }
            const activeIndex = active.data.current?.sortable?.index; // REPLACE
            const overIndex = over.data.current?.sortable?.index; // REPLACE

            /*ADDED*/ if (sourceColumn.id === targetColumn.id) {
                const newTasks = arrayMove(
                    sourceColumn.tasks,
                    activeIndex,
                    overIndex ?? sourceColumn.tasks.length // append if no over
                );
                return prev.map((col) => (col.id === sourceColumn.id ? { ...col, tasks: newTasks } : col));
            } else {
                const taskToMove = sourceColumn.tasks.find((t) => t.id === activeId);
                const sourceTasks = sourceColumn.tasks.filter((t) => t.id !== activeId);
                const newTargetTasks = [...targetColumn.tasks, taskToMove]; // Append to end

                return prev.map((col) => {
                    if (col.id === sourceColumn.id) return { ...col, tasks: sourceTasks };
                    if (col.id === targetColumn.id) return { ...col, tasks: newTargetTasks };
                    return col;
                });
            }
        });
    } else {
        console.log("Invalid drop or no over.");
    }
    setActiveTaskId(null);
};

export default function Board() {
    const [kanboardList, setKanboardList] = useState(kanbanBoardList); // Use 'kanboardList' consistently
    const [activeTaskId, setActiveTaskId] = useState(null);

    return (
        <>
            <DndContext
                collisionDetection={closestCorners} // Add: Smooth hover detection, reduces edge glitches
                onDragStart={({ active }) => setActiveTaskId(active.id)} // Add: Set once on start, no loops
                onDragEnd={(event) => handleDragEnd(event, setKanboardList, setActiveTaskId, kanboardList)} // Fix: Correct sig, pass all deps
            >
                <Container sx={{ background: "transparent" }}>
                    <Stack direction="row" spacing={2}>
                        {kanboardList.map(
                            (
                                column // Use state, not static
                            ) => (
                                <Column
                                    column={column} // Pass full obj
                                    activeTaskId={activeTaskId}
                                    key={column.id}
                                />
                            )
                        )}
                    </Stack>
                </Container>
                <DragOverlay>{activeTaskId ? <DragOverlayCard value={activeTaskId} boardList={kanboardList} /> : null}</DragOverlay>
            </DndContext>
        </>
    );
}
