import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";

// 📂 Dossier de stockage des fichiers
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration Multer (où et comment sauvegarder le fichier)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// 📌 Filtrage des fichiers autorisés
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Type de fichier non supporté. Seuls les images et documents sont autorisés."));
  }
};

const upload = multer({ storage, fileFilter });

// Promisify l'upload de Multer pour l'utiliser avec async/await
const uploadMiddleware = promisify(upload.single("file"));

// Gérer la requête POST
export async function POST(req: NextRequest) {
  try {
    // Il faut utiliser .formData() pour obtenir les données du formulaire avec l'App Router
    // mais multer a besoin de l'objet req brut, qui n'est pas directement disponible.
    // Nous devons donc passer à une approche manuelle.

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier envoyé." }, { status: 400 });
    }
    
    // Validation du type de fichier (manuelle)
    const ext = path.extname(file.name).toLowerCase();
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    if (!allowedTypes.test(ext)) {
        return NextResponse.json({ error: "Type de fichier non supporté." }, { status: 400 });
    }

    // Création du chemin et sauvegarde du fichier
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + ext;
    const filepath = path.join(uploadDir, filename);

    // Conversion du fichier en buffer et écriture sur le disque
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
