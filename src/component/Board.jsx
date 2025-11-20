import { Container, Stack } from "@mui/material";
import { kanbanBoardList } from "./KanbanInitialData.js";
import Column from "./Column";
const findColumn = (columnId) => {
  return kanbanBoardList.find((column) => column.id === columnId);
};

export default function Board() {
  return (
    <>
      <Container sx={{ background: "transparent" }}>
        <Stack direction="row" spacing={2}>
          {kanbanBoardList.map((column) => {
            return (
              <Column key={column.id} columnId={findColumn(column.id).id} />
            );
          })}
        </Stack>
      </Container>
    </>
  );
}
