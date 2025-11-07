import * as fs from "fs";
import * as https from "https";
import * as path from "path";

/**
 * URL for the placeholder image service.
 * For production use, consider making this configurable via environment variables.
 */
const IMAGE_URL = "https://placehold.co/600x400";
const OUTPUT_FILE = "placeholder-600x400.png";

/**
 * Downloads an image from the specified URL and saves it to the output path.
 *
 * @param url - The URL of the image to download
 * @param outputPath - The file path where the image should be saved
 * @throws {Error} If the HTTP request fails or the response status is not 200
 * @throws {Error} If file write operations fail
 */
const downloadImage = async (
  url: string,
  outputPath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to download image: ${response.statusCode} ${response.statusMessage}`
            )
          );
          return;
        }

        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          console.log(`Image downloaded successfully to ${outputPath}`);
          resolve();
        });

        fileStream.on("error", (err) => {
          fs.unlink(outputPath, () => {}); // Delete the file on error
          reject(err);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

/**
 * Main entry point that orchestrates the image download process.
 * Downloads a placeholder image and saves it to the current working directory.
 */
const main = async (): Promise<void> => {
  try {
    const outputPath = path.join(process.cwd(), OUTPUT_FILE);
    console.log(`Downloading image from ${IMAGE_URL}...`);
    await downloadImage(IMAGE_URL, outputPath);
  } catch (error) {
    console.error("Error downloading image:", error);
    process.exit(1);
  }
};

main();
