//custom Wrapsync it is better version of try-catch
module.exports =(fn) => {
    return (req,res,next) => {
        fn(req,res,next).catch(next);
    }
}