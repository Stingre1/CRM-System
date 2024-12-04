import colors from 'colors';

const methodColors = {
    GET: 'green',
    POST: 'blue',
    PUT: 'yellow',
    DELETE: 'red',
};

const logger = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    
    const methodColor = methodColors[method] || 'white';
    const timestampColor = 'gray';
    const clientIpColor = 'cyan';
    
    console.log(`[${timestamp[`${timestampColor}`]}] ${method[`${methodColor}`]} request to ${url} from ${clientIp[`${clientIpColor}`]}`);
    next();
};

export default logger;
