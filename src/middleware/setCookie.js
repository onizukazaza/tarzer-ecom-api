
const setCookie = (req , res , next) => {
    const {accessToken, refreshToken } = req.tokens;

    if (accessToke) {
        res.cookie('access-token', accessToken, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 60 * 60 * 1 // 1 hour
         });
    }
    
    if (refreshToken) {
        res.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
    }

    next()
}

app.use(setCookie)