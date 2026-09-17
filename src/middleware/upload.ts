import crypto from 'crypto';
import fs from 'fs';
import multer from 'multer';
import path from 'path';


export const UPLOAD_DIR = path.resolve(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}


const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    cb(null, unique);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const ext = path.extname(file.originalname).toLowerCase();
  const extensaoValida = ALLOWED_EXT.includes(ext);
  const mimeValido = ALLOWED_MIME.includes(file.mimetype);

  if (extensaoValida && mimeValido) {
    cb(null, true);
  } else {
    cb(new Error('Formato invalido. Envie uma imagem JPG, PNG, WEBP ou GIF.'));
  }
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

/**
 * Remove do disco a imagem enviada por upload, se ela for um arquivo local
 * (caminho "/uploads/..."). Ignora URLs externas (ex: links da Steam) e
 * eventuais falhas (arquivo ja apagado), para nao atrapalhar a exclusao.
 */
export function removeUploadedImage(imagemUrl?: string | null) {
  if (!imagemUrl || !imagemUrl.startsWith('/uploads/')) return;

  const nomeArquivo = path.basename(imagemUrl); // basename evita path traversal
  const caminho = path.join(UPLOAD_DIR, nomeArquivo);

  fs.promises.unlink(caminho).catch(() => {
    // arquivo ja nao existe ou nao pode ser removido: sem problema
  });
}
