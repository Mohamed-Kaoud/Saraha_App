
export const Authorization = (roles = []) => {
    return async (req,res,next) => {
        if(!roles.includes(req.user.role)) {
            throw new Error("Unauthorized access 🔴❎", {cause: 403})
        }
        next()
    }
}