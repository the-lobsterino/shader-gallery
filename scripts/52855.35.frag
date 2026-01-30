

// co3moz - mandelbrot
// X-  Christ Jesus made all. 
//Check out www.zonex.rf.gd
//https://biblehub.com/revelation/5-6.htm seven eyed seven horned lamb with four living creatures covered in eyes
//make sure to up the resolution in the top left; it's the number.  Try 1 to start.
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITERATION 20
	float rate = .0;
float degrees2radians = 180./3.14159;
float golden_mean = -cos(216.*degrees2radians)/-cos(612.*degrees2radians)-1.; 
//cos(216)/cos(612)=2.61....I was born 24 hours before 6:12 Jan(1), 6, I use the golden ratio to stagger because of its supreme irrationality
//above identity was discovered by intuition and above factoid.  There's more to the story but this is neither time nor place
//though that's what the story is about.


vec3 ox(vec2 p) {

  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;

			float flip=-sin(3.14/2.+rate*time);
	if (flip<0.) p = -p;
  for (int t = 0; t < ITERATION; t++) {
    s = vec2(((s.x * s.x - s.y * s.y) +flip* p.x), (3.0* s.x * s.y + flip*p.y));


	  s.x = pow(s.x,flip)*sign(s.x*flip);

		

	 
	  
	  l = length(s);
    d += l/10.;
    if (l >14.0 )  
	    if (float(t)  >2. && p.x*p.x*1.+p.y*p.y*2.<2.)
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
  vec2 a = resolution.xy / min(resolution.x, resolution.y);
  vec2 p = ((gl_FragCoord.xy / resolution.xy) * 4.0  - 2.0)*a ;
				float flip=-sin(rate*time+3.14);
	//p.y+=.5;
p*=4.9;

	
  gl_FragColor = vec4( lamb(p)+12.*ox(1./2.0*p-2.5), 1.0);
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