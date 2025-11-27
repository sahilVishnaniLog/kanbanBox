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

export default function Board() {
    const [kanboardList, setKanboardList] = useState(kanbanBoardList);
    const [previewBoard, setPreviewBoard] = useState(kanboardList); // For live preview
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // FIX 1: Refactored logic to base the preview on the latest committed state (kanboardList),
    // ensuring a clean state in every update.
    const updatePreviewBoard = useCallback(
        (activeId, over) => {
            // Start from a deep copy of the latest committed state.
            let nextBoard = JSON.parse(JSON.stringify(kanboardList));

            const activeItem = findTask(activeId, nextBoard);
            if (!activeItem) return kanboardList;

            const sourceColumn = nextBoard.find((col) => col.tasks.some((t) => t.id === activeId));
            if (!sourceColumn) return kanboardList;

            const sourceColumnIndex = nextBoard.findIndex((col) => col.id === sourceColumn.id);
            const activeIndex = sourceColumn.tasks.findIndex((t) => t.id === activeId);

            // Remove the active item from its committed source location in the preview copy
            // This is crucial for correctly simulating the move across columns.
            nextBoard[sourceColumnIndex].tasks.splice(activeIndex, 1);

            const overType = over.data.current?.type;
            let targetColumnIndex = -1;
            let overIndex = -1;

            if (overType === "taskType1") {
                const targetColumnId = over.data.current.columnId;
                targetColumnIndex = nextBoard.findIndex((col) => col.id === targetColumnId);

                // over.data.current.sortable?.index gives the position to insert at
                overIndex = over.data.current.sortable?.index ?? 0;
            } else if (overType === "columnType1") {
                const targetColumnId = over.id;
                targetColumnIndex = nextBoard.findIndex((col) => col.id === targetColumnId);
                // Dropping on the column itself means inserting at the end
                overIndex = nextBoard[targetColumnIndex].tasks.length;
            }

            if (targetColumnIndex >= 0) {
                // Mark as preview
                const taskToInsert = { ...activeItem, isPreview: true };
                const targetTasks = nextBoard[targetColumnIndex].tasks;

                // Insert the preview task
                targetTasks.splice(overIndex, 0, taskToInsert);

                return nextBoard;
            }

            // If drag is happening over an invalid drop zone, return the board with the item still removed
            return nextBoard;
        },
        [kanboardList]
    ); // FIX 2: Dependency array ensures the latest kanboardList is available

    // FIX 3: Refactored handleDragEnd to use state setters directly from closure
    // and simplify cross-column index calculation.
    const handleDragEnd = useCallback(
        (event) => {
            const { active, over } = event;
            const activeId = active.id;
            const overId = over?.id;

            // If drop is invalid (e.g., dropped outside DndContext), reset to original
            if (!overId) {
                setActiveTaskId(null);
                setIsDragging(false);
                setPreviewBoard(kanboardList);
                return;
            }

            const activeType = active.data.current?.type;
            const overType = over.data.current?.type;
            const overAccepts = over.data.current?.accepts;

            if (overAccepts?.includes(activeType) || overType === "taskType1") {
                console.log("Valid drop! Committing reorder...");

                setKanboardList((prev) => {
                    const sourceColumn = prev.find((col) => col.tasks.some((t) => t.id === activeId));
                    if (!sourceColumn) return prev;

                    let targetColumn = sourceColumn;
                    let newTasks = sourceColumn.tasks;
                    let activeIndex = sourceColumn.tasks.findIndex((t) => t.id === activeId);

                    if (overType === "taskType1") {
                        targetColumn = prev.find((col) => col.id === over.data.current.columnId);

                        if (targetColumn.id === sourceColumn.id) {
                            // Intra commit (reorder within same column)
                            const overIndex = over.data.current.sortable?.index ?? 0;
                            newTasks = arrayMove(sourceColumn.tasks, activeIndex, overIndex);
                        } else {
                            // Cross commit (move to different column)
                            const overIndex = over.data.current.sortable?.index ?? targetColumn.tasks.length; // Simplified index calculation
                            const taskToMove = sourceColumn.tasks.find((t) => t.id === activeId);

                            newTasks = [...targetColumn.tasks.slice(0, overIndex), taskToMove, ...targetColumn.tasks.slice(overIndex)];
                        }
                    } else if (overType === "columnType1") {
                        // Dropped directly on a column (insert at end)
                        targetColumn = prev.find((col) => col.id === over.id);
                        if (targetColumn.id === sourceColumn.id) return prev; // No change if dropped on same column background

                        const taskToMove = sourceColumn.tasks.find((t) => t.id === activeId);
                        newTasks = [...targetColumn.tasks, taskToMove];
                    }

                    // Map to update state
                    return prev.map((col) => {
                        if (col.id === sourceColumn.id) {
                            // If cross-column move, filter out the task.
                            return { ...col, tasks: sourceColumn.id === targetColumn.id ? newTasks : sourceColumn.tasks.filter((t) => t.id !== activeId) };
                        }
                        // If target column, apply newTasks.
                        if (col.id === targetColumn.id) return { ...col, tasks: newTasks };
                        return col;
                    });
                });
            } else {
                console.log("Invalid drop.");
            }

            // Reset drag state for both valid/invalid drops
            setActiveTaskId(null);
            setIsDragging(false);
            setPreviewBoard(kanboardList); // Reset preview to latest committed state.
        },
        [kanboardList] // Dependency array ensures latest state is available in closure
    );

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
                    if (!over || !active.id) return;
                    // FIX 4: Call the refactored function directly, passing only necessary arguments.
                    setPreviewBoard(updatePreviewBoard(active.id, over));
                }}
                onDragEnd={handleDragEnd} // FIX 5: Pass the function directly
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
