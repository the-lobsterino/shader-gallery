//time^time edition  with an emergent rainbows or a few, but be careful for not by water but by fire shall it end
//meta-helm of salvation engaged (it's sorta auric and ) with a gold and silver shield of faith 
//a sharp double edged sword comes from his mouth (his word is a high sword)
//like a lamb to the slaughter, the suffering servant, a bit through his nose just as he grows full

//Isaiah 53: https://www.biblegateway.com/passage/?search=isaiah%2053&version=NKJV
//the transgressions he took: https://biblehub.com/2_kings/19-28.htm
// co3moz - mandelbrot
// X-  Christ Jesus made all. 
//Check out www.zonex.rf.gd
//https://biblehub.com/revelation/5-6.htm seven eyed seven horned lamb with four living creatures covered in eyes
//four creatures present now
//make sure to up the resolution in the top left; it's the number.  Try 1 to start.
precision highp float;
	uniform sampler2D backbuffer;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITERATION 28
float time_=  time/10.;
	float rate = 0.;
float degrees2radians = 180./3.14159;
float golden_mean = -cos(216.*degrees2radians)/-cos(612.*degrees2radians)-1.; 
//cos(216)/cos(612)=2.61....I was born 24 hours before 6:12 Jan(1), 6, I use the golden ratio to stagger because of its supreme irrationality
//above identity was discovered by intuition and above factoid.  There's more to the story but this is neither time_ nor place
//though that's what the story is about.

float b = pow(2.,2.);
vec3 scroll(vec2 p,	bool unleashed) {
  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;
float flip;
		if(rate!=0.)		 flip=-sin(3.14/2.+rate*time_);
		else	 flip=-sin(1.0*time_+1.0)-1.15;
	
	if (flip<0.) p = -p;
	if (abs(p.x*p.x+p.y*p.y)<7.0||unleashed)
  for (int t = 0; t < ITERATION; t++) {
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x*p.x), (2.0* s.x * s.y + flip*p.y*p.y));
	  if(b==2. ||rate == 0.)
	  s.x = -1./s.x;

else
	  s.x = pow(s.x,flip)*sign(s.x*flip);



	 
	  
	  l = length(s);
    d += l/40.;
    if (l >19.0 )  
	    if (t  >-1 )
	    		    return vec3(-sin(time_)+.717);
	  //  else 
	//	    return vec3(1.-sin(d *1.618+time_*.618),1.- sin(d * 0.618+time_*1.618),1.-sin(d *1.+time_*1.));
  }

  return vec3(0.);
}

vec3 man(vec2 p,bool unleashed) {
  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;
			float flip=-sin(3.14*3./2.+rate*time_);
	
	if (flip<0.) p = -p;


	if (abs(p.x*p.x+p.y*p.y)<2.0||unleashed){
  for (int t = 0; t < ITERATION*2; t++) {
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x), (1.* s.x * s.y + flip*p.y)); //2 changed to 1 in this draft
	  
	  //this is a reorientation and riff
	  // off of (read inspired by) the feedback loop x <= 1/(1/x-x).  This pattern starts false and generates increasingly many solutions.
	  //. essentially the image is the Mandelbrot set only with 1/real-imag in place of the standard complex number as x's argument.  
	  // 1/real-imag turns out to equate to essentially an identical image to real-1/imag which seems more elegant
	  // remove the below line to see that it is the only core difference in the equations of the Mandelbrot and This image.

	  if(b==2. ||rate == 0.)
	  s.x = 1./s.x;

	 else
	  s.x = 1./pow(s.x,flip)*sign(s.x*flip); //"1./" is new for this draft

	 
	  
	  l = length(s);
	  		    d += l/25.;
	  if(t!=0)
		if (l >20.0 ) 
	return vec3((-sin(time_))+(-sin(time_+3.14/2.)))*sin(golden_mean*time_)/2.;
		     
			 

		   
	  }
		return vec3(-(-sin(time_))*2.+(-sin(time_+3.14/2.)))*-sin(time_)/2.;
}
		return vec3(-0.);
}
vec3 eagle(vec2 p,	bool unleashed) {
  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;
		  			float flip=-sin(3.14*3./2.+rate*time_)/abs(sin(time_)*2.+1.);
		if (flip<0.) p = -p;
	if(abs(6.67*p.x*p.x+p.y*p.y*2.)<700.0 ||unleashed)
  for (int i = 0; i < ITERATION; i++) {


    s = vec2(-((sin(time_*2.)+1.5)/2.*(s.x * s.x - s.y * s.y) +flip* p.x), (1.* s.x * s.y + flip*p.y)); //2 changed to 1 in this draft
	 
	  if(b<=.5 ||rate == 0.)
	  s.x = 1./s.x;

	 else
	  s.x = 1./pow(s.x,flip)*sign(s.x*flip); //"1./" is new for this draft

	
	  	  s.y = s.x*s.y;
	  l = length(s);
    d +=2.;
	  float nn = 0.0;
	  //if (p.x*p.x+p.y*p.y>1.) 
		 // nn=(p.x*p.x+p.y*p.y);
    if (l >(20.0+nn) ) if( float(i)>3.&&float(i)>3.) 
	    return vec3(1.-sin(d * 0.003)-.5,1.- sin(d * 0.9)-.5,1.- sin(d * 0.1)-.5);
  }

  return vec3(.0);
}

