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
        <Card
            sx={{
                ...cardSx,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)", // ADDED: ghost trail shadow
                transform: "scale(1.02)", // ADDED : micro lift on overlay
                transition: "transform 0.1s ease-out",
            }}
        >
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

const handleDragEnd = (event, setKanboardList, setActiveTaskId, kanboardList, setIsDragging) => {
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
            if (!sourceColumn) return prev; // ADDED : same column

            let targetId = overType === "taskType1" ? over.data.current.columnId : overId;

            const targetColumn = prev.find((col) => col.id === targetId); //ADDED same or target

            if (!targetColumn || targetColumn.id === sourceColumn.id) {
                const activeIndex = active.data.current?.sortable?.index; // REPLACE
                const overIndex = over.data.current?.sortable?.index ?? sourceColumn.tasks.length; // REPLACE

                const newTasks = arrayMove(sourceColumn.tasks, activeIndex, overIndex);
                return prev.map((col) => (col.id === sourceColumn.id ? { ...col, tasks: newTasks } : col));
            }
            const taskToMove = sourceColumn.tasks.find((t) => t.id === activeId);
            const sourceTasks = sourceColumn.tasks.filter((t) => t.id !== activeId);
            const overIndex = overType === "taskType1" ? over.data.current?.sortable?.index ?? targetColumn.tasks.length : targetColumn.tasks.length;
            const newTargetTasks = [...targetColumn.tasks.slice(0, overIndex), taskToMove, ...targetColumn.tasks.slice(overIndex)]; // Append to end

            return prev.map((col) => {
                if (col.id === sourceColumn.id) return { ...col, tasks: sourceTasks };
                if (col.id === targetColumn.id) return { ...col, tasks: newTargetTasks };
                return col;
            });
        });
    } else {
        console.log("Invalid drop or no over.");
    }
    setActiveTaskId(null);
    setIsDragging(false); //ADDED : trigger a quick scale on all cards
};

export default function Board() {
    const [kanboardList, setKanboardList] = useState(kanbanBoardList); // Use 'kanboardList' consistently
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [isDragging, setIsDragging] = useState(false); // ADDED : trigger a quick scale on all cards
    const [insertionData, setInsertionData] = useState({ columnId: null, index: 0 }); // added for skeleton

    return (
        <>
            <DndContext
                collisionDetection={closestCorners} // Add: Smooth hover detection, reduces edge glitches
                onDragStart={({ active }) => {
                    setIsDragging(true); // REPLACED
                    setActiveTaskId(active.id);
                }} // Add: Set once on start, no loops
                // ADDED onDragOver= () => {}
                onDragOver={({ active, over }) => {
                    if (!over) return;
                    const overType = over.data.current?.type;
                    let targetId = overType.id;
                    let insertIndex = 0;

                    if (overType === "taskType1") {
                        targetId = over.dtat.current.columnId;
                        insertIndex = over.data.current.sortable?.index + 1;
                    } else if (overType === "columnType1") {
                        targetId = over.id;
                        insertIndex = kanboardList.find((co) => col.id === targetId)?.tasks.length || 0;
                    }
                    setInsertionData({ columnId: targetId, index: insertIndex });
                }}
                onDragEnd={(event) => handleDragEnd(event, setKanboardList, setActiveTaskId, kanboardList, setIsDragging)} // Fix: Correct sig, pass all deps
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
                                    isDragging={isDragging} // ADDED : shading of the card
                                    insertionData={insertionData} // ADDED
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
