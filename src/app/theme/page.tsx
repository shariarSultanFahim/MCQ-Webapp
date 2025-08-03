"use client";
import { Time04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  CircularProgressProps,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Typography,
} from "@mui/material";
import React from "react";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; totalquestions: number }
) {
  const percentage = (props.value / props.totalquestions) * 100;
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={percentage}
        thickness={4}
        size={120}
        sx={{
          color: "secondary.main",
          [`& .${props.className}`]: {
            strokeLinecap: "round",
          },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ color: "text.primary" }}
        >{`${props.value} / ${props.totalquestions}`}</Typography>
      </Box>
    </Box>
  );
}

export default function Home() {
  const totalquestions = 12;
  const [question, setQuestion] = React.useState(1);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setQuestion(value);
  };
  const handlePrev = () => {
    if (question > 1) setQuestion(question - 1);
  };

  const handleNext = () => {
    if (question < totalquestions) setQuestion(question + 1);
  };

  return (
    <div className="h-screen p-4 bg-gradient-to-tr from-[#B6DEE3] to-[#F0F7EB]">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">MCQ Exam</h1>
        </div>

        <div>
          <ListItem>
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                }}
              >
                IST
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={"Ibrahim Sadik Tamim"}
              secondary={"01521579148"}
            />
          </ListItem>
        </div>
      </div>
      <div className="bg-white container p-6 rounded-xl shadow-md mx-auto mt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 mb-4">
            <HugeiconsIcon className="" icon={Time04Icon} />
            <div>
              <h1 className="text-gray-400">Time remaining</h1>
              <h1 className="font-bold">14 : 44 : 00</h1>
            </div>
          </div>
          <Button variant="contained" color="primary" className="!rounded-md">
            Submit
          </Button>
        </div>
        <div className="my-10 flex gap-4 flex-col-reverse lg:flex-row items-center">
          <div>
            <h1 className="mb-4">
              Question {question} of {totalquestions}
            </h1>
            <h1 className="mb-6 font-bold text-lg">
              This is a sample question text. Please read it carefully and
              select the correct answer.
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outlined" color="primary" className="mb-2">
                A. Option A
              </Button>
              <Button variant="outlined" color="primary" className="mb-2">
                B. Option B
              </Button>
              <Button variant="outlined" color="primary" className="mb-2">
                C. Option C
              </Button>
              <Button variant="outlined" color="primary">
                D. Option D
              </Button>
            </div>
          </div>
          <CircularProgressWithLabel
            value={question}
            totalquestions={totalquestions}
          />
        </div>
        <div className="w-full flex justify-between items-center px-4">
          <Button
            variant="outlined"
            onClick={handlePrev}
            disabled={question === 1}
            className="min-w-[80px] rounded-lg capitalize font-semibold border-gray-400"
          >
            Prev
          </Button>

          <div className="hidden flex-1 md:flex justify-center">
            <Pagination
              count={totalquestions}
              page={question}
              onChange={handleChange}
              color="primary"
              hidePrevButton
              hideNextButton
              shape="rounded"
              size="large"
              variant="outlined"
            />
          </div>

          <Button
            variant="outlined"
            onClick={handleNext}
            disabled={question === totalquestions}
            className="min-w-[80px] rounded-lg capitalize font-semibold border-gray-400"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
