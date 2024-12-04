const errorHandler = (err, req, res, next) => {
    console.error(err.stack);  // stack trace log
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
      message: message,
    });

    //no next() cuz we dont pass this to the next middleware (it should be the last one)

};
  
export default errorHandler;
  