'use strict';

const axios = require('axios');

exports.main_handler = async (event, context) => {
    const clientIp = event.requestContext.sourceIp;
    return {
        clientIp
    }
};