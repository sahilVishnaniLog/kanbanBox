import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardActionArea, CardContent, Stack, Typography, Box, IconButton, Avatar, Tooltip } from "@mui/material";
import { workTypeIconMap, PriorityIconMap } from "./KanbanIconMap.jsx";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";

export const cardSx = {
    bgcolor: "board.card",
    padding: 1,
    margin: 0,
    height: "7rem",
    touchAction: "none",
}; // touchAction: 'none' is important to avoid scroll in mobile(device with touch screen)

export const cardContentSx = {
    height: "100%",
    width: "100%",
    padding: 0,
    margin: 0,
};

export const stack1Sx = {
    p: 0,
    m: 0,
    height: "100%",
    width: "100%",
    alignItems: "space-between",
};

export const stack2Props = {
    direction: "row",
    spacing: 1.5,
    sx: { padding: 0, height: "1rem" },
};

export const avatarSx = { bgcolor: "transparent", height: 24, width: 24 };

const iconSx = {
    opacity: 0,
    transition: "opacity 0.15s ease-in-out",
    color: "text.secondary",
};

export default function CardTask({ task, index, activeTaskId, transitionDelay, isOver, columnId, isPreview }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: cardDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "taskType1",
            sortable: { index }, // ADDED: for sortable reorder calculations
            columnId, // REMOVED supports: "columnType1",
        }, // acceptable types are 'type1' , 'type2' , INDEX is included to assist in making the sortable list ( within each column)
        disabled: false, // can be used to disable the drag functionality of the drag component ( conditionally) so that e can drag it ( it fixes itself to the column it is originally in )
    });
    const style = {
        transform: CSS.Translate.toString(transform), // with the start of the drag of draggable item(component) transform gets polluted with the transform = { x: <number> , y: <number> , scaleX: <number> , scaleY: <number> }
        //transform = { x: ∂x(between the pointof start and where the component is dragged to ), y: ∂y( same as ∂x) , scaleX: <difference in scale of dragged-component to that of droppable-component useful to scale the dragged-component to fit the dimension of droppable area> , scaleY: <number> }
        transition: `${transition} 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)`, // ADDED : enables animated reordering ( slides into place )
        transitionDelay,
        ...(isOver && { transform: "scale(1.02)", boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)" }),
    };
    return (
        <Box
            ref={setNodeRef} // this is a basic syntax
            style={style}
            {...attributes} // these can be put in further nested components inside which acts like a drag handle we are adding here cause we need the whole card to be dragable
            {...listeners} // this is a basic call syntax
            tabIndex={0} // to include the draggable elements to receive keyboard focus events
        >
            <Card
                sx={{
                    ...cardSx,
                    ...(cardDragging && { opacity: 0.7 }), // ADDED fade original during drag
                    ...(isPreview && { opacity: 0.5, border: "1px dashed #1976d2" }), // Add: Ghost style for preview
                    transition: "box-shadow 0.15s ease-in-out",
                    "&:hover, &:focus-visible": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        ".edit-icon, .more-icon": { opacity: 1 },
                    },
                }}
            >
                <CardActionArea
                    disableRipple={cardDragging} // ripples off during drag
                    sx={{ height: "100%", width: "100%", p: "0.5rem", m: 0 }}
                >
                    <CardContent sx={cardContentSx}>
                        <Stack sx={stack1Sx}>
                            <Stack {...stack2Props}>
                                <Typography sx={{ fontSize: "0.8rem" }}>{task.title}</Typography>
                                <IconButton onClick={(e) => e.stopPropagation()} className="edit-icon" sx={{ ...iconSx, background: "transparent", p: 0 }}>
                                    <EditIcon sx={{ fontSize: 10, p: 0 }} />
                                </IconButton>
                                <Box sx={{ flexGrow: 1 }} />
                                <IconButton onClick={(e) => e.stopPropagation()} className="more-icon" sx={{ ...iconSx, background: "transparent" }}>
                                    <MoreHorizIcon />
                                </IconButton>
                            </Stack>
                            <Box sx={{ flexGrow: 1 }} />
                            <Stack
                                {...stack2Props} // there is possibility to make the change to the height : to be 1.2rem
                            >
                                <Box> {workTypeIconMap(task.workType)}</Box>
                                <Typography sx={{ fontSize: "0.8rem" }}> {task.projectId} </Typography>
                                <Box sx={{ flexGrow: 1 }} />
                                <Box component="span"> {PriorityIconMap(task.priority)}</Box>
                                <Tooltip title={task.author?.name || "Author"}>
                                    <Avatar onClick={(e) => e.stopPropagation()} sx={avatarSx} src={task.author.photoUrl} />
                                </Tooltip>
                            </Stack>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Box>
    );
}
