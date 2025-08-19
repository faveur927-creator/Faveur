import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";

// 📂 Dossier de stockage des fichiers
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Gérer la requête POST
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier envoyé." }, { status: 400 });
    }
    
    // Validation du type de fichier
    const ext = path.extname(file.name).toLowerCase();
    const allowedTypes = /jpeg|jpg|png|gif/;
    if (!allowedTypes.test(ext)) {
        return NextResponse.json({ error: "Type de fichier non supporté." }, { status: 400 });
    }

    // Création du chemin et sauvegarde du fichier
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + ext;
    const filepath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    return NextResponse.json({ 
        message: "Fichier téléversé avec succès ✅",
        file: {
            filename: filename,
            path: filepath,
            size: file.size,
            mimetype: file.type
        }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur de téléversement:", error);
    return NextResponse.json({ error: `Erreur serveur: ${error.message}` }, { status: 500 });
  }
}
