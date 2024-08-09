class ExpressError extends Error{
    constructor(stattusCode,message){
        super();
        this.stattusCode=stattusCode;
        this.message=message;
    }
}
module.exports=ExpressError;