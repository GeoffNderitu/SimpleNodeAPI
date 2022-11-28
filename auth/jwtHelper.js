const JWT = require('jsonwebtoken');
const createError = require('http-errors');
require('dotenv').config();

module.exports ={
    signAccessToken:(UserId)=>{
        return new Promise((resolve, reject)=>{
            const payload ={}
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options ={
                expiresIn: '1h',
                issuer: 'EddTechnologies.com',
                audience: UserId,
            }
            JWT.sign(payload, secret, options, (error, token)=>{
                if(error) reject(error);
                resolve(token);
            })
        })
    },
    verifyAccessToken:(req, res, next)=>{
        if(!req.headers['authorization']) return next(creatError.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload)=>{
            if(err){
                return next (creatError.Unauthorized())
            }
            req.payload = payload;
            next()
        })
    },
    signRefreshToken:(UserId)=>{
        return new Promise((resolve, reject)=>{
            const payload ={}
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options ={
                expiresIn: '1y',
                issuer: 'EddTechnologies.com',
                audience: UserId,
            }
            JWT.sign(payload, secret, options, (error, token)=>{
                if(error) reject(error);
                resolve(token);
            })
        })
    },
    verifyRefreshToken:(refreshToken)=>{
        return new Promise((resolve, reject)=>{
            JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload)=>{
                if(err) return reject(creatError.Unauthorized())
                const userId = payload.aud;

                resolve(userId);
            });
        });

    },
    refreshToken: async (req, res, next)=>{
        try{
            const { refreshToken } = req.body;
            if(!refreshToken)throw creatError.BadRequest();
            const userId = await verifyRefreshToken(refreshToken);
            
            const accessToken = await signAccessToken(userId);
            const refToken = await signRefreshToken(userId);
            res.send({accessToken:accessToken, refreshToken:refToken});
        }catch(error){
            next(error);
    
        }
    }
}
