//like a lamb to the slaughter, the suffering servant, a bit through his nose just as he grows full

//Isaiah 53: https://www.biblegateway.com/passage/?search=isaiah%2053&version=NKJV
//the transgressions he took: https://biblehub.com/2_kings/19-28.htm
// co3moz - mandelbrot
// X-  Christ Jesus made all. 
//Check out www.zonex.rf.gd
//https://biblehub.com/revelation/5-6.htm seven eyed seven horned lamb with four living creatures covered in eyes
//four creatures present now
//make sure to up the resolution in the top left; it's the number.  Try 1 to start.
precision lowp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
precision lowp float;
#define ITERATION 100
	float rate = .0;
float degrees2radians = 180./3.14159;
float golden_mean = -cos(216.*degrees2radians)/-cos(612.*degrees2radians)-1.; 
//cos(216)/cos(612)=2.61....I was born 24 hours before 6:12 Jan(1), 6, I use the golden ratio to stagger because of its supreme irrationality
//above identity was discovered by intuition and above factoid.  There's more to the story but this is neither time nor place
//though that's what the story is about.

float b = pow(.5,2.);
vec3 scroll(vec2 p) {
  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;
float flip;
		if(rate!=0.)		 flip=-sin(3.14/2.+rate*time);
		else	 flip=-sin(1.0*time+1.0)-1.15;
	
	if (flip<0.) p = -p;
	if (abs(p.x*p.x+p.y*p.y)<7.0)
  for (int t = 0; t < ITERATION; t++) {
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x*p.x), (2.0* s.x * s.y + flip*p.y*p.y));
if(b<=.5)
	  s.x = -1./s.x;

else
	  s.x = pow(s.x,flip)*sign(s.x*flip);



	 
	  
	  l = length(s);
    d += l/40.;
    if (l >19.0 )  
	    if (t  >-1 )
	    		    return vec3(1.-sin(1000000.*d * .1618)*time,1.- sin(1000000.*d * 0.0618)*time,1.-sin(1000000.*d * 0.1)*time);
	  //  else 
	//	    return vec3(1.-sin(d *1.618+time*.618),1.- sin(d * 0.618+time*1.618),1.-sin(d *1.+time*1.));
  }

  return vec3(0.);
}

vec3 man(vec2 p) {
  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;
			float flip=-sin(3.14*3./2.+rate*time);
	if (flip<0.) p = -p;
	if (abs(p.x*p.x+p.y*p.y)<2.0)
  for (int t = 0; t < ITERATION; t++) {
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x), (1.* s.x * s.y + flip*p.y)); //2 changed to 1 in this draft
	  
	  //this is a reorientation and riff
	  // off of (read inspired by) the feedback loop x <= 1/(1/x-x).  This pattern starts false and generates increasingly many solutions.
	  //. essentially the image is the Mandelbrot set only with 1/real-imag in place of the standard complex number as x's argument.  
	  // 1/real-imag turns out to equate to essentially an identical image to real-1/imag which seems more elegant
	  // remove the below line to see that it is the only core difference in the equations of the Mandelbrot and This image.

	  if(b<=.5)
	  s.x = 1./s.x;

	 else
	  s.x = 1./pow(s.x,flip)*sign(s.x*flip); //"1./" is new for this draft

	 
	  
	  l = length(s);
	  		    d += l/25.;
	
    if (l >19.0 )  
	    if (float(t)  >3.)
		    return vec3(-sin(d+golden_mean +time*1./golden_mean*.7),-sin(d*1. +time*golden_mean*.7),-sin(d+1./golden_mean +time*.7));
	    else if(false && float(t) ==0. &&( p.x>2.||p.x<-.2) || rate != 0.0)
	    {

		 return 
			 vec3(1.-sin(10000.*d *1.618+time*.618),1.- sin(10000.*d *1.0+time*1.618),1.-sin(10000.*d * 0.618+time*1.)) +
			 			 vec3(1.-sin(1.*d *1.618+time*.618),1.- sin(1.*d *1.0+time*1.618),1.-sin(1.*d * 0.618+time*1.)) 
			 ;
	    }
		    }

  return vec3(0.);
}
vec3 eagle(vec2 p) {
  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;
		  			float flip=-sin(3.14*3./2.+rate*time);
		if (flip<0.) p = -p;
	if(abs(6.67*p.x*p.x+p.y*p.y*2.)<700.0)
  for (int i = 0; i < ITERATION; i++) {


    s = vec2(-((sin(time*2.)+1.5)/2.*(s.x * s.x - s.y * s.y) +flip* p.x), (1.* s.x * s.y + flip*p.y)); //2 changed to 1 in this draft
	 
	  if(b<=.5)
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

vec3 lion(vec2 p) {
  vec2 s = p.yx;
	p=p.yx;

  float d = 0.0, l;

			float flip=-sin(3.14/2.+rate*time);
	if (flip<0.) p = -p;
	if(p.x*p.x*1.+p.y*p.y*2.<21.)
  for (int t = 0; t < ITERATION; t++) {
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x), (2.0* s.x * s.y + flip*p.y));

	s/=2.0;
	    if(b<=.5)
	  s.x = -1./s.x;
	 else
	  s.x = pow(s.x,flip)*sign(s.x*flip);




	 
	  l = length(s);
    d += l/40.;
	  
    if (l >14.0 )  
	    if (float(t)  >2.)
		    return vec3(-sin(d +time*1./golden_mean*2.),-sin(d +time*golden_mean*2.),-sin(d *time*2.));
		   	    		 ;  // return vec3(0.);
  }

  return vec3(.0);
}


