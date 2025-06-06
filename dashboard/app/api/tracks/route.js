import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET() {
  const filePath = path.resolve(process.cwd(), "../data/tracks.csv");

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    return new Response(JSON.stringify(records), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erro ao ler tracks.csv" }), {
      status: 500,
    });
  }
}