vec3 lion(vec2 p,	bool unleashed) {
  vec2 s = p.yx;
	p=p.yx;

  float d = 0.0, l;

			float flip=-sin(3.14/2.+rate*time_);
	if (flip<0.) p = -p;
	if(p.x*p.x*1.+p.y*p.y*2.<21.||unleashed)
  for (int t = 0; t < ITERATION; t++) {
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x), (2.0* s.x * s.y + flip*p.y));

	s/=2.0;
	  if(b==2. ||rate == 0.)
	  s.x = -1./s.x;
	 else
	  s.x = pow(s.x,flip)*sign(s.x*flip);




	 
	  l = length(s);
    d += l/40.;
	  
    if (l >14.0 )  
	    if (float(t)  >2.)
		    return vec3(-sin(d +time_/10.*1./golden_mean*2.)+.2,-sin(d +time_/10.*golden_mean*2.)+.2,-sin(d /10.*time_*2.)+.2);
		   	    		 ;  // return vec3(0.);
  }

  return vec3(.0);
}


vec3 ox(vec2 p,	bool unleashed) {

  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;

			float flip=-sin(3.14/2.+rate*time_);
	if (flip<0.) p = -p;
	if( (p.x+.25)*(p.x+.25)+p.y*p.y<1.||(p.x>0.&& p.x*p.x+p.y*p.y<7. )||unleashed)
  for (int t = 0; t < ITERATION; t++) {
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x), (3.0* s.x * s.y + flip*p.y));

	  if(b==2. ||rate == 0.)
	  s.x = -1./s.x;
	 else
	  s.x = pow(s.x,flip)*sign(s.x*flip);


	 
	  
	  l = length(s);
    d += l/10.+l;
    if (l >14.0 )  
	    if (float(t)  >2.)
		    return vec3(-sin(d +time_*1./golden_mean*2.),-sin(d +time_*golden_mean*2.),-sin(d *time_*2.))*10.;
		   	    		 ;  // return vec3(0.);
  }

  return vec3(.0);
}

vec3 lamb(vec2 p, bool helmed) {
  vec2 s = p.yx;
	p=p.yx;
		float  ll;
	    float active = 8.+-sin(-time_)*6.;
  float d = 0.0, l;
			float flip=-sin(3.14/2.+rate*time_);
	if (flip<0.) p = -p;
		  float nn = (p.x*p.x+p.y*p.y);
	vec3 coloration;
  for (int t = 0; t < ITERATION; t++){
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x), (2.0* s.x * s.y + flip*p.y)); 
	  
	  //this is a reorientation and riff
	  // off of (read inspired by) the feedback loop x <= 1/(1/x-x).  This pattern starts false and generates increasingly many solutions.
	  //. essentially the image is the Mandelbrot set only with 1/real-imag in place of the standard complex number as x's argument.  
	  // 1/real-imag turns out to equate to essentially an identical image to real-1/imag which seems more elegant
	  // remove the below line to see that it is the only core difference in the equations of the Mandelbrot and This image.
	  if(b==2. ||rate == 0.)
	  s.x = -1./s.x;
	 else
	  s.x = pow(s.x,flip)*sign(s.x*flip);


 d +=s.x+s.y+20.;
