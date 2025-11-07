import * as fs from "fs";
import * as https from "https";
import * as path from "path";

const IMAGE_URL = "https://placehold.co/600x400";
const OUTPUT_FILE = "placeholder-600x400.png";

async function downloadImage(url: string, outputPath: string): Promise<void> {
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
}

async function main() {
  try {
    const outputPath = path.join(process.cwd(), OUTPUT_FILE);
    console.log(`Downloading image from ${IMAGE_URL}...`);
    await downloadImage(IMAGE_URL, outputPath);
  } catch (error) {
    console.error("Error downloading image:", error);
    process.exit(1);
  }
}

main();
