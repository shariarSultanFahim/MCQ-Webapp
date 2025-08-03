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

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Signuo attempt:", formData);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <InputLabel htmlFor="outlined-adornment-name">Name</InputLabel>
            <OutlinedInput
              fullWidth
              id="outlined-adornment-name"
              type="name"
              size="small"
              value={formData.name}
              onChange={handleInputChange("name")}
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
              value={formData.phone}
              onChange={handleInputChange("phone")}
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
              value={formData.email}
              onChange={handleInputChange("email")}
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
              value={formData.password}
              size="small"
              onChange={handleInputChange("password")}
              required
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            className="bg-primary text-white py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Sign Up
          </Button>
        </form>

        <Box className="mt-8 text-center">
          <Typography variant="body2" className="text-gray-600">
            {"Already have an account? "}
            <Link href="/login" passHref>
              <MuiLink
                component="a"
                className="!text-blue-600 !font-semibold !no-underline hover:!underline"
              >
                Log in
              </MuiLink>
            </Link>
          </Typography>
        </Box>
      </div>
    </div>
  );
}