ll = length(s);
	  if (ll >(20.0+nn)&&helmed )
		  
			  return vec3(1.-sin(d * 0.0061),1.- sin(d * 0.006),1.- sin(d * 0.0069));
	 

	  l = 3.+length(s*golden_mean/3.5);
	  		    d += golden_mean*.777;
	
				  coloration = .5-vec3(1.-sin(d * 0.0061),1.- sin(d * 0.0063),1.- sin(d * 0.0069));
		   if( length(p)<7.2 && t>(ITERATION-2)  &&helmed)
				 		 			 if(flip<0.)return coloration;
			else return vec3(1.0,.0,0.);
			   
			   active = 15.;
	  if (l >35.0-active) 
	  {


	  

	  float colorshift = .5+-abs(sin(-time_/2.+3.14*.25))/2.;
	  float colorshift1 = .5+-abs(sin(-time_/2.-3.14*.25))/2.;
	  float colorshift2 = .5+-sin(-time_-3.14/3.);
		  	    if (t != 1 || (p.x>-.1 || abs(p.y)<.3))
	    if (t > 3)
		     
		    return 2.*colorshift2*colorshift2*vec3(.5+sin(float(t) * 0.05)-.5,.5-sin(float(t) * 0.2)-.5,sin(d * 0.01)-.5)
		    
		    +2.*colorshift1*colorshift1*vec3(10.)+
		    		    -2.*colorshift*colorshift*vec3(10.)+
		    2.*vec3(-sin(d+golden_mean +time_*1./golden_mean*.7),-sin(d*1. +time_*golden_mean*.7),-sin(d+1./golden_mean +time_*.7));
	    else if( abs(p.y)>2.||( ( p.x>(.8+active/10.)||p.x<1.)) || rate != 0.0 )
	    {
    s = vec2(((p.x * p.x - p.y *p.y) +flip* p.x), (2.0* p.x * p.y + flip*p.y)); 
		    	  l = 3.+length(s*golden_mean/3.5);
		 return 
		// (vec3(1.-sin(100.*d *1.618+time_*.618),1.- sin(10.*d *1.0+time_*1.618),1.-sin(50.*d * 0.618+ti)me*1.)) )
		vec3(1.-(sin(333.*golden_mean/l*-sin(time_*1./golden_mean/5.)*-sin(time_*-golden_mean/5.+1.57))-sin(1.1*1./golden_mean*-time_))/2.,
		     1.- (sin(333./golden_mean*-l*(-sin(time_*-golden_mean/5.+1.57)*-sin(time_*golden_mean/5.+1.57/2.)*+2.))-sin(.1*time_*golden_mean))/2.
		     ,1.-(sin(333.*l* -(sin(time_*golden_mean/5.+1.57/2.)*-sin(time_*1./golden_mean/5.)+2.))-sin(1.1* golden_mean*-time_))/2.
		    )/2.;
	    }
	  
	  else
		  //blood from being slain and pierced
		  		//  return	 vec3(0.,0.,1.)/p.x/p.x/p.x*8.*(abs(-sin(-time_/2.+3.14/2.))-.5);
		  //firebreath! vvvv

		  	return	 vec3((1.-.5*sin(p.x/2.)),(1.-.9*sin(p.x*1.)),(.1-.7*sin(p.x*2.)))/p.x/p.x/p.x*5.;
		  }
}


  return vec3(flip*((-sin(time_)-1.)/2.));
}
//ezekiel describes these creatures with 4 wings, revelations with 6, so I went with something related
vec3 wings (vec2 p){
	

    vec3 destColor = vec3(.2);
    float f = 0.0;
	p*=5.;
	vec2 reincrementation = vec2 (0.);
	    for(float m = 0.0; m < 7.0; m++){
    for(float i = 0.0; i < 6.0; i++){
        float s = -sin(3.141/3.*i);
        float c = -cos(3.141/3.*i);

	    float val = pow((p.y+s+reincrementation.y)*(p.y+s+reincrementation.y)+(p.x+c+reincrementation.x)*(p.x+c+reincrementation.x),.5);
	    if (val>1.&& val<1.04)
        f = 2.*(val+(p.y*p.y+p.x*p.x-9.)/10.);
    }
		    reincrementation = vec2(-sin(3.141/3.*m),-cos(3.141/3.*m));
}
	return vec3(f*destColor);
}
	

