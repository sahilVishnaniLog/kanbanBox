import { Container, Stack } from "@mui/material";
import { KanbanBoardLists } from "./KanbanInitialData.js";
import Column from "./Column";
const findColumn = (columnId) => {
  return KanbanBoardLists.find((column) => column.id === columnId);
};

export default function Board() {
  return (
    <>
      <Container sx={{ background: "transparent" }}>
        <Stack direction="row" spacing={2}>
          {KanbanBoardLists.map((column) => {
            return <Column columnId={findColumn(column.id).id} />;
          })}
        </Stack>
      </Container>
    </>
  );
}
