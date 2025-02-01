
const BaseError = require("../utils/base_error")  
const jwt = require("jsonwebtoken")

const AccessTokenChecker = (requiredRole) => {
  return (req, res, next) => {
   
    const authHeader = req.headers.authorization || req.headers.Authorization
    
    if(!authHeader) {
        throw BaseError.UnauthorizedError("No authorization header found")
    }

    if(!authHeader.startsWith('Bearer ')) {
        throw BaseError.UnauthorizedError("Invalid token format. Must start with 'Bearer '")
    }

    const accesstoken = authHeader.split(' ')[1]
    
    try {
      const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET)
      if (requiredRole && decoded.role !== requiredRole) {
          throw BaseError.ForbiddenError("Access denied. Required role: " + requiredRole)
      }
      req.user = decoded
      next()
  } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
          throw BaseError.UnauthorizedError("Token has expired")
      } else if (error instanceof jwt.JsonWebTokenError) {
          throw BaseError.UnauthorizedError("Invalid token")
      } else if (error instanceof BaseError) {
          throw error
      } else {
          throw BaseError.InternalServerError("Token verification failed: " + error.message)
      }
  }
}
}

module.exports = AccessTokenChecker