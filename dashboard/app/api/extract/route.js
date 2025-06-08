import { exec } from "child_process";
import fs from "fs";
import path from "path";

function waitForFile(filePath, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const interval = 200;
    let waited = 0;

    const check = () => {
      if (fs.existsSync(filePath)) return resolve(true);
      waited += interval;
      if (waited >= timeout) return reject("Timeout waiting for CSV");
      setTimeout(check, interval);
    };

    check();
  });
}

export async function POST(request) {
  const { genre } = await request.json();

  if (!genre) {
    return new Response(JSON.stringify({ error: "Missing genre" }), {
      status: 400,
    });
  }

  const scriptPath = path.resolve(process.cwd(), "../src/etl.py");
  const pythonPath =
    "/Users/vascofixe/Desktop/MUSIC DATA EXPLORER/venv/bin/python";

  const today = new Date().toISOString().split("T")[0];
  const csvName = `top10_${genre}_${today}.csv`;
  const csvPath = path.resolve(process.cwd(), "../data", csvName);

  const command = `"${pythonPath}" "${scriptPath}" ${genre}`;

  console.log("📥 Recebido pedido para ETL:", genre);

  return new Promise((resolve) => {
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Erro ao correr ETL:", error.message);
        return resolve(
          new Response(JSON.stringify({ error: "ETL failed" }), { status: 500 })
        );
      }

      console.log("✅ ETL Output:", stdout);

      try {
        await waitForFile(csvPath); // espera até o ficheiro existir

        resolve(
          new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        );
      } catch (e) {
        console.error("❌ Timeout à espera do CSV");
        resolve(
          new Response(JSON.stringify({ error: "CSV not found in time" }), {
            status: 500,
          })
        );
      }
    });
  });
}
