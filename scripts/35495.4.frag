#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec3 permute(vec3 x) { return mod289(((x*3.0)+1.0)*x); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m *m *m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float noise(float t){
	t = sin( t * 50.);
	t = atan( 1.0 , t );
	t = sin( t * 10.0 );
	return t;
}

float rand(float co){
    return fract(sin(dot(vec2(co) ,vec2(12.9898,78.233))) * 43758.5453);
}

vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.;

	
	float n = snoise(p*3.5) - 0.1+mouse.x;
	
	vec3 c;
	const int len = 50;
	
	for(int i=0; i<len; i++){
		float d = float(i)/float(len);
		c += (n > d && n < d+1.0/float(len))
			? vec3( rand(d), rand(d+0.1), rand(d+0.2) ) 
			: vec3(0.0);
	}
	c = hsv2rgb(c);
	
	vec4 col = vec4( c, 1.0);

	gl_FragColor = col;

}