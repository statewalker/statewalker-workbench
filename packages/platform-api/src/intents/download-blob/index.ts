import { newIntent } from "@statewalker/shared-intents";

export const DOWNLOAD_BLOB_INTENT_KEY = "platform:download-blob";

export interface DownloadBlobPayload {
  blob: Blob;
  filename: string;
}

export const [runDownloadBlob, handleDownloadBlob] = newIntent<DownloadBlobPayload, void>(
  DOWNLOAD_BLOB_INTENT_KEY,
);
