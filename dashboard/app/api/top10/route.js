import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get("genre");

  if (!genre) {
    return new Response(JSON.stringify({ error: "genre is required" }), {
      status: 400,
    });
  }

  // Build the expected filename
  const today = new Date().toISOString().split("T")[0];
  const fileName = `top10_${genre}_${today}.csv`;
  const filePath = path.resolve(process.cwd(), "../data", fileName);

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
    console.error("❌ Erro ao ler CSV:", err.message);
    return new Response(JSON.stringify({ error: "CSV não encontrado" }), {
      status: 500,
    });
  }
}
