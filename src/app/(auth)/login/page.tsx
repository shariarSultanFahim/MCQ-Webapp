"use client";

import type React from "react";

import { useState } from "react";
import {
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { useFormStatus } from "react-dom";
import Form from "next/form";
import { login } from "./action";

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
      Log In
    </Button>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#B6DEE3] to-[#F0F7EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/10 shadow-2xl ring-1 ring-black/5 backdrop-blur-3xl">
        <Box className="text-center mb-8">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-gray-800 mb-2"
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Sign in to your account
          </Typography>
        </Box>

        <Form action={login} className="space-y-6">
          <div>
            <InputLabel htmlFor="outlined-adornment-email">
              Email Address
            </InputLabel>
            <OutlinedInput
              fullWidth
              id="outlined-adornment-email"
              type="email"
              name="email"
              required
              size="small"
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
              name="password"
              required
              size="small"
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
          <Typography variant="body2" className="text-gray-600">
            {"Don't have an account? "}
            <Link
              href="/signup"
              className="text-primary font-bold hover:underline"
              passHref
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </div>
    </div>
  );
}