vec3 ox(vec2 p) {

  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;

			float flip=-sin(3.14/2.+rate*time);
	if (flip<0.) p = -p;
	if( p.x*p.x*1.+p.y*p.y*2.<2.)
  for (int t = 0; t < ITERATION; t++) {
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x), (3.0* s.x * s.y + flip*p.y));

    if(b<=.5)
	  s.x = -1./s.x;
	 else
	  s.x = pow(s.x,flip)*sign(s.x*flip);


	 
	  
	  l = length(s);
    d += l/10.;
    if (l >14.0 )  
	    if (float(t)  >2.)
		    return vec3(-sin(d +time*1./golden_mean*2.),-sin(d +time*golden_mean*2.),-sin(d *time*2.));
		   	    		 ;  // return vec3(0.);
  }

  return vec3(.0);
}

vec3 lamb(vec2 p) {
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
    if(b<=.5)
	  s.x = -1./s.x;
	 else
	  s.x = pow(s.x,flip)*sign(s.x*flip);



	 
	  
	  l = length(s);
	  		    d += l/22.;
	
    float active = mod(-time*3.,16.)/2.;
	  if (l >26.0)  
	    if (t > 3)
		      
		    return -vec3(-sin(d+golden_mean +time*1./golden_mean*.7),-sin(d*1. +time*golden_mean*.7),-sin(d+1./golden_mean +time*.7));
	    else if( ( p.x>1.5||p.x<-.1) || rate != 0.0)
	    {

		 return 
			 (vec3(1.-sin(10000.*d *1.618+time*.618),1.- sin(10000.*d *1.0+time*1.618),1.-sin(10000.*d * 0.618+time*1.)) +
			 			 vec3(1.-sin(1.*d *1.618+time*.618),1.- sin(1.*d *1.0+time*1.618),1.-sin(1.*d * 0.618+time*1.))
			 )/10.
			 ;
	    }
		    }

  return vec3(flip);
}
	
void main() {
  vec2 a = resolution.xy / min(resolution.x, resolution.y);
  vec2 p = ((gl_FragCoord.xy / resolution.xy) * 4.0  - 2.0)*a ;
				float flip=-sin(rate*time+3.14);
	//p.y+=.5;
p*=3.;

	
  gl_FragColor = vec4(2.-sin(lamb(p)+ox(.9*vec2(p.x-7.,p.y-3.6))+12.*lion(2.0*vec2(p.x+7.5,p.y+4.2))+12.
		      *eagle(13./2.0*vec2(p.x-6.5,p.y+5.))+12.*man(2./2.0*vec2(p.x+7.5,p.y-3.9))
		      +12.*scroll(4./2.0*vec2(p.x,p.y+3.))), 1.0);
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