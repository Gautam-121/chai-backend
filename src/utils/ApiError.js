export default class ApiError extends Error{
    constructor(
        message,
        statusCode,
        errors = [],
        stack = ""
    ){
        super(message)
        this.message = message
        this.statusCode = statusCode
        this.errors = errors
        this.data = null
        this.success = false

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this , this.constructor)
        }
    }
}