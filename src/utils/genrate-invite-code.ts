import { customAlphabet } from "nanoid";
import httpStatus from "http-status";

export const generateInviteCode = customAlphabet(
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
    6
);