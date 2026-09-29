// ============================================================
// AI SIGN LANGUAGE TRANSLATOR
// MediaPipe Hands + 30 Gesture Classes
// ============================================================

// ------------------------------------------------------------
// HTML ELEMENTS
// ------------------------------------------------------------

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startCamera");
const speakButton = document.getElementById("speakButton");

const cameraStatus = document.getElementById("cameraStatus");
const modelStatus = document.getElementById("modelStatus");

const gestureText = document.getElementById("gesture");
const meaningText = document.getElementById("meaning");


// ------------------------------------------------------------
// 30 GESTURE CLASSES
// ------------------------------------------------------------

const gestureMap = {

    GESTURE_01: {
        symbol: "🖐️",
        text: "HELLO"
    },

    GESTURE_02: {
        symbol: "✊",
        text: "STOP"
    },

    GESTURE_03: {
        symbol: "👍",
        text: "YES"
    },

    GESTURE_04: {
        symbol: "👎",
        text: "NO"
    },

    GESTURE_05: {
        symbol: "👌",
        text: "OKAY"
    },

    GESTURE_06: {
        symbol: "☝️",
        text: "ONE"
    },

    GESTURE_07: {
        symbol: "✌️",
        text: "PEACE"
    },

    GESTURE_08: {
        symbol: "🤟",
        text: "I LOVE YOU"
    },

    GESTURE_09: {
        symbol: "🤞",
        text: "LUCK"
    },

    GESTURE_10: {
        symbol: "🤘",
        text: "ROCK"
    },

    GESTURE_11: {
        symbol: "🖐️",
        text: "THANK YOU"
    },

    GESTURE_12: {
        symbol: "👋",
        text: "GOODBYE"
    },

    GESTURE_13: {
        symbol: "👉",
        text: "RIGHT"
    },

    GESTURE_14: {
        symbol: "👈",
        text: "LEFT"
    },

    GESTURE_15: {
        symbol: "☝️",
        text: "UP"
    },

    GESTURE_16: {
        symbol: "👇",
        text: "DOWN"
    },

    GESTURE_17: {
        symbol: "✋",
        text: "WAIT"
    },

    GESTURE_18: {
        symbol: "🤚",
        text: "HELLO FRIEND"
    },

    GESTURE_19: {
        symbol: "🖖",
        text: "LIVE LONG"
    },

    GESTURE_20: {
        symbol: "🤏",
        text: "SMALL"
    },

    GESTURE_21: {
        symbol: "🤌",
        text: "WHAT"
    },

    GESTURE_22: {
        symbol: "👏",
        text: "APPLAUSE"
    },

    GESTURE_23: {
        symbol: "🙏",
        text: "PLEASE"
    },

    GESTURE_24: {
        symbol: "🤲",
        text: "WELCOME"
    },

    GESTURE_25: {
        symbol: "💪",
        text: "STRONG"
    },

    GESTURE_26: {
        symbol: "🤝",
        text: "AGREE"
    },

    GESTURE_27: {
        symbol: "👋",
        text: "BYE"
    },

    GESTURE_28: {
        symbol: "🫶",
        text: "LOVE"
    },

    GESTURE_29: {
        symbol: "👏",
        text: "GOOD"
    },

    GESTURE_30: {
        symbol: "✋",
        text: "STOP / NO"
    }

};


// ------------------------------------------------------------
// MEDIAPIPE HANDS
// ------------------------------------------------------------

let hands = null;
let camera = null;

try {

    hands = new Hands({

        locateFile: function(file) {

            return (
                "https://cdn.jsdelivr.net/npm/" +
                "@mediapipe/hands@0.4.1675469240/" +
                file
            );

        }

    });


    hands.setOptions({

        maxNumHands: 1,

        modelComplexity: 1,

        minDetectionConfidence: 0.6,

        minTrackingConfidence: 0.6

    });


    hands.onResults(onResults);

    modelStatus.innerText =
        "✅ MediaPipe loaded successfully";

}

catch (error) {

    console.error(
        "MediaPipe Error:",
        error
    );

    modelStatus.innerText =
        "❌ MediaPipe loading failed";

}


