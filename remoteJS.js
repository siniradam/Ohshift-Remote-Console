(function () {


	let peerJSPath = "https://cdn.jsdelivr.net/npm/peerjs@1.2.0/dist/peerjs.min.js"
    let peerJS = document.createElement('script');
	    peerJS.setAttribute("type", "text/javascript");
	    peerJS.setAttribute("src", peerJSPath);

	    class ohconsole {
	    	constructor (ID){

			    const me = document.querySelector('script[data-channel]');
				this.channel = me.getAttribute('data-channel');

	    		this.conn = {};
	    		this.peer = new Peer(null,{})
	    		this.logs = {app:[],site:[]}
	    		this.isConnected = false;
	    		this.isPaired = false;
	    		this.offlineLogs = [];

	    		this.config = {
	    			reconnect:true,
	    			reconnectTime:1000
	    		}


	    		window.logs = this.logs
	    		window.ohc = this;

				this.peer.on('open', (id)=>{
					this.id = id
					this.appLog(`Open: ${id}`)
					this.connect();
				});

				this.peer.on('close', (conn) => {
					this.appLog(`Close`)
					this.isConnected = false;
				});

				this.peer.on('disconnected', (conn) => {
					this.appLog(`Disconnected`);
					this.isConnected = false;
				});


				this.registerEvents();
	    	}

	    	init = (peer,comm)=>{

	    	}

	    	connect = () => {
	    		this.console.log("Trying to use channel "+this.channel,)
	    		this.comm = this.peer.connect(this.channel,{reliable: true})
	    		
	    		//On Remote Conn.
				this.comm.on('open',this.on.open);

				// Receive messages
				this.comm.on('data', this.on.data);//ON Data
				this.comm.on('close', this.on.close);//ON Data
				this.comm.on('error', this.on.error);//ON Data
				this.comm.on('disconnected', this.on.disconnected);//ON Data
	    	}

	    	capturedEvent = (type, object) =>{

	    	}


	    	appLog = (...log) => {
				let type = log.pop()
				if(this.console[type]){
					this.console[type](...log);
				}
//				console.log('%c a colorful message', 'background: green; color: white; display: block;');
	    		this.logs.app.push(...log)
	    	}

	    	siteLog = (...log) => {
	    		this.logs.site.push(...log)
			}

	    	registerEvents = ()=>{

	    		//Console.log
				let log = console.log;
				console.log = (...a) => {
					this.on.log(...a)
					log.apply(console, [...a]);
				}

				//Click??

				//XHR
				//https://stackoverflow.com/a/27363569/502649
				var origOpen = XMLHttpRequest.prototype.open;
				XMLHttpRequest.prototype.open = (...b) => {
					let request = { }//method:b 
					this.addEventListener('load', (e) => {
						request.url = e.targseet.responseURL;
						request.type = e.type;
						request.status = e.status;
						request.state = e.target.readyState
						this.on.xhr(request)
					});
					origOpen.apply(this, ...b);
				};

			}
			


			send = {

				log:(obj)=>{
	    			let request = {
	    				type:'log',
						log:{...obj},
						date:new Date().toDateString(),
						time:new Date().toLocaleTimeString()
					};
					this.comm.send(request);
	    		},

				offline:()=>{//Logs occured while offline
					//this.offlineLogs = [];
					let request = {
						type:"offlineLogs",
						logs:this.offlineLogs
					}
					this.comm.send(request);
				},
				handshake:()=>{
					let request = {
						type:"handshake",
						handshake:{
							ua:window.navigator.userAgent,
							url:window.location.href,
							date:new Date().toDateString(),
							time:new Date().toLocaleTimeString()
						}
					}
					this.comm.send(request);
				}
			}
			

	    	on = {
				log: (...log)=>{
					if(this.isPaired){
						this.send.log(...log)
					}else{
						this.console.warn("caching")
						this.offlineLogs.push(...log);
					}
				},

	    		click:(obj)=>{
	    			let request = {
	    				type:"click"
	    			};
					this.comm.send(request)
	    		},

	    		xhr:(obj)=>{
	    			let request = {
	    				type:"xhr",
	    				xhr:obj
	    			};
					this.comm.send(request);
	    		},

	    		data:(data)=>{//Received
	    			this.console.log(data);
	    		},

	    		//Remote Connection Events
	    		open:()=>{
	    			this.isPaired = true;
					this.appLog(`Remote Connection opened.`,"log");
					//this.appLog(`Connected`)
					this.send.handshake();
					this.isConnected = true;
	    		},

	    		close:(e)=>{
	    			this.isPaired = false;
	    			this.appLog(`Remote Connection closed.`,"warn");

	    			if(this.config.reconnect){
	    				this.appLog(`Will reconnect in ${this.config.reconnectTime}ms.`,"warn");
	    				setTimeout(this.connect, this.config.reconnectTime);
	    			}

	    		},

	    		disconnected:()=>{
	    			this.isPaired = false;
	    			this.appLog(`Remote Connection disconnected.`)

	    		},

	    		error:(e)=>{
	    			this.console.error(e);
	    			this.appLog(`Remote Connection Error.`)

	    		}
	    	}
			
			console = {
				log:(msg)=>{
					console.info(`${this.console.color(msg, this.console.Colors.Magenta)}`)
					//console.log(this.console.colors.bg.Green, this.console.colors.fg.Black, ...msg, this.console.colors.Reset)
				},
				error:(msg)=>{
					console.info(`${this.console.color(msg, this.console.Colors.Red)}`)
					//console.log(this.console.colors.bg.Green, this.console.colors.fg.Black, ...msg, this.console.colors.Reset)
				},
				warn:(msg)=>{
					console.info(`${this.console.color(msg, this.console.Colors.Yellow)}`)
					//console.log(this.console.colors.bg.Green, this.console.colors.fg.Black, ...msg, this.console.colors.Reset)
				},
				Colors: {
					Black : '\033[30m',
					Red : '\x1b[31m',
					Green : '\x1b[32m',
					Yellow : '\x1b[33m',
					Blue : '\033[34m',
					Magenta : '\033[35m',
					Cyan : '\033[36m',
					White : '\033[37m'
				},

				color:(text, color) => {
					return `${color}${text}\x1b[0m`;
				}
			}
	    }

	    peerJS.onload = ()=>{
	    	console.log("RS: Loaded")
	    	new ohconsole();

	    	//ConsoleLog Overwrite
	    };
    document.getElementsByTagName("head")[0].appendChild(peerJS);

})();
