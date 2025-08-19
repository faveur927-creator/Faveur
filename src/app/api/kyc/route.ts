'use server';
import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { verifyKycData } from "@/ai/flows/kyc-actions";

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


function fileToDataURI(file: Express.Multer.File): string {
    return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
}

async function saveFile(file: Express.Multer.File, fieldname: string): Promise<string> {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, file.buffer);
    return filename;
}


// Gérer la requête POST
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  
  // Utilisation de `any` ici car les types de `req` dans Next.js et Express diffèrent.
  // C'est un workaround pour faire fonctionner `multer` dans cet environnement.
  const reqWithFiles: any = new NextRequest(req, {});
  reqWithFiles.body = formData;
  reqWithFiles.headers.set('content-type', 'multipart/form-data');

  try {
    // Promisify Multer pour l'utiliser avec async/await
    const uploadMiddleware = promisify(upload.fields([
        { name: "recto", maxCount: 1 },
        { name: "verso", maxCount: 1 },
    ]));
    
    // @ts-ignore - Les types de req et res ne correspondent pas parfaitement
    await uploadMiddleware(reqWithFiles, new NextResponse());

    const numeroCNI = formData.get("numeroCNI") as string | null;
    const files = (reqWithFiles as any).files;
    const rectoFile = files?.recto?.[0];
    const versoFile = files?.verso?.[0];


    if (!rectoFile || !versoFile) {
         return NextResponse.json({ error: "Les fichiers recto et verso sont obligatoires." }, { status: 400 });
    }

    if (!numeroCNI) {
        return NextResponse.json({ error: "Le numéro de CNI est obligatoire." }, { status: 400 });
    }

    // AI Verification Step
    const verificationResult = await verifyKycData({
        cniNumber: numeroCNI,
        rectoDataUri: fileToDataURI(rectoFile),
        versoDataUri: fileToDataURI(versoFile),
    });

    if (!verificationResult.isMatch) {
         return NextResponse.json({ 
            error: `Le numéro de CNI ne correspond pas. Nous avons lu "${verificationResult.extractedNumber}", vous avez saisi "${numeroCNI}".` 
        }, { status: 400 });
    }
    
    const rectoFilename = await saveFile(rectoFile, "recto");
    const versoFilename = await saveFile(versoFile, "verso");


    return NextResponse.json({ 
        message: "KYC soumis avec succès et vérifié par IA ✅",
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
