#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define PI 3.1415926

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float x,float y){
 	return fract(sin(x*12.9898+y*78.233) * 43758.5453);
}

float interpolate(float a, float b, float x){
  	float ft = x * PI;
  	float f = (1.0 - cos(ft)) * 0.5;
  	return a*(1.0-f) + b*f;
}

float fbm1(float r,float index){
	r *= 5.0;
	r += time;
	float x = floor(r);
	float y = fract(r);
	float a = rand(x,index);
	float b = rand(x+1.0,index);
	return interpolate(a,b,y)-0.5;
	//return 0.0;
}
float dist(vec2 uv,vec2 from, vec2 to){
	vec2 p = uv-from;
	vec2 dir = normalize(to-from);
	float k = dot(p,dir);
	return distance(p,from+dir*k+vec2(0.0,1.0)*fbm1(k,0.4))-0.001;
}

void main( void ) {

	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy ) / resolution.y;

	float color = 0.001/length(dist(uv,vec2(0.0),vec2(1.0,0.0)));

	gl_FragColor = vec4( vec3(0.27+color,0.33+color, 0.7+color), 1.0 );

}