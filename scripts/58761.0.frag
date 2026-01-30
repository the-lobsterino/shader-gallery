#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float s = 0.1;

float random(float p) {
  return fract(sin(p)*10000.);
}

float noise(vec2 p) {
  return random(p.x + p.y*10000.);
}

vec2 sw(vec2 p) {return vec2( floor(p.x) , floor(p.y) );}
vec2 se(vec2 p) {return vec2( ceil(p.x)  , floor(p.y) );}
vec2 nw(vec2 p) {return vec2( floor(p.x) , ceil(p.y)  );}
vec2 ne(vec2 p) {return vec2( ceil(p.x)  , ceil(p.y)  );}

float smoothNoise(vec2 p) {
  vec2 inter = smoothstep(0., 1., fract(p));
  float s = mix(noise(sw(p)), noise(se(p)), inter.x);
  float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
  return mix(s, n, inter.y);
  return noise(nw(p));
}

float movingNoise(vec2 p) {
  float total = 1.0;
  total += smoothNoise(p     - time*s);
  total += smoothNoise(p*2.  + time*s) / 2.;
  total += smoothNoise(p*4.  - time*s) / 4.;
  total += smoothNoise(p*8.  + time*s) / 8.;
  total += smoothNoise(p*16. - time*s) / 16.;
  total /= 1. + 1./2. + 1./4. + 1./8. + 1./16.;
  return total;
}

float nestedNoise(vec2 p) {
  float x = movingNoise(p);
  float y = movingNoise(p + 100.);
  return movingNoise(p + vec2(x, y));
}


void main( void ) {

	vec2 p = ( gl_FragCoord.xy-0.5* resolution.xy ) /resolution.y;
	
	 
	
	float		d =  1.-smoothstep(0.3,0.32,length(p*vec2(.40,10.0)*sin(p.x))/0.5);
			d +=  1.0-smoothstep(0.4,0.42,length(p));

	float r = nestedNoise(p*8.)*d;
	 gl_FragColor.rgb = vec3(r*0.2,r*0.4,r*0.9)*0.8;
 	 gl_FragColor.a = 1.;
}