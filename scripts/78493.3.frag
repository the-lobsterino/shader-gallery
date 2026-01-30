// ------------------------------------------------------------
// ---- 😃 licenced under love, peace and happiness 😃  ------
// ------------------------------------------------------------
// -------------    digital painting series   -----------------
// ------------------------------------------------------------

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

const vec3 col1 = vec3(0.);
const vec3 col2 = vec3(1.0);

vec3 hash3( float n ) { return fract(sin(vec3(n,n+1.0,n+2.0))*43758.5453123); }
 
float sdCircle(vec2 pos, float radius) {
	 return length(pos) - radius;
}

 vec2 translate(vec2 pos, vec2 offset) {
 	return pos - offset;
 }

float random(float v){
	return fract(sin(v*1223.42454));	
}

float opUnion(float a, float b){
	return min(a,b);
}
float opSmoothUnion(float d1, float d2, float k) {
 return -log2(exp2(-k * d1) + exp2(-k * d2)) / k;
} 


float random2 (vec2 st) {
    return fract(sin(dot(st.xy,vec2(1.9898,178.233)))*4378.5453123);
}


void main(void) {
	
	const int N = 9;
	float _time = time*.3;
	vec2 positions[N];
	float _spread = sin(_time*2.3)*.5+.5;
	float _speed = sin(_time*5.)*.5+.5;
	float _blobby =  sin(_time*1.3)*.5+.5;
	float _viscocity =  sin(_time*1.3)*.5+.5;
	float _blobradius = sin(_time*1.3)*.5+.5;
	
	
vec2 pos = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
pos *= 4.0; // zoom
float d = 1e7;
	
	
for (float i = 1.0; i < float(N); i++) {
	
		
	for(int j = 0; j < 2; j++){
		positions[int(i)].x += (.5+_spread) * random2(vec2(i, j)) * sin(10.1 * _time * random2(vec2(j, i)));
		positions[int(i)].y += (.5+_spread) * random2(vec2(i * i, j)) * cos(10.1 * _time * random2(vec2(i, j * j)));
	}
	
	 
	float radius = mix(0.14*(_blobradius*.3+.5), .14*(_blobradius*.3+.5),  .4+_blobby*random(i))*.01;
	float cd = sdCircle(translate(pos, positions[int(i)]),  radius + .1+random(i)*.61);
	d = opSmoothUnion(d, cd, 2.+ _viscocity*18.) ;
}
	
	float val = (d);
	
//val = fract(sin(val*12.));
 
   val = smoothstep(.5,.52,val);
	
	val += d*.2;
 
	vec3 col = vec3(val);
	
		    // dithering
   col += hash3(pos.x*time+13.0*pos.y)*.1;
	
	float dist = distance(pos, vec2(0.5));
   float falloff = .002;
    float amount = .023;
    //col *= smoothstep(0.8, falloff * 0.8, dist * (amount + falloff));
	
	

	
gl_FragColor = vec4(col, 1.0);
}
