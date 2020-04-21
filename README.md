# OhShift Remote Console
A simple tool for monitoring console logs remotly via WebRTC connection.

**OhShiftLabs** www.ohshiftlabs.com

# How to use
\<script data-channel="testConsole" src="remoteJS.js">\</script>
- Set a unique channel name and set data-channel property then include to target website.

- Visit index.html Update **remoteConsole("testConsole")** function with your channel name. 

- Visit your target site.



# Used Libraries
- PeerJS https://peerjs.com/
- Highlight JS https://highlightjs.org/
- UA-Parser https://github.com/faisalman/ua-parser-js

## Caution
ES6 codes used, may not work in old browsers.

# ToDo
- Click Capture
- XHR Error Capture
- Log Screen single-line fix.
- Push cached events on reconnect.

# Issues
- Reconnect feature on disconnect sometimes not working

# Changelog 

## 0.0.3
- Interface updates
- Clear console button added.
- User agent parser added.

## 0.0.2
- XHR Request capture added

## 0.0.1
- Theme selector added
- Remote Console methods moved to class
- HLJS parser removed, replaced with a simpler one.
- HLJS styling used.
- Other various styling updates.