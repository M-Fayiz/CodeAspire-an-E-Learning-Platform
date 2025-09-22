import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

type Props = {
  totalPages: number;
  currentPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
};

const PaginationRounded: React.FC<Props> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  console.log("total page", totalPages);
  return (
    <Stack spacing={2} mt={4}>
      <Pagination
        count={totalPages}
        page={currentPage}
        shape="rounded"
        variant="outlined"
        onChange={onPageChange}
      />
    </Stack>
  );
};

export default PaginationRounded;
