var getUserMedia = require('getusermedia');
var createObjectURL = require('./createObjectURL');

function getUserVideo(options) {
    options = options||{};
    options.autoplay = typeof options.autoplay === "boolean" ? options.autoplay : true;

    var video = options.domElement || document.createElement("video");
    if (options.autoplay)
        video.setAttribute("autoplay", "");

    if (typeof options.background === "string")
        video.style.background = options.background;

    var streaming = false;
    video.addEventListener("canplay", function(ev) {
        if (!streaming) {
            streaming = true;
            var hasWidth = typeof options.width === "number";
            var hasHeight = typeof options.height === "number";
            var useAspect = typeof options.maintainAspectRatio === "boolean" ? options.maintainAspectRatio : true;

            var width, height;

            //if numbers are defined...
            if (hasWidth || hasHeight) {
                if (useAspect) {
                    if (hasWidth) {
                        width = options.width;
                        height = video.videoHeight / (video.videoWidth/width);
                    } else if (hasHeight) {
                        height = options.height;
                        width = video.videoWidth / (video.videoHeight/height);
                    }
                } else {
                    width = options.width;
                    height = options.height;
                }
                video.setAttribute("width", width);
                video.setAttribute("height", height);
            }
            //if a string (percentage etc) is defined, don't try to maintain aspect
            else {
                if (options.width && typeof options.width !== "undefined")
                    video.setAttribute("width", options.width)
                if (options.height && typeof options.height !== "undefined")
                    video.setAttribute("height", options.height);
            }
            streaming = true;
            if (typeof options.onReady === "function") {
                options.onReady(width, height);
            }
        }
    });

    getUserMedia(function (err, stream) {
        if (err) {
            if (typeof options.onError === "function")
                options.onError(err);
        } else {
            video.src = createObjectURL(stream);
            if (typeof options.onUserMedia === "function")
                options.onUserMedia(stream);
        }
    });
    return video;
}

module.exports = getUserVideo;