vec3 sword(vec2 p,	bool unleashed) {
	
	//p.y = 1./p.y;
  vec2 s = p.yx;
	p=p.yx;
	p.x+=100.*(-sin(time_*2.)+1.)/2.-6.;
  float d = 0.0, l;
if (p.x>-4.0 && abs(p.y*p.x) <1.77 &&abs(p.y)<1.11111111||unleashed)
  for (int i = 0; i < 14; i++) {
    s = vec2(2./(1.-pow((s.x * s.x - s.y * s.y + p.x),2.)), -1.77/(2.0 * s.x * s.y + p.y));

	  
	  l = length(s);
    d +=s.x+s.y+20.;
	
    if (l >5.4)  return vec3(1.-sin(d * 0.0061),1.- sin(d * 0.063),1.- sin(d * 0.0069))/4.;
  }
return vec3(.0);	
  //return vec3(1.-sin((1./p.y*1./p.x)*3.14-time_*.819),1.-sin(1./p.x*1.618*p.y-time_*.618),1.-sin(0.-p.x*.618*3.14*p.y-time_*.618*.618));
}




vec2 FRACTALIZE(vec2 p) {
	p*=(-cos(time_)+2.5)*5.;
	float s = .5;
	float cs = -cos(time_*5.618);
	float sn = sin(-time_);
	mat2 rot = mat2(cs, sn, -sn, cs);
	for (int i = 0; i < 8; i++) {
		p = abs(p) / dot(p, p) - .5;
		p *= rot;
		s += .5-abs(sin(-time_*sin(time_)));
	}
	return p;
}

vec3 mandelbrot(vec2 p) {
  vec2 s = p;
  float d = 0.0, l;
	
  for (int i = 0; i < ITERATION; i++) {
    s = vec2(s.x * s.x - s.y * s.y + p.x, 2.0 * s.x * s.y + p.y);
	  s.y=-1./s.y;
    l = length(s);
    d +=20.;
    if (l > 20.0) return vec3(1.-sin(d * 0.003)-.5,1.- sin(d * 0.9)-.5,1.- sin(d * 0.1)-.5)*.1;//return vec3(1., 1, 1.);
  }
	
  return vec3(0.0);
}




vec3 lamp(vec2 p,bool unleashed) {
		p.y+=10.;
  vec2 s = p;
	p.xy = -p.yx;

  float d = 0.0, l;
	if (!(p.x<-4.)&&abs(p.y)<1.789||unleashed)
  for (int i = 0; i < 5; i++) {
    s = vec2(-1./(s.x * s.x - s.y * s.y + p.x),-1./( 2.0 * s.x * s.y + p.y));
    l = length(s);
    d += l + 0.2;
    if (l > 5.0 &&i>-1) return vec3(sin(-time_+d * 0.0314),- sin(time_+d * 0.02), -sin(time_+d * 0.01));
  }
	
  return vec3(0.0);
}




