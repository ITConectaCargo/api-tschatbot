import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

function VerificaToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ msg: 'Acesso negado!' });

    try {
        const secret = process.env.SECRET as string;

        jwt.verify(token, secret);

        next();
    } catch (err) {
        res.status(400).json({ msg: 'Sessao Expirada' });
    }
}

export default VerificaToken;
