// Brim.js
    // import Ticker from 'fido/system/Ticker';
    // import Device from 'fido/system/Device';

    /**
     * Manage orientation modes and trigger events
     * @param {String} mode
     */
    class Brim
    {
        constructor(){

        	this.isMobile = false;
        	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        		this.isMobile = true;
        	}


        	this.isSafari = false;
        	var ua = navigator.userAgent.toLowerCase(); 
        	if (ua.indexOf('safari') != -1) { 
        	  if (ua.indexOf('chrome') > -1) {
        	    this.isSafari = false;
        	  } else {
        	    this.isSafari = true;
        	  }
        	}

        	if(!this.isMobile || !this.isSafari) {
        		return;
        	}

            // if(!Device.instance.isMobile || !Device.instance.safari)return;

            // if(!Device.instance.webGL)return;

            var spec = this.getSpec();

            console.log('spec:', spec);
            console.log(window.innerHeight);

            // if(!spec)return;

            this.activeCache = false;
            this.height = window.innerHeight * 2;

            window.addEventListener('resize', this.onResize.bind(this));

            this.div = document.createElement('div');

            // this.div.style.backgroundColor = 'rgba(255, 255, 255, .1)';
            this.div.className = 'brim';
            // this.div.style.position = 'absolute';
            // this.div.style.top = '0';
            // this.div.style.left = '0';
            // this.div.style.width = '100%';
            this.div.style.height = '9999999999999999px';
            let p = document.createElement("p");
            p.innerHTML = 'test brim';

            document.body.appendChild(this.div);
            this.div.appendChild(p);


            (function () {
                var firstMove;

                document.addEventListener('touchstart', function (e) {

                    if(this.brimMode)
                {

                        firstMove = true;
                        e.preventDefault();
                        e.returnValue = false;
                    }
                }, false);

                document.addEventListener('touchmove', function (e) {
                	console.log('touch move');
                    this.showGame();
                	window.scrollTo(0, 1);

                    if(this.brimMode) {
                        if (firstMove){
                            e.preventDefault();
                            e.returnValue = false;
                        }

                        firstMove = false;
                    }
                }, false);

            } ());

            this.onResize();
        }



        getSpec()
        {
            var specs = [
            [320, 480, 2, 'iPhone 4'],
            [320, 568, 2, 'iPhone 5 or 5s'],
            [375, 667, 2, 'iPhone 6'],
            [414, 736, 3, 'iPhone 6 plus']
            ];

            let goodspec = [414, 736, 3, 'iPhone 6 plus'];

            for (var i = 0; i < specs.length; i++)
            {
                var spec = specs[i];

                var match =  ((window.screen.height == (spec[0]) && window.screen.width  == (spec[1]) ) || (window.screen.width  == (spec[0]) && window.screen.height == (spec[1]) ) );


                if(match){

                    goodspec = spec;
                    break;
                }
            }

            return goodspec;//[320, 480, 2, 'iPhone 4'];
        }

        showBrim() {
            this.div.style.visibility = 'visible';
            this.div.style.height = '9999999999999999px';
        }


        showGame() {
        	console.log('show game');
            this.div.style.height = this.height + 1 + 'px';
            window.scrollTo(0, 0);
        }

        onResize() {
            if( (window.innerHeight > window.innerWidth) || (window.innerHeight === this.height) ) {
                this.showGame();
            } else {
                this.showBrim();
            }

            window.scrollTo(0, 0);
        }
  }

export default new Brim();