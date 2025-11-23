import { DndContext, DragOverlay } from "@dnd-kit/core";
import { closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { cardSx, cardContentSx, stack1Sx, stack2Props, avatarSx } from "./CardTask.jsx";
import { useState, useCallback } from "react";
import { Container, Stack, Card, CardContent, Typography, Box, Avatar, IconButton } from "@mui/material";
import { kanbanBoardList } from "./KanbanInitialData.js";
import Column from "./Column";
import { workTypeIconMap, PriorityIconMap } from "./KanbanIconMap.jsx";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";

function findTask(key, boardList) {
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
    const task = findTask(value, boardList);
    if (!task) return null;
    return (
        <Card
            sx={{
                ...cardSx,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)", // Creative: Ghost trail shadow
                transform: "scale(1.02)", // Micro-lift on overlay
                transition: "transform 0.1s ease-out",
            }}
        >
            <CardContent sx={cardContentSx}>
                <Stack sx={stack1Sx}>
                    {/* Top: Title + Static Icons (grayed, non-interactive) */}
                    <Stack {...stack2Props}>
                        <Typography sx={{ fontSize: "0.8rem" }}>{task.title}</Typography>
                        {/* Static Edit Icon: Gray, no onClick */}
                        <IconButton disabled size="small" sx={{ color: "text.secondary", p: 0 }}>
                            <EditIcon sx={{ fontSize: 10 }} />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }} />
                        {/* Static More Icon: Gray dots */}
                        <IconButton disabled size="small" sx={{ color: "text.secondary" }}>
                            <MoreHorizIcon />
                        </IconButton>
                    </Stack>
                    <Box sx={{ flexGrow: 1 }} />
                    {/* Bottom: Unchanged */}
                    <Stack {...stack2Props}>
                        <Box> {workTypeIconMap(task.workType)}</Box>
                        <Typography sx={{ fontSize: "0.8rem" }}>{task.projectId}</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box> {PriorityIconMap(task.priority)} </Box>
                        <Avatar sx={avatarSx} src={task.author.photoUrl} />
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
};

// Fixed: Unified preview for intra/cross (arrayMove for intra, insert for cross)
const updatePreviewBoard = useCallback((prev, activeId, over) => {
    const active = prev.flatMap((col) => col.tasks).find((t) => t.id === activeId);
    if (!active) return prev;

    const sourceColumn = prev.find((col) => col.tasks.some((t) => t.id === activeId));
    const overType = over.data.current?.type;
    let targetColumn = sourceColumn;
    let newTasks = sourceColumn.tasks;
    let activeIndex = sourceColumn.tasks.findIndex((t) => t.id === activeId);

    if (overType === "taskType1") {
        targetColumn = prev.find((col) => col.id === over.data.current.columnId);
        if (targetColumn.id === sourceColumn.id) {
            // Intra: Reorder preview
            const overIndex = over.data.current.sortable?.index ?? 0;
            newTasks = arrayMove(sourceColumn.tasks, activeIndex, overIndex);
        } else {
            // Cross: Insert preview
            const overIndex = (over.data.current.sortable?.index ?? targetColumn.tasks.length - 1) + 1;
            const sourceTasks = sourceColumn.tasks.filter((t) => t.id !== activeId);
            newTasks = [...targetColumn.tasks.slice(0, overIndex), { ...active, isPreview: true }, ...targetColumn.tasks.slice(overIndex)];
        }
    } else if (overType === "columnType1") {
        targetColumn = prev.find((col) => col.id === over.id);
        if (targetColumn.id === sourceColumn.id) return prev; // No change for column hover in same
        const overIndex = targetColumn.tasks.length;
        const sourceTasks = sourceColumn.tasks.filter((t) => t.id !== activeId);
        newTasks = [...targetColumn.tasks, { ...active, isPreview: true }];
    }

    return prev.map((col) => {
        if (col.id === sourceColumn.id) return { ...col, tasks: sourceColumn.id === targetColumn.id ? newTasks : sourceColumn.tasks.filter((t) => t.id !== activeId) };
        if (col.id === targetColumn.id) return { ...col, tasks: newTasks };
        return col;
    });
}, []);