// ------------------------------------------------------------
// START CAMERA
// ------------------------------------------------------------

startButton.addEventListener(
    "click",
    async function() {

        try {

            cameraStatus.innerText =
                "Starting camera...";


            const stream =
                await navigator.mediaDevices.getUserMedia({

                    video: {

                        width: 640,

                        height: 480,

                        facingMode: "user"

                    },

                    audio: false

                });


            video.srcObject = stream;

            await video.play();


            cameraStatus.innerText =
                "✅ Camera is working";


            startButton.innerText =
                "🟢 Camera Running";


            startButton.disabled = true;


            camera = new Camera(
                video,
                {

                    onFrame: async function() {

                        if (hands) {

                            await hands.send({

                                image: video

                            });

                        }

                    },

                    width: 640,

                    height: 480

                }
            );


            camera.start();

        }

        catch (error) {

            console.error(
                "Camera Error:",
                error
            );


            cameraStatus.innerText =
                "❌ Camera Error";


            alert(
                "Camera could not start.\n\n" +
                "Please check browser camera permission."
            );

        }

    }
);


// ============================================================
// MEDIAPIPE RESULTS
// ============================================================

function onResults(results) {

    if (!video.videoWidth) {

        return;

    }


    canvas.width =
        video.videoWidth;

    canvas.height =
        video.videoHeight;


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // --------------------------------------------------------
    // NO HAND
    // --------------------------------------------------------

    if (
        !results.multiHandLandmarks ||
        results.multiHandLandmarks.length === 0
    ) {

        gestureText.innerText =
            "👋";

        meaningText.innerText =
            "Show your hand";

        return;

    }


    // --------------------------------------------------------
    // GET HAND LANDMARKS
    // --------------------------------------------------------

    const landmarks =
        results.multiHandLandmarks[0];


    // --------------------------------------------------------
    // DRAW HAND
    // --------------------------------------------------------

    if (
        typeof drawConnectors !==
        "undefined"
    ) {

        drawConnectors(
            ctx,
            landmarks,
            HAND_CONNECTIONS,
            {
                color: "#00FFFF",
                lineWidth: 3
            }
        );


        drawLandmarks(
            ctx,
            landmarks,
            {
                color: "#FF00FF",
                lineWidth: 2
            }
        );

    }


    // --------------------------------------------------------
    // DETECT GESTURE
    // --------------------------------------------------------

    const detected =
        detectGesture(landmarks);


    if (
        detected &&
        gestureMap[detected]
    ) {

        gestureText.innerText =
            gestureMap[detected].symbol;


        meaningText.innerText =
            gestureMap[detected].text;

    }

}


// ============================================================
// FINGER FUNCTIONS
// ============================================================

function isIndexOpen(l) {

    return l[8].y < l[6].y;

}


function isMiddleOpen(l) {

    return l[12].y < l[10].y;

}


function isRingOpen(l) {

    return l[16].y < l[14].y;

}


function isPinkyOpen(l) {

    return l[20].y < l[18].y;

}


function isThumbOpen(l) {

    return Math.abs(
        l[4].x - l[2].x
    ) > 0.08;

}


// ============================================================
// FINGER PATTERN
// ============================================================

function getPattern(l) {

    const thumb =
        isThumbOpen(l);

    const index =
        isIndexOpen(l);

    const middle =
        isMiddleOpen(l);

    const ring =
        isRingOpen(l);

    const pinky =
        isPinkyOpen(l);


    return {

        thumb,
        index,
        middle,
        ring,
        pinky

    };

}


// ============================================================
// GESTURE DETECTION
// ============================================================

