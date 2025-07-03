import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Emulate __filename and __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ApiPlayer {
  id: number;
  firstname: string;
  lastname: string;
}

interface ApiResponse {
  response?: ApiPlayer[];
}

const RAPID_API_KEY = "5ce63285f3msh422b3ebd5978062p13acf6jsn31927b93628c";

async function build() {
  try {
    const playerIdMapPath = path.resolve(
      __dirname,
      "../constants/playerIdMap.ts"
    );
    const outputPath = path.resolve(__dirname, "../constants/players.ts");

    console.log("Checking path:", playerIdMapPath);
    console.log("File exists:", fs.existsSync(playerIdMapPath));

    // Dynamic import works for .ts files in ESM
    const playerIdMapModule = await import(playerIdMapPath);
    const playerIdMap: Record<string, number> = playerIdMapModule.default;

    // Load previously saved player images
    let existingImages: Record<string, string> = {};
    if (fs.existsSync(outputPath)) {
      const existingFile = fs.readFileSync(outputPath, "utf-8");
      const match = existingFile.match(
        /const playerImages: Record<string, string> = (\{[\s\S]*?\});/
      );
      if (match) {
        try {
          existingImages = eval(`(${match[1]})`);
          console.log(
            `🗂️ Loaded ${Object.keys(existingImages).length} existing players`
          );
        } catch (e) {
          console.warn("⚠️ Failed to parse existing player images.");
        }
      }
    }

    const resp = await axios.get<ApiResponse>(
      "https://api-nba-v1.p.rapidapi.com/players",
      {
        params: {
          season: "2024",
          team: 17,
        },
        headers: {
          "x-rapidapi-key": RAPID_API_KEY,
          "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
        },
      }
    );

    const players = resp.data.response || [];
    console.log(`✅ Loaded ${players.length} players`);

    const map: Record<string, string> = { ...existingImages };

    players.forEach((p) => {
      const name = `${p.firstname} ${p.lastname}`;
      const nbaId = playerIdMap[name];

      if (nbaId) {
        map[
          name
        ] = `https://cdn.nba.com/headshots/nba/latest/1040x760/${nbaId}.png`;
      } else {
        console.warn(
          `⚠️ NBA ID not found for player: ${name}, skipping image URL.`
        );
      }
    });

    const fileContents = `
// This file is auto-generated. Do not edit directly.
const playerImages: Record<string, string> = ${JSON.stringify(map, null, 2)};
export default playerImages;
`.trim();

    fs.writeFileSync(outputPath, fileContents);
    console.log(
      `✅ ${outputPath} updated with ${Object.keys(map).length} players`
    );
  } catch (err) {
    console.error("❌ Error fetching players:", err);
  }
}

build();
