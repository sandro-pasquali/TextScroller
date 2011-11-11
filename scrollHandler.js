
function $scrollHandler(id,ref,t,w,h,spd,dist)
  {
	var agent = navigator.userAgent.toLowerCase(); 
    this.MAC   = (agent.indexOf("mac")!=-1);
    this.OPERA = (agent.indexOf("opera") != -1); 
    this.NS = (agent.indexOf('mozilla')!=-1 && agent.indexOf('spoofer')==-1 && agent.indexOf('compatible') == -1 && agent.indexOf('opera')==-1 && agent.indexOf('webtv')==-1); 
    this.NS4 = (document.layers);
	this.NS6 = (this.NS && (parseInt(navigator.appVersion) == 5));
	this.SIX = (document.getElementById);
	this.IE = (document.all && !this.SIX);
    this.id = id;
	this.width = w;
	this.height = h;
	this.top = t; 
	this.loop = 0;
	this.delay = 0;
	this.auto = false;
	this.terminalFunction = null;
	this.scrollTop = t;
	this.speed = spd || 25;
	this.scrollDistance = dist || 4;
	this.canvasHeight = 0;
	this.scrollPosition = 0;
	this.scrollClipTop = 0;
	
	this.ref = this.getRef(ref);
	this.scrollerHeight = (this.NS4) ? this.ref.clip.height
	                      : ((this.MAC && this.SIX) || this.NS6) ? this.ref.offsetHeight
									                             : this.ref.clientHeight;
    												
	if(this.NS4)
	  {
        this.ref.clip.height = this.height;
		this.ref.clip.width = this.width;
	  }
	else 
	  {
        this.ref.style.clip = 'rect(0px ' + this.width + 'px ' + this.height + 'px 0px)';
	  }
  }

$scrollHandler.prototype.timer = null;
$scrollHandler.prototype.getRef = function(r)
  {
    if(this.NS4) 
	  {
        // NS code from www.webmonkey.com, slightly modified
        var WM_layers = new Array();
        with (document) {
          for (i=0; i<layers.length; i++) WM_layers[i]=layers[i]; {
            for (i=0; i<WM_layers.length; i++) {
              if (WM_layers[i].document && WM_layers[i].document.layers) {
                for (j=0; j<WM_layers[i].document.layers.length; j++) {
                  WM_layers[WM_layers.length] = WM_layers[i].document.layers[j];
                }
                if(WM_layers[i].name == r){
                  return(WM_layers[i]);
                }
              }
            }
          }
		}
	  }
	else if(this.IE) { return(document.all[r]); }
	else { return(document.getElementById(r)); }
	return(false);
  }  
  
$scrollHandler.prototype.handleScroll = function(up)
  {
    if((up&&this.scrollPosition>0)||(!up&&this.scrollPosition<(this.scrollerHeight-this.height)))
	  {
	    this.scrollPosition = (up) ? this.scrollPosition - this.scrollDistance
		                           : this.scrollPosition + this.scrollDistance;
		this.scrollClipTop = (up) ? this.scrollClipTop - this.scrollDistance 
		                          : this.scrollClipTop + this.scrollDistance;
		this.scrollTop = (up) ? this.scrollTop + this.scrollDistance 
		                      : this.scrollTop - this.scrollDistance;
        this.move();
		this.timer = setTimeout(this.id +'.handleScroll('+((up)?1:'')+')',this.speed);
	  }
	else if(this.auto)
	  {
		if(this.loop-1>0)
		  {
		    --this.loop;
            setTimeout(this.id + '.reset();' + this.id + '.handleScroll();',this.delay);
		  }
		else { eval(this.terminalFunction); }
	  }
	return;
  }
  
$scrollHandler.prototype.move = function()
  {
    if(this.NS4)
	  {
	    this.ref.top = this.scrollTop;
        this.ref.clip.top = this.scrollClipTop;
		this.ref.clip.height = this.height;
	  }
	else 
	  {
		this.ref.style.top = this.scrollTop;
        this.ref.style.clip = 'rect(' + this.scrollClipTop + 'px ' + this.width + 'px ' + (this.height+this.scrollPosition) + 'px 0px)';
	  }    
	return;
  }  

$scrollHandler.prototype.reset = function()
  {
    this.scrollTop = this.top;
	this.scrollClipTop = 0;
	this.scrollPosition = 0;
	return;
  }  

$scrollHandler.prototype.repeat = function(loop,del,fun,spd,dist)
  {
    this.speed = spd || this.speed;
	this.scrollDistance = dist || this.scrollDistance;
	this.delay = del || 0;
	this.loop = loop || 0;
	this.auto = true;
	this.terminalFunction = fun || '';
	this.reset();
	this.handleScroll();
	return;
  }  
  
$scrollHandler.prototype.killScroll = function()
  {
    clearTimeout(this.timer);
	return;
  }
  