vec3 first_In_The_Room_JUst_cuz(vec2 p) {
  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;
			float flip=-sin(3.14/2.+rate*time);
	if (flip<0.) p = -p;
  for (int t = 0; t < ITERATION; t++) {
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x), (2.0* s.x * s.y + flip*p.y)); 
	  
	  //this is a reorientation and riff
	  // off of (read inspired by) the feedback loop x <= 1/(1/x-x).  This pattern starts false and generates increasingly many solutions.
	  //. essentially the image is the Mandelbrot set only with 1/real-imag in place of the standard complex number as x's argument.  
	  // 1/real-imag turns out to equate to essentially an identical image to real-1/imag which seems more elegant
	  // remove the below line to see that it is the only core difference in the equations of the Mandelbrot and This image.
	  s.x = pow(s.x,flip)*sign(s.x*flip);


	 
	  
	  l = length(s);
	  		    d += l/25.;
	
    if (l >19.0 )  
	    if (float(t)  >3. )
		    return vec3(-sin(d+golden_mean +time*1./golden_mean*.7),-sin(d*1. +time*golden_mean*.7),-sin(d+1./golden_mean +time*.7));
	    else if( float(t) ==0. &&( p.x>2.||p.x<-.2) || rate != 0.0)
	    {

		 return 
			 vec3(1.-sin(10000.*d *1.618+time*.618),1.- sin(10000.*d *1.0+time*1.618),1.-sin(10000.*d * 0.618+time*1.)) +
			 			 vec3(1.-sin(1.*d *1.618+time*.618),1.- sin(1.*d *1.0+time*1.618),1.-sin(1.*d * 0.618+time*1.)) 
			 ;
	    }
		    }

  return vec3(flip);
}

