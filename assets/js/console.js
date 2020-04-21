
class ohShiftConsole {

    constructor(channelName){
        this.version = "0.0.3";
        this.channelName = channelName;
        this.cons = {};
        this.init();
        this.remote = {};
    }


    init(){

        this.holder = document.getElementById("logs")

        //PeerJS
        let peerJSPath = "https://cdn.jsdelivr.net/npm/peerjs@1.2.0/dist/peerjs.min.js";
        this.peerJS = document.createElement('script');
        this.peerJS.setAttribute("type", "text/javascript");
        this.peerJS.setAttribute("src", peerJSPath);
        this.peerJS.onload = () => {
            console.log(`#RS: Loaded. Channel: ${this.channelName}`);
            this.peer = new Peer(this.channelName,{});//{key: ID}
            this.peer.on('open', this.mypeer.open)
            this.peer.on('connection', this.mypeer.connection)
            this.peer.on('error', this.mypeer.error)
        }
        document.getElementsByTagName("head")[0].appendChild(this.peerJS);


        this.utils.listThemes();
    }


    mypeer = {
        open:(id)=>{
            this.cons.id = id
            console.log("RS: Open",id)
            this.console.comment(`# Ready to accept messages on <span class="hljs-literal">${id}</span>`)
        },

        connection:(conn)=>{
            console.log(`Connected`);
            this.console.comment(`# Client Connected`)

            conn.on('data', this.mypeer.data);//On-Data
            conn.on("disconnect",()=>{
                this.console.comment(`## DISCONNECT ##\n`)
            });
            conn.on("close",()=>{
                this.console.comment(`## Closed ##\n`)
            });

        },

        data:(data)=>{
            if(typeof data =="object" && typeof data.type == "string"){
                switch(data.type){

                    case "handshake":
                        console.log(data)
                        document.querySelector('.datetime').innerText = data.handshake.time
                        document.querySelector('.ua').innerText = data.handshake.ua
                        this.remote = {
                            ua:new UAParser(data.handshake.ua),
                            time:data.handshake.time
                        }
                        this.gui.showRemoteDetails(this.remote);
                    break;

                    case "xhr":
                        //Console
                        if(document.getElementById('relayToConsole').checked){
                            console.log(data.log);
                        }

                        //GUI
                        this.console.add(`[XHR Request]`)
                        this.console.add(`${this.console.syntaxHighlight(JSON.stringify(data.xhr))}`)

                    break;

                    case "log":
                        //Console
                        if(document.getElementById('relayToConsole').checked){
                            console.log(data.log);
                        }
                        //GUI
                        this.console.add(`${this.console.syntaxHighlight(JSON.stringify(data.log))}`)
                    break;
                }
            }
        },

        error:(err)=>{
            console.log(err.name)
            this.console.error(`# Error: <span class="hljs-literal">${err.message}</span>`)
        }
    }


    console = {
        add:(msg)=>{
            let item = document.createElement("div")
                item.setAttribute("class","")
                item.innerHTML = msg
                this.holder.appendChild(item)

        },
        comment:(msg)=>{
            let item = document.createElement("div")
                item.setAttribute("class","hljs-comment")
                item.innerHTML = msg
                this.holder.appendChild(item)
        },
        error:(msg)=>{
            let item = document.createElement("div")
                item.setAttribute("class","hljs-operator")
                item.innerHTML = msg
                this.holder.appendChild(item)
        },
        syntaxHighlight:(json)=>{//https://stackoverflow.com/a/7220510/502649
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number hljs-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key hljs-attr';
                    } else {
                        cls = 'string hljs-string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean hljs-literal';
    
                } else if (/null/.test(match)) {
                    cls = 'null hljs-operator';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }

        
    }

    utils = {
        isJSON:(data)=>{
            try{ return JSON.parse(data) }
            catch{ return data }
        },

        listThemes:()=>{
            let list = document.getElementsByClassName('codestyle')
            let selection = document.getElementById("themes")
            Array.prototype.forEach.call(list, function(el) {
                if(el.getAttribute("data-name")){
                    let option = document.createElement("option");
                    option.text = el.getAttribute("data-name");
                    option.value = el.getAttribute("data-name");
                    selection.appendChild(option)
                }
            });

            document.getElementById("themes").onchange = this.gui.setTheme
            document.getElementById("clearConsole").onclick = this.gui.clearConsole;
        }
    }

    gui = {
        clearConsole:()=>{
            document.getElementById("logs").innerHTML = "";
            this.console.comment(`# Console Cleared.`)
        },
        setTheme:()=>{
            let name = document.getElementById("themes").value;
            let list = document.getElementsByClassName('codestyle')
            Array.prototype.forEach.call(list, function(el) {
                if(el.getAttribute("data-name")==name){
                    el.removeAttribute("disabled")
                }else{
                    el.disabled = true;
                }
            });
        },

        showRemoteDetails(remote){
            console.log(this.remote)
            let b = remote.ua.getBrowser();
            let os = remote.ua.getOS();
            document.getElementById("rbrowser").innerHTML = `${b.name} / ${b.version} / ${b.major}`
            document.getElementById("ros").innerHTML = `${os.name} / ${os.version}`
        }
    }
    
}