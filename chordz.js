chordz = function() {
    const MODE_COMPETE = 0;
    const MODE_MEEK = 1;

    function configure(el, initMode, initClearInterval) {
        let activeKeys = "";
        let clearInterval = 300;
        let timeoutId = null;
        let chords = {};
        let mode = MODE_MEEK;

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
            console.log("chordz:" + el.id + ':' + activeKeys);
        };

        function logSettings() {
            console.log("chordz:" + el.id + ":init mode=" + getModeString() + " interval=" + clearInterval);
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
            console.log('chordz:' + el.id + ':register "' + chord + '"');
            chords[chord] = func;
        };

        function unregister(chord) {
            chords[chord] = null;
        };

        mode = initMode || mode;
        clearInterval = initClearInterval | clearInterval;
        el.addEventListener("keydown", handleKeydown);
        el.tabIndex = el.tabIndex != -1 ? el.tabIndex : "1";
        logSettings();

        return {
            register: register,
            unregister: unregister,
            setInterval: setInterval,
            setModeCompete: setModeCompete,
            setModeMeek: setModeMeek,
        };
    }

    function init(id, initMode, initClearInterval) {
        let el = document.getElementById(id);
        if (!el) {
            console.log('failed to init chordz for element id = ' + id);
            return null;
        }
        el.chordz = configure(el, initMode, initClearInterval);
        return el.chordz;
    }

    return {
        init: init,
        MODE_COMPETE: MODE_COMPETE,
        MODE_MEEK: MODE_MEEK
    };
}();
