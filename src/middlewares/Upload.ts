import multer from 'multer';
import path from 'path';
import fs from 'fs';

const rootPath = path.resolve(__dirname, '..');
const uploadDirectory = path.join(rootPath, 'upload');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const extensao = path.extname(file.originalname);
    const nomeArquivo = `${file.fieldname}-${Date.now()}${extensao}`;
    cb(null, nomeArquivo);
  },
});

const Upload = multer({ storage: storage });

export default Upload;
