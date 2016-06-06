/**
 * Created by avagrawal on 6/1/16.
 */

var config = {};

config.WIT_TOKEN = process.env.WIT_TOKEN;
config.FB_PAGE_ID = process.env.FB_PAGE_ID;

if (!config.FB_PAGE_ID) {
    throw new Error('missing FB_PAGE_ID');
}

config.FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
if (!config.FB_PAGE_TOKEN) {
    throw new Error('missing FB_PAGE_TOKEN');
}
config.FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;


module.exports = config;