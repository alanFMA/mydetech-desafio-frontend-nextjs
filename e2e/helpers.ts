import { Page } from "@playwright/test";
import path from "path";

const SHOT_DIR = path.join(__dirname, "screenshots");

/**
 * Salva uma captura full-page em `e2e/screenshots/<name>.png`.
 * O diretório é gitignored — as imagens servem para inspeção visual local.
 */
export async function shot(page: Page, name: string) {
    await page.screenshot({
        path: path.join(SHOT_DIR, `${name}.png`),
        fullPage: true,
    });
}
