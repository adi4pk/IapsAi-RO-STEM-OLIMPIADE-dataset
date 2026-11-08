import path from "node:path";


export const ROOT_DIR = path.resolve(import.meta.dirname, "..");

export const DOWNLOAD_DIR = path.resolve(import.meta.dirname, "..", "archive");

export const ARCHIVE_DIR = path.join(ROOT_DIR, "archive");
export const EXTRACT_DIR = path.join(ROOT_DIR, "extras");

export const PNG_DIR = "iesire";



