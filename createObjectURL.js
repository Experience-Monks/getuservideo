//TODO: pull out into another module

var URL = undefined;
if (typeof window !== "undefined") {
    URL = window.URL 
                || window.webkitURL 
                || window.mozURL 
                || window.msURL;
}
if (typeof URL === "undefined" || typeof URL.createObjectURL !== "function") {
    module.exports = function() {
        throw new Error("URL.createObjectURL not supported");
    };
} else {    
    module.exports = URL.createObjectURL;
}