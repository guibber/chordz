chordz = function() {
    let activeKeys = "";
    let clearInterval = 300;
    let timeoutId = null;
    let chords = {};
    const MODE_COMPETE = 0;
    const MODE_MEEK = 1;
    let mode = MODE_COMPETE;

    function setInterval(v) {
        clearInterval = v;
    };

    function setModeCompete() {
        mode = MODE_COMPETE;
    };

    function setModeMeek() {
        mode = MODE_MEEK;
    };

    function scheduleFunc(func) {
        timeoutId = window.setTimeout(func, clearInterval);
    };

    function clearActiveKeys() { activeKeys = ""; }

    function cancelScheduledFunc() {
        if (timeoutId) {
            window.clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    function getModeString() {
        return mode === MODE_COMPETE ? "MODE_COMPETE" : "MODE_MEEK";
    };

    function log() {
        console.log("chordz: " + activeKeys);
    };

    function logSettings() {
        console.log("chordz: mode = " + getModeString() + " interval = " + clearInterval);
    };

    function checkMatch() {
        let chord = chords[activeKeys];
        return chord;
    };

    function callMatchingChord() {
        let match = checkMatch();
        log();
        if (match) {
            let ret = match();
            activeKeys = "";
            return ret;
        }
        activeKeys = "";
    }

    function handleCompeteKeydown(evt) {
        let match = checkMatch();
        log();
        if (match) {
            let ret = match();
            activeKeys = "";
            return ret;
        }
        cancelScheduledFunc();
        scheduleFunc(clearActiveKeys);
    };

    function handleMeekKeydown(evt) {
        cancelScheduledFunc();
        scheduleFunc(callMatchingChord);
    };

    function handleKeydown(evt) {
        activeKeys += evt.key;
        if (mode === MODE_COMPETE)
            return handleCompeteKeydown(evt);
        else
            return handleMeekKeydown(evt);
    };

    function register(chord, func) {
        chords[chord] = func;
    };

    function unregister(chord) {
        chords[chord] = null;
    };

    function init(initMode, initClearInterval) {
        mode = initMode || mode;
        clearInterval = initClearInterval | clearInterval;
        document.addEventListener("keydown", handleKeydown);
        logSettings();
    }

    return {
        init: init,
        register: register,
        unregister: unregister,
        setInterval: setInterval,
        setModeCompete: setModeCompete,
        setModeMeek: setModeMeek,
        MODE_COMPETE: MODE_COMPETE,
        MODE_MEEK: MODE_MEEK
    };
}();

chordz.init(chordz.MODE_MEEK);