function detectGesture(l) {

    const p =
        getPattern(l);


    // --------------------------------------------------------
    // 1. OPEN HAND
    // --------------------------------------------------------

    if (
        p.thumb &&
        p.index &&
        p.middle &&
        p.ring &&
        p.pinky
    ) {

        return "GESTURE_01";

    }


    // --------------------------------------------------------
    // 2. FIST
    // --------------------------------------------------------

    if (
        !p.index &&
        !p.middle &&
        !p.ring &&
        !p.pinky
    ) {

        if (p.thumb) {

            return "GESTURE_03";

        }

        return "GESTURE_02";

    }


    // --------------------------------------------------------
    // 3. THUMB UP
    // --------------------------------------------------------

    if (
        p.thumb &&
        !p.index &&
        !p.middle &&
        !p.ring &&
        !p.pinky &&
        l[4].y < l[3].y
    ) {

        return "GESTURE_03";

    }


    // --------------------------------------------------------
    // 4. THUMB DOWN
    // --------------------------------------------------------

    if (
        p.thumb &&
        !p.index &&
        !p.middle &&
        !p.ring &&
        !p.pinky &&
        l[4].y > l[3].y
    ) {

        return "GESTURE_04";

    }


    // --------------------------------------------------------
    // 5. INDEX ONLY
    // --------------------------------------------------------

    if (
        p.index &&
        !p.middle &&
        !p.ring &&
        !p.pinky
    ) {

        return "GESTURE_06";

    }


    // --------------------------------------------------------
    // 6. PEACE
    // --------------------------------------------------------

    if (
        p.index &&
        p.middle &&
        !p.ring &&
        !p.pinky
    ) {

        return "GESTURE_07";

    }


    // --------------------------------------------------------
    // 7. THREE FINGERS
    // --------------------------------------------------------

    if (
        p.index &&
        p.middle &&
        p.ring &&
        !p.pinky
    ) {

        return "GESTURE_11";

    }


    // --------------------------------------------------------
    // 8. FOUR FINGERS
    // --------------------------------------------------------

    if (
        p.index &&
        p.middle &&
        p.ring &&
        p.pinky &&
        !p.thumb
    ) {

        return "GESTURE_17";

    }


    // --------------------------------------------------------
    // 9. INDEX + PINKY
    // --------------------------------------------------------

    if (
        p.index &&
        !p.middle &&
        !p.ring &&
        p.pinky
    ) {

        return "GESTURE_10";

    }


    // --------------------------------------------------------
    // 10. THUMB + INDEX
    // --------------------------------------------------------

    if (
        p.thumb &&
        p.index &&
        !p.middle &&
        !p.ring &&
        !p.pinky
    ) {

        return "GESTURE_05";

    }


    // --------------------------------------------------------
    // 11. THUMB + MIDDLE
    // --------------------------------------------------------

    if (
        p.thumb &&
        !p.index &&
        p.middle &&
        !p.ring &&
        !p.pinky
    ) {

        return "GESTURE_20";

    }


    // --------------------------------------------------------
    // 12. THUMB + RING
    // --------------------------------------------------------

    if (
        p.thumb &&
        !p.index &&
        !p.middle &&
        p.ring &&
        !p.pinky
    ) {

        return "GESTURE_21";

    }


    // --------------------------------------------------------
    // 13. THUMB + PINKY
    // --------------------------------------------------------

    if (
        p.thumb &&
        !p.index &&
        !p.middle &&
        !p.ring &&
        p.pinky
    ) {

        return "GESTURE_18";

    }


    // --------------------------------------------------------
    // 14. INDEX + RING
    // --------------------------------------------------------

    if (
        !p.thumb &&
        p.index &&
        !p.middle &&
        p.ring &&
        !p.pinky
    ) {

        return "GESTURE_13";

    }


    // --------------------------------------------------------
    // 15. INDEX + MIDDLE + PINKY
    // --------------------------------------------------------

    if (
        p.index &&
        p.middle &&
        !p.ring &&
        p.pinky
    ) {

        return "GESTURE_19";

    }


    // --------------------------------------------------------
    // 16. INDEX + RING + PINKY
    // --------------------------------------------------------

    if (
        p.index &&
        !p.middle &&
        p.ring &&
        p.pinky
    ) {

        return "GESTURE_14";

    }


    // --------------------------------------------------------
    // 17. MIDDLE + RING
    // --------------------------------------------------------

    if (
        !p.index &&
        p.middle &&
        p.ring &&
        !p.pinky
    ) {

        return "GESTURE_22";

    }


    // --------------------------------------------------------
    // 18. MIDDLE + PINKY
    // --------------------------------------------------------

    if (
        !p.index &&
        p.middle &&
        !p.ring &&
        p.pinky
    ) {

        return "GESTURE_23";

    }


    // --------------------------------------------------------
    // 19. RING + PINKY
    // --------------------------------------------------------

    if (
        !p.index &&
        !p.middle &&
        p.ring &&
        p.pinky
    ) {

        return "GESTURE_24";

    }


    // --------------------------------------------------------
    // 20. INDEX + MIDDLE + RING
    // --------------------------------------------------------

    if (
        p.index &&
        p.middle &&
        p.ring &&
        !p.pinky
    ) {

        return "GESTURE_29";

    }


    // --------------------------------------------------------
    // 21. INDEX + MIDDLE + RING + PINKY
    // --------------------------------------------------------

    if (
        p.index &&
        p.middle &&
        p.ring &&
        p.pinky &&
        !p.thumb
    ) {

        return "GESTURE_17";

    }


    // --------------------------------------------------------
    // 22. INDEX + PINKY + THUMB
    // --------------------------------------------------------

    if (
        p.thumb &&
        p.index &&
        !p.middle &&
        !p.ring &&
        p.pinky
    ) {

        return "GESTURE_09";

    }


    // --------------------------------------------------------
    // 23. THUMB + INDEX + MIDDLE
    // --------------------------------------------------------

    if (
        p.thumb &&
        p.index &&
        p.middle &&
        !p.ring &&
        !p.pinky
    ) {

        return "GESTURE_26";

    }


    // --------------------------------------------------------
    // 24. THUMB + INDEX + RING
    // --------------------------------------------------------

    if (
        p.thumb &&
        p.index &&
        !p.middle &&
        p.ring &&
        !p.pinky
    ) {

        return "GESTURE_27";

    }


    // --------------------------------------------------------
    // 25. THUMB + MIDDLE + RING
    // --------------------------------------------------------

    if (
        p.thumb &&
        !p.index &&
        p.middle &&
        p.ring &&
        !p.pinky
    ) {

        return "GESTURE_28";

    }


    // --------------------------------------------------------
    // 26. THUMB + RING + PINKY
    // --------------------------------------------------------

    if (
        p.thumb &&
        !p.index &&
        !p.middle &&
        p.ring &&
        p.pinky
    ) {

        return "GESTURE_25";

    }


    // --------------------------------------------------------
    // 27. INDEX + MIDDLE + RING + THUMB
    // --------------------------------------------------------

    if (
        p.thumb &&
        p.index &&
        p.middle &&
        p.ring &&
        !p.pinky
    ) {

        return "GESTURE_30";

    }


    // --------------------------------------------------------
    // 28. INDEX + MIDDLE + PINKY + THUMB
    // --------------------------------------------------------

    if (
        p.thumb &&
        p.index &&
        p.middle &&
        !p.ring &&
        p.pinky
    ) {

        return "GESTURE_08";

    }


    // --------------------------------------------------------
    // 29. INDEX + RING + PINKY + THUMB
    // --------------------------------------------------------

    if (
        p.thumb &&
        p.index &&
        !p.middle &&
        p.ring &&
        p.pinky
    ) {

        return "GESTURE_16";

    }


    // --------------------------------------------------------
    // 30. ALL FINGERS
    // --------------------------------------------------------

    if (
        p.thumb &&
        p.index &&
        p.middle &&
        p.ring &&
        p.pinky
    ) {

        return "GESTURE_12";

    }


    return null;

}


// ============================================================
// SPEECH
// ============================================================

speakButton.addEventListener(
    "click",
    function() {

        const text =
            meaningText.innerText;


        if (
            !text ||
            text === "Show your hand" ||
            text === "No hand detected"
        ) {

            return;

        }


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang =
            "en-US";


        speech.rate =
            0.9;


        speech.pitch =
            1;


        window.speechSynthesis.cancel();


        window.speechSynthesis.speak(
            speech
        );

    }
);