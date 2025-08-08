// src/components/UserReviews.tsx
"use client";

import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Box, Card, CardContent, Typography, Avatar } from "@mui/material";
import { useEffect, useRef } from "react";

const reviews = [
  {
    name: "Rafiq Sir",
    role: "Private Tutor",
    text: "This platform has made conducting MCQ exams so much easier. I save hours every week!",
    rating: 5,
  },
  {
    name: "Ayesha",
    role: "Student",
    text: "I love getting my results instantly. It helps me learn from my mistakes quickly.",
    rating: 4,
  },
  {
    name: "Sabbir",
    role: "Tutor",
    text: "The Bengali support is amazing. My students find it easy to use.",
    rating: 5,
  },
  {
    name: "Nusrat",
    role: "Student",
    text: "No more paper exams! Everything is online and convenient.",
    rating: 5,
  },
];

export default function UserReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.7; // px per frame

    const scroll = () => {
      if (scrollContainer) {
        scrollAmount += scrollSpeed;
        scrollContainer.scrollLeft = scrollAmount;

        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0; // reset for infinite loop
        }
      }
      requestAnimationFrame(scroll);
    };

    requestAnimationFrame(scroll);
  }, []);

  return (
    <Box sx={{ py: 8 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        What Our Users Say
      </Typography>
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "hidden",
          whiteSpace: "nowrap",
          p: 2,
        }}
      >
        {[...reviews, ...reviews].map((review, i) => (
          <Card
            key={i}
            className="!bg-white/10 !ring-1 !ring-black/5 !backdrop-blur-3xl"
            sx={{
              minWidth: 280,
              flex: "0 0 auto",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={1}>
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    color: "primary.main",
                    width: 30,
                    height: 30,
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    borderColor: "primary.main",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    padding: 2,
                  }}
                >
                  {review.name
                    .split(" ")
                    .map((name: string) => name.charAt(0).toUpperCase())
                    .join("")}
                </Avatar>
                <Box>
                  <Typography fontWeight="bold">{review.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.role}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                &quot;{review.text}&quot;
              </Typography>
              <Box display="flex" gap={0.5}>
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <HugeiconsIcon
                    fill="currentColor"
                    icon={StarIcon}
                    key={idx}
                    size={20}
                    // color="#facc15"
                    color="#274032"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
