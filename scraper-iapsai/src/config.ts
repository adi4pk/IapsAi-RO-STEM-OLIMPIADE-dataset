import path from "node:path";


export const ROOT_DIR = path.resolve(import.meta.dirname, "..");

export const DOWNLOAD_DIR = path.resolve(import.meta.dirname, "..", "archive");

export const ARCHIVE_DIR = path.join(ROOT_DIR, "archive");
export const EXTRACT_DIR = path.join(ROOT_DIR, "extras");

export const PNG_DIR = path.join(ROOT_DIR, "png");
export const MARKDOWN_DIR = path.join(ROOT_DIR, "markdown");

export const DATASET_DIR = path.join(ROOT_DIR, "datasetOlimpiade");


/////SSMR
export const MIN_YEAR = 2012;

