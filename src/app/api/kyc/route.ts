'use server';
import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";

// Dossier de stockage des fichiers KYC
const uploadDir = path.join(process.cwd(), "public/kyc");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Pas de destination ou de nommage ici, nous allons gérer manuellement
const storage = multer.memoryStorage();

// Filtrage des fichiers
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Format non supporté. Utiliser JPG ou PNG."));
  }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB par fichier
});

// Promisify Multer pour l'utiliser avec async/await
const uploadMiddleware = promisify(
    upload.fields([
        { name: "recto", maxCount: 1 },
        { name: "verso", maxCount: 1 },
    ])
);

async function saveFile(file: Express.Multer.File, fieldname: string): Promise<string> {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, file.buffer);
    return filename;
}


// Gérer la requête POST
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const numeroCNI = formData.get("numeroCNI") as string | null;
    const rectoFile = formData.get("recto") as File | null;
    const versoFile = formData.get("verso") as File | null;

    if (!rectoFile || !versoFile) {
         return NextResponse.json({ error: "Les fichiers recto et verso sont obligatoires." }, { status: 400 });
    }

    if (!numeroCNI) {
        return NextResponse.json({ error: "Le numéro de CNI est obligatoire." }, { status: 400 });
    }

    // Validation du type
     const allowedTypes = /jpeg|jpg|png/;
     if (!allowedTypes.test(path.extname(rectoFile.name).toLowerCase()) || !allowedTypes.test(path.extname(versoFile.name).toLowerCase())) {
        return NextResponse.json({ error: "Format non supporté. Utiliser JPG ou PNG." }, { status: 400 });
     }


    const rectoFilename = await saveFile(rectoFile as any, "recto");
    const versoFilename = await saveFile(versoFile as any, "verso");


    return NextResponse.json({ 
        message: "KYC soumis avec succès ✅",
        numeroCNI,
        fichiers: {
            recto: rectoFilename,
            verso: versoFilename
        }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur de téléversement KYC:", error);
    return NextResponse.json({ error: `Erreur serveur: ${error.message}` }, { status: 500 });
  }
}
