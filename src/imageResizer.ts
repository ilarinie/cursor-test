import sharp from "sharp";
import * as path from "path";

class ImageResizer {
  /**
   * Resizes an image to the specified dimensions.
   *
   * @param InputPath - The path to the input image file
   * @param outputPath - The path where the resized image should be saved
   * @param width - The target width in pixels (default: 500)
   * @param height - The target height in pixels (default: 300)
   * @throws {Error} If the image file cannot be read or processed
   * @throws {Error} If the output file cannot be written
   */
  async resizeImage(
    InputPath: string,
    outputPath: string,
    width: number = 500,
    height: number = 300
  ): Promise<void> {
    try {
      await sharp(InputPath).resize(width, height).toFile(outputPath);
      console.log(
        `Image resized successfully to ${width}x${height} and saved to ${outputPath}`
      );
    } catch (error) {
      throw new Error(`Failed to resize image: ${error}`);
    }
  }

  /**
   * Resizes the downloaded placeholder image to 500x300.
   * This is a convenience method that uses the default dimensions.
   *
   * @param inputPath - The path to the input image file
   * @param outputPath - Optional output path. If not provided, creates a new file with 'resized-' prefix
   * @throws {Error} If the image file cannot be read or processed
   * @throws {Error} If the output file cannot be written
   */
  async resizeDownloadedImage(
    inputPath: string,
    outputPath?: string
  ): Promise<void> {
    const defaultOutputPath =
      outputPath || this.getDefaultOutputPath(inputPath);
    await this.resizeImage(inputPath, defaultOutputPath, 500, 300);
  }

  /**
   * Generates a default output path for resized images based on the input path.
   *
   * @param inputPath - The input file path
   * @returns The output path with 'resized-' prefix
   */
  private getDefaultOutputPath(inputPath: string): string {
    const dir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const name = path.basename(inputPath, ext);
    return path.join(dir, `resized-${name}${ext}`);
  }
}

export default ImageResizer;
