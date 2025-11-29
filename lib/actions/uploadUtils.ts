import { UTApi } from "uploadthing/server";

const api = new UTApi();

export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export interface UploadResponse {
  fileUrl: string;
}

export async function uploadFile(
    file: any // accept server-side File/Blob/form-data File or client File
): Promise<UploadResponse> {
    
    if  (!file) {
        throw new Error("No file provided for upload.");
    }

    // Ensure we have a numeric size and a filename for UploadThing
    const fileSize = typeof file?.size === "number" ? file.size : Number(file?.size);
    const fileName = file?.name || file?.filename || file?.fileName;

    if (!fileName || typeof fileName !== "string") {
        throw new Error("File is missing a name -- make sure you pass a File from FormData (not JSON).");
    }

    if (!fileSize || isNaN(fileSize)) {
        throw new Error("File is missing a valid size -- make sure you pass a File from FormData (not JSON).");
    }

    if (fileSize > MAX_FILE_SIZE) {
        throw new Error("File size exceeds the maximum limit of 4MB.");
    }

    // We expect UploadThing's server SDK to accept File/Blob objects that include name + size.
    // Pass through the file directly; the SDK will set the required headers (x-ut-file-name/x-ut-file-size)
    const response = await api.uploadFiles(file);
    const fileData = Array.isArray(response) ? response[0] : response;

    console.log("DEBUG: UploadThing response →", fileData);

    if (!fileData || typeof fileData.data.url !== "string") {
        throw new Error("Unexpected upload response.");
    }

    return {
        fileUrl: fileData.data.url,
    }
}