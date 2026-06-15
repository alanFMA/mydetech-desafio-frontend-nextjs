import { Page } from "@playwright/test";
import path from "path";

const SHOT_DIR = path.join(__dirname, "screenshots");

export async function shot(page: Page, name: string) {
    await page.screenshot({
        path: path.join(SHOT_DIR, `${name}.png`),
        fullPage: true,
    });
}
