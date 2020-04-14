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


## Caution
ES6 codes used, may not work in old browsers.

#ToDo
- XHR Capture
- Click Capture


#Changelog 

## 0.0.1
- Theme selector added
- Remote Console methods moved to class
- HLJS parser removed, replaced with a simpler one.
- HLJS styling used.
- Other various styling updates.