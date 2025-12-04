"use client";

import { Share01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IconButton } from "@mui/material";

export default function ShareExamButton({ id }: { id: number }) {
  // "use client";
  function share() {
    navigator.clipboard.writeText(`${location.origin}/dashboard/start/${id}`);
  }
  return (
    <div className="flex justify-between items-center gap-2">
      <div>
        <h1>Exam Code: {id}</h1>
      </div>
      <IconButton onClick={share}>
        <HugeiconsIcon icon={Share01Icon} />
      </IconButton>
    </div>
  );
}
