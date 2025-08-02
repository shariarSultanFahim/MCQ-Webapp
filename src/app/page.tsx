import { Button, Stack } from "@mui/material";

export default function Home() {
  return (
    <Stack spacing={2} direction="column" alignItems="center" className="my-20">
      <Button variant="contained" color="primary">
        Click Me
      </Button>
      <Button variant="outlined" color="primary">
        Click Me
      </Button>
      <Button variant="text" color="primary">
        Click Me
      </Button>
    </Stack>
  );
}