void main() {
	
	
	if (b == 2.0) rate = 0.;
	
  vec2 a = resolution.xy / min(resolution.x, resolution.y);
  vec2 p = ((gl_FragCoord.xy / resolution.xy) * 4.0  - 2.0) ;
				float flip=-sin(rate*time_+3.14);

	
	

	p/=1.1715;
	//p*=1.*(abs(-sin(time_))*.5+1.);
	// p+=sin(time_)*-1.;
  float f = sin(time_ * 0.10 + 99.0) * 0.5 + 0.5;
 // p *= pow(1.5, f * (-31.0));
  //ep += vec2(-1.002029, 0.303864);
	
  //gl_FragColor = vec4(1.0 - mandelbrot(p), 1.0);
	
p*=4.;
		float vertshift =.5;
	p.y-= vertshift;
	float shift = 4.2;
  float size = (-sin(time_)+3.)/5.3;
  vec2 oxCoord = vec2(p.x-shift,p.y-shift)*a/1.2*size;
vec2 lionCoord = vec2(p.x+shift,p.y+shift+vertshift)*a/1.2*size;
	vec2 eagleCoord = vec2(p.x-shift,p.y+shift +vertshift)*a/1.2*size;
	vec2 manCoord = vec2(p.x+shift,p.y-shift)*a/1.2*size;

	p*=a;
		float ratio = min(resolution.x, resolution.y)/max(resolution.x, resolution.y)*2.;
	float wingScale = 4./ratio;

	//lion head tilt
	float pixelangle = atan(lionCoord.y,lionCoord.x)-sin(time_)/6.+3.14/8.;
	float pixeldistance = pow((lionCoord.y*lionCoord.y+lionCoord.x*lionCoord.x),.5);
	vec2 lionTiltCoord = -vec2(pixeldistance*ratio*2.*-cos(pixelangle),pixeldistance*ratio*2.*-sin(pixelangle));
  vec3 wingss = wings(oxCoord/wingScale)+wings(lionCoord/wingScale)+wings(eagleCoord/wingScale)+wings(manCoord/wingScale);
	vec3 swordDelimited = vec3(0.);
	if (p.y <-1.111)swordDelimited=1.*sword(vec2(p.x,-p.y),false);


vec4 zeroCenter =vec4(1.0);
	float dist = length(p);
		float distM = length(manCoord);
		float distL = length(lionCoord);
		float distO = length(oxCoord);
		float distE = length(eagleCoord);
		 if(dist<4. )
	 zeroCenter = vec4(dist/4.); 
			else if(distM<3. )
	 zeroCenter -= vec4(.9); 
				
	
			else if(distL<3. )
	 zeroCenter -= vec4(.9); 
			else if(distO<3. )
	 zeroCenter -= vec4(.95); 

			else if(distE<3. )
	 zeroCenter -= vec4(.95); 
				
  vec4 throne = 5.*vec4(5.*(2.*first_In_The_Room_JUst_cuz(p)+mandelbrot(p)*1.2-lamb(p,false)/3.+lamb(p,true)+swordDelimited*10.
			    +ox(ratio*oxCoord,false)-swordDelimited
			    +12.*lion(lionTiltCoord,false)+12.
		      *eagle(ratio*4.115*eagleCoord, false)
			    +4.*man(ratio*3.*manCoord,false)
		      +12.*scroll(ratio*4./2.0*vec2(p.x,p.y+3.),false)+ wingss)/2.5+
			
			lamp(vec2(p.x,p.y-2.),false), .5)*.25;
		//p = FRACTALIZE(p);
	vec4	colorBuffer ;
		vec4	colorBufferOriginal ;
				float timeBuffer = time_;
	for(float reps = 1.; reps<2.; reps+=1.)

	
	{
	//time_+=.1*-sin(time_+dist);
float quasifractilator_gate =(-sin(time_)*.1);
   oxCoord = FRACTALIZE(oxCoord)-cos(-time_)*quasifractilator_gate;
 lionCoord = FRACTALIZE(lionCoord)-cos(time_+1.)*quasifractilator_gate;
	 eagleCoord =FRACTALIZE(eagleCoord)-cos(-time_+2.)*quasifractilator_gate;
	 manCoord = FRACTALIZE(manCoord)-cos(time_+3.)*quasifractilator_gate;




	colorBuffer += .5* vec4(
		ox(ratio*oxCoord,true)
			    +lion(lionCoord,true)
			     
			   +man(ratio*2./2.0*manCoord,true)
		     +eagle(ratio*13./2.0*eagleCoord, true)
		,1.);			vec2 bbbb = FRACTALIZE(p);
		
		if(reps==1.){
			time_ = timeBuffer;

			
			colorBufferOriginal = vec4(lamb(bbbb,false)*lamb(bbbb,true)*25.
			       
			       +(sword(p,true)+ox(bbbb,true)+12.*lion(bbbb,true)+12.
		      *eagle(bbbb,true)+man(bbbb,true)
					    +12.*scroll(bbbb,true)+ wingss)/2.5+lamp(bbbb,true),1.)
;
}
		time_*=pow(time_,-1./time_);
		
	}
				time_ = timeBuffer;
		vec4 filterable =+(1.-zeroCenter)*throne+zeroCenter*((throne*vec4( vec3(-sin(tan(colorBufferOriginal.x))*.5+.5,
						      -sin(-tan(colorBufferOriginal.y))*.5+.5,
						      -sin(tan(colorBufferOriginal.z))*.5+.5), .1250)+colorBufferOriginal/3.)/2.*
			(vec4(swordDelimited,2.)+(1.-zeroCenter)*throne)
			+zeroCenter*(throne*vec4( 1.5))*
			(vec4(-sin(tan(colorBuffer.x))*.5+.5,
						      -sin(-tan(colorBuffer.y))*.5+.5,
						      -sin(tan(colorBuffer.z))*.5+.5,1.)*colorBuffer)*2.
			
			+
			
			.5*
			(throne*vec4( vec3(-sin(tan(colorBuffer.x))*.5+.5,
						      -sin(-tan(colorBuffer.y))*.5+.5,
						      -sin(tan(colorBuffer.z))*.5+.5), .1250)+colorBuffer/3.)/2.*
			(vec4(swordDelimited,2.)+(1.-zeroCenter)*throne)
			+zeroCenter*(throne*vec4( 1.5))*
			(vec4(-sin(tan(colorBufferOriginal.x))*.5+.5,
						      -sin(-tan(colorBufferOriginal.y))*.5+.5,
						      -sin(tan(colorBufferOriginal.z))*.5+.5,1.)*(colorBuffer+colorBufferOriginal/6.))*2.)
			;
	vec4 prefiltering = filterable;

	filterable +=-((1.-zeroCenter)*throne+zeroCenter*((throne*vec4( vec3(-sin(tan(colorBufferOriginal.x))*.5+.5,
						      -sin(-tan(colorBufferOriginal.y))*.5+.5,
						      -sin(tan(colorBufferOriginal.z))*.5+.5), .1250)+colorBufferOriginal/3.)/2.*
			(vec4(swordDelimited,2.)+(1.-zeroCenter)*throne)
			+zeroCenter*(throne*vec4( 1.5))*
			(vec4(-sin(tan(colorBuffer.x))*.5+.5,
						      -sin(-tan(colorBuffer.y))*.5+.5,
						      -sin(tan(colorBuffer.z))*.5+.5,1.)*colorBuffer)*2.
			
			-
			
			
			(throne*vec4( vec3(-sin(tan(colorBuffer.x))*.5+.5,
						      -sin(-tan(colorBuffer.y))*.5+.5,
						      -sin(tan(colorBuffer.z))*.5+.5), .1250)+colorBuffer/3.)/2.*
			(vec4(swordDelimited,2.)+(1.-zeroCenter)*throne)
			+zeroCenter*(throne*vec4( 1.5))*
			(vec4(-sin(tan(colorBufferOriginal.x))*.5+.5,
						      -sin(-tan(colorBuffer.y))*.5+.5,
						      -sin(tan(colorBuffer.z))*.5+.5,1.)*colorBufferOriginal)*2.));
			filterable/=3.;
	filterable +=throne*3.;
		filterable/=1.5;
filterable=(1.-zeroCenter)*throne+zeroCenter*filterable;
	filterable=(filterable+vec4(-tan(-sin(filterable.x)),-tan(-sin(filterable.y)),-tan(-sin(filterable.z)),1.));

vec4 rgba = texture2D(backbuffer,  FRACTALIZE(gl_FragCoord.xy)/2.).rgba+ texture2D(backbuffer,  (gl_FragCoord.xy)+3.*vec2(-sin(time),-cos(time))).rgba;
	//rgba.r*=3.1;
	gl_FragColor=filterable/100.+rgba*.3;
}
//a core concept in this piece is that nothing is twice itself (0 = 0*0 but if x/=0 then x/=2*x) since nothing IS twice nothing,
//and no nothing is anything then 0*0 = oo or really anything for that matter.  Except what it is said to equal which is 0.
//another aspect to attain the same result is that 0 = (0*0)= ( (0*0)* (0*0))= (( (0*0)* (0*0))*( (0*0)* (0*0)))...=0*oo = undefined = definable
//to reiterate think about the notion of calculus and integration and sums of infinitesimals.
//yet another aspect of this is that of the liars paradox ("this statement is false") and Godel's II theorem of Incompleteness
//to continue the Matiyasevich result to Hilbert's 10th(?) is said to prove Godel's aforementioned theorem.
//Matiyasevich used the golden ratio (or rather the fibonacci (son of good and bad as I've translated it) numbers)
///(and his predecessors on the theorem he established called the MRDP (matiyasevich Robinson Davis Putnam) used the silver ration)
//the result is interesting because the equation that inspired this mentioned earlier is x <= 1/(1/x-x) has it's first result at root(2)
//the silver ratio is 1+root(2).  The golden ratio is very similar to the Mandelbrot equation x = x^2 - 1 vs. x <= x^2 - c.
//long story short there are too many concepts to count or list, but believe this: 
//There is The God of Israel, The God of the Christian, The God of Creation.
//I believe this to be His Face, The Face of His Son, who was in the beginning and who forever will be.

//originals at II:http://glslsandbox.com/e#52855.0 (up to around .24 I think)
//I: http://glslsandbox.com/e#52851.2 (.2 is max draft)
//III: at this time_ caps at .47 http://glslsandbox.com/e#55353.47
//IIII: and this one http://glslsandbox.com/e#55496.0 goes up to ???
//actually this one is the parent of the present as of next post: http://glslsandbox.com/e#55945
//here's the current: http://glslsandbox.com/e#56016.32
