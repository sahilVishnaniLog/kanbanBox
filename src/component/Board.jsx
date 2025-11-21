import { DndContext, DragOverlay } from "@dnd-kit/core";

import { useState } from "react";
import { Container, Stack } from "@mui/material";
import { kanbanBoardList } from "./KanbanInitialData.js";
import Column from "./Column";
const findColumn = (columnId) => {
  return kanbanBoardList.find((column) => column.id === columnId);
};

const handleDragEnd = (event) => {
  const { active, over } = event;
  if (over && active.data.current.suppports.includes(over.data.current.type)) {
    console.log("handleDragEnd was called successfuly ");
  }
  setActiveTaskId(null);
};
export default function Board() {
  const [kanboardList, setKanboardList] = useState(kanbanBoardList);
  const [activeTaskId, setActiveTaskId] = useState(null);

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
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
          {activeTaskId ? <CardTask value={activeTaskId} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
