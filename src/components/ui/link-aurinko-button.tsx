"use client";
import React from "react";
import { Button } from "./button";
import { getAurinkoAuthRUrl } from "@/lib/aurinko";

const LinkAurinkoButton = () => {
  const toAurinkoAuth = async () => {
    const authUrl = await getAurinkoAuthRUrl();
    window.location.href = authUrl;
  };

  return <Button onClick={toAurinkoAuth}>Link Me</Button>;
};

export default LinkAurinkoButton;
