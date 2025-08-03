"use client";

import type React from "react";

import { useState } from "react";
import {
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Link as MuiLink,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import Form from "next/form";
import { useFormStatus } from "react-dom";
import { signup } from "./action";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      size="large"
      disabled={pending}
      className="bg-primary text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
    >
      Sign Up
    </Button>
  );
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#B6DEE3] to-[#F0F7EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/10 shadow-2xl ring-1 ring-black/5 backdrop-blur-3xl">
        <Box className="text-center mb-8">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-800 mb-2"
          >
            Welcome
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Create new account
          </Typography>
        </Box>

        <Form action={signup} className="space-y-6">
          <div>
            <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
            <OutlinedInput
              fullWidth
              id="outlined-adornment-name"
              type="text"
              size="small"
              name="name"
              required
            />
          </div>
          <div>
            <InputLabel htmlFor="outlined-adornment-phone">
              Phone Number
            </InputLabel>
            <OutlinedInput
              fullWidth
              id="outlined-adornment-phone"
              type="text"
              size="small"
              name="phone"
              required
            />
          </div>
          <div>
            <InputLabel htmlFor="outlined-adornment-email">
              Email Address
            </InputLabel>
            <OutlinedInput
              fullWidth
              id="outlined-adornment-email"
              type="email"
              size="small"
              name="email"
              required
            />
          </div>
          <div>
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              fullWidth
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              size="small"
              required
              name="password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <HugeiconsIcon icon={ViewOffSlashIcon} />
                    ) : (
                      <HugeiconsIcon icon={ViewIcon} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </div>
          <SubmitButton />
        </Form>

        <Box className="mt-8 text-center">
          <Link href="/login" passHref>
            {"Already have an account? "}
            <Typography variant="body2" className="text-gray-600">
              Log in
            </Typography>
          </Link>
        </Box>
      </div>
    </div>
  );
}