const handleDragEnd = useCallback(
    (event, setKanboardList, setActiveTaskId, setIsDragging, setPreviewBoard, previewBoard) => {
        const { active, over } = event;
        const activeId = active.id;
        const overId = over?.id;

        if (!overId) {
            setPreviewBoard(kanboardList); // Reset to original
            setActiveTaskId(null);
            setIsDragging(false);
            return;
        }

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;
        const overAccepts = over.data.current?.accepts;

        if (overAccepts?.includes(activeType) || overType === "taskType1") {
            console.log("Valid drop! Committing reorder...");
            // Commit preview to real state (remove isPreview, use arrayMove/insert logic)
            setKanboardList((prev) => {
                const sourceColumn = prev.find((col) => col.tasks.some((t) => t.id === activeId));
                if (!sourceColumn) return prev;

                let targetColumn = sourceColumn;
                let newTasks = sourceColumn.tasks;
                let activeIndex = sourceColumn.tasks.findIndex((t) => t.id === activeId);

                if (overType === "taskType1") {
                    targetColumn = prev.find((col) => col.id === over.data.current.columnId);
                    if (targetColumn.id === sourceColumn.id) {
                        // Intra commit
                        const overIndex = over.data.current.sortable?.index ?? 0;
                        newTasks = arrayMove(sourceColumn.tasks, activeIndex, overIndex);
                    } else {
                        // Cross commit
                        const overIndex = (over.data.current.sortable?.index ?? targetColumn.tasks.length - 1) + 1;
                        const taskToMove = sourceColumn.tasks.find((t) => t.id === activeId);
                        const sourceTasks = sourceColumn.tasks.filter((t) => t.id !== activeId);
                        newTasks = [...targetColumn.tasks.slice(0, overIndex), taskToMove, ...targetColumn.tasks.slice(overIndex)];
                    }
                } else if (overType === "columnType1") {
                    targetColumn = prev.find((col) => col.id === over.id);
                    if (targetColumn.id === sourceColumn.id) return prev;
                    const taskToMove = sourceColumn.tasks.find((t) => t.id === activeId);
                    const sourceTasks = sourceColumn.tasks.filter((t) => t.id !== activeId);
                    newTasks = [...targetColumn.tasks, taskToMove];
                }

                return prev.map((col) => {
                    if (col.id === sourceColumn.id) return { ...col, tasks: sourceColumn.id === targetColumn.id ? newTasks : sourceColumn.tasks.filter((t) => t.id !== activeId) };
                    if (col.id === targetColumn.id) return { ...col, tasks: newTasks };
                    return col;
                });
            });
        } else {
            console.log("Invalid drop.");
            setPreviewBoard(kanboardList); // Reset
        }
        setActiveTaskId(null);
        setIsDragging(false);
        setPreviewBoard(kanboardList); // Reset preview
    },
    [kanboardList]
);

export default function Board() {
    const [kanboardList, setKanboardList] = useState(kanbanBoardList);
    const [previewBoard, setPreviewBoard] = useState(kanboardList); // For live preview
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    return (
        <>
            <DndContext
                collisionDetection={closestCorners}
                onDragStart={({ active }) => {
                    setIsDragging(true);
                    setActiveTaskId(active.id);
                    setPreviewBoard(kanboardList); // Init preview as original
                }}
                onDragOver={({ active, over }) => {
                    // Fixed: Unified intra/cross preview
                    if (!over || !active.id) return;
                    setPreviewBoard((prev) => updatePreviewBoard(prev, active.id, over));
                }}
                onDragEnd={(event) => handleDragEnd(event, setKanboardList, setActiveTaskId, setIsDragging, setPreviewBoard, previewBoard)}
            >
                <Container sx={{ background: "transparent" }}>
                    <Stack direction="row" spacing={2}>
                        {previewBoard.map((column) => (
                            <Column column={column} activeTaskId={activeTaskId} isDragging={isDragging} key={column.id} />
                        ))}
                    </Stack>
                </Container>
                <DragOverlay>{activeTaskId ? <DragOverlayCard value={activeTaskId} boardList={kanboardList} /> : null}</DragOverlay>
            </DndContext>
        </>
    );
}
