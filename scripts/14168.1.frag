#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// LOL AT THIS CODE LOL AT THE GUY TRYING TO IMPLEMENT FBM AND FAILING BADLY

// helped a bit :D
float rand(vec3 co){
	return fract(sin(dot(co*0.123,vec3(12.9898,78.233,112.166))) * 43758.5453);	
}

float noise(vec3 co){
	vec3 co1=vec3(int(co.x),int(co.y),0.0);
	vec3 co2=vec3(co1.x+1.0,co1.y,0.0);
	vec3 co3=vec3(co1.x,co1.y+1.0,0.0);
	vec3 co4=vec3(co1.x+1.0,co1.y+1.0,0.0);
	float a=rand(co1);
	float b=rand(co2);
	float c=rand(co3);
	float d=rand(co4);
	float b1=mix(a,b,co.x-co1.x);
	float b2=mix(c,d,co.x-co3.x);
	return mix(b1,b2,co.y-co1.y);
}

float fbm(vec3 co) {
	float n = 0.0;
	n += 0.5000 * noise(co); co *= 2.1;
	n += 0.2500 * noise(co); co *= 2.1;
	n += 0.1250 * noise(co); co *= 2.1;
	n += 0.0625 * noise(co); co *= 2.1;
	n /= 0.9275;
	
	return n;
}

void main( void ) {
	vec2 position = gl_FragCoord.xy/resolution*25.0;
	float color = fbm(vec3(position, 0.0));
	gl_FragColor = vec4( vec3( color, color, color), 1.0 );

}