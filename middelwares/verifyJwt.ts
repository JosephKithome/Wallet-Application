import jwt, { JwtPayload } from 'jsonwebtoken';
// Token verification middleware
const verifyToken = (req: { headers: { authorization: string; }; userId: any; }, resp: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }, next: () => void) => {
    if (!req.headers.authorization) {
        return resp.status(401).send("Unauthorized request!!")
    }
    let token = req.headers.authorization.split(' ')[1]

    //check if the token is null
    if (token == "null") {
        resp.status(401).send("Unauthorized")
    }

    let payload: string | JwtPayload;

    try {
        payload = jwt.verify(token, "secretkey") as JwtPayload;
    } catch (error) {
        resp.status(401).send("Unauthorized")
        return;
    }

    if (!payload || typeof payload === 'string') {
        resp.status(401).send("Unauthorized")
        return;
    }

    req.userId = payload.subject;
    next();
}