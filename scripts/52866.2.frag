

// co3moz - mandelbrot
// X-  Christ Jesus made all. 
//Check out www.zonex.rf.gd
//https://biblehub.com/revelation/5-6.htm seven eyed seven horned lamb with four living creatures

precision highp float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITERATION 71

vec3 mandelbrot(vec2 p) {
  vec2 s = p.yx;
	p=p.yx;
  float d = 0.0, l;
	
  for (int i = 0; i < ITERATION; i++) {
    s = vec2(1./(s.x * s.x - s.y * s.y + p.x), -(2.0* s.x * s.y + p.y));
	
	  
	  l = length(s);
    d +=20.;
	  float nn = 0.0;
	  //if (p.x*p.x+p.y*p.y>1.) 
		 // nn=(p.x*p.x+p.y*p.y);
	  float v = float(i);
    if (l >= float(ITERATION) ) return vec3(sin(7.*d/float(ITERATION)));
  }

  return vec3(1.);
}
	varying vec2 surfacePosition;
void main() {
  vec2 a = resolution.xy / min(resolution.x, resolution.y);
  vec2 p = surfacePosition*4.;//((gl_FragCoord.xy / resolution.xy) * 4.0  - 2.0)*a ;
	float zoom = 1.0001;//-sin(time/10.);
	  //p+=vec2(-sin(time*.01618/3.),-sin(time*.0618/3.))/3.*1./zoom;
	p*=zoom;
	//p+= (mouse-.5)*190.;
  p*=1.9;
	//p*=1.1;
	
  gl_FragColor = vec4(1.0 - mandelbrot(p), 1.0);
}