
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


config.entities = {};


config.smtp = {
        host : 'Shost.sea.corp.expecn.com',
        auth : {
            user : process.env.userID,
            pass : process.env.password
        },
        from : process.env.fromAddress
};

config.apiCalls = {
    filterUrl : "http://cruise-api-service.us-west-2.int.expedia.com/search/sailings/filters",
    apiUrl : "http://terminal2.expedia.com/x/cruise/search/sailings",
    filtersJsonFile : "jarvisFilters.json",
    apiParameters : [
        "destinations", "sortBy", "sortOrder", "limit", "offset", "minPrice", "maxPrice","apikey"
    ],
    targetUrl : "https://www.expedia.com/Cruise-Search",
    targetUrlParametersMapping : {
        cruiseLine : {
                'Carnival Cruise Lines' : 'carnival'
        },
        destination : {
                'Caribbean' : 'caribbean'
        }
    }
};



module.exports = config;