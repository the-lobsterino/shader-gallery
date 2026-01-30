// .bpt - might I suggest this as a sound track - https://soundcloud.com/mdkofficial/mdk-frostbite?in=mdkofficial/sets/rise-new-album
// .bpt - the original unmodified shader was found here anyone know who? http://glslsandbox.com/e#34427.5

// a la ~ http://glslsandbox.com/e#17976.5

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

//#define time (50.0+time*sin(time+cos(time*0.2))*0.1)
#define t (gl_FragCoord.y*0.0015+1.+time*0.01+.5*sin(time/2.))
#define time (smoothstep(500.0,100.0,sin(t*0.1))+t*sin(t+cos(t*0.2))*0.1)

const float position = 0.0;
float scale = 7.;
const float intensity = 1.;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;

float band(vec2 pos, float amplitude, float frequency) {
	float wave = scale * amplitude * sin(2.0 * PI * frequency * pos.x + time/8.-pos.x*pos.x*0.125) / 2.05;
	float light = clamp(amplitude * frequency * 0.002, 0.001 + 0.001 / scale, 5.0) * scale / abs(wave - pos.y);
	return light;
}

vec2 vvn(int u,int v) {
	return vec2( u, v ) * 20.0*(surfacePosition.y)*sin(time*1.0);
}

void main( void ) {

	vec2 SP = surfacePosition.xy * (1.0-dot(surfacePosition,surfacePosition)*0.3);
	
	SP = vec2(SP.x * -2., SP.y);
	
	SP = SP.yx*vec2(-6,1.5)+vec2(4.,0);
	vec3 color = vec3(.3,.3,.1);
	vec2 pos = SP;
	float spectrum = 0.0;
	const float lim = 50.;
	//#define time 3e5 + pos.x*3.1415
	for(float i = 0.; i < lim; i++){
		spectrum += band(pos, 1.90*sin(time*0.150), 1.10*sin(time*i/lim))/pow(lim, 0.20 + 0.0133*cos(time*3e3+time));
	}
	gl_FragColor = vec4(color * spectrum, 1.);
	
	#define t2(d) (texture2D(backbuffer, fract((d+gl_FragCoord.xy)/resolution))-6./256.)
	#define t3(d) ((t2(d+vvn(1,0))+t2(d+vvn(-1,0))+t2(d+vvn(0,1))+t2(d+vec2(0,-1)))/4.)
	#define t4(d) ((t3(d+vvn(2,0))+t3(d+vvn(-2,0))+t3(d+vvn(0,2))+t3(d+vec2(0,-2)))/4.)
	#define t5(d) ((t4(d+vvn(3,0))+t4(d+vvn(-3,0))+t4(d+vvn(0,3))+t4(d+vec2(0,-3)))/4.)
	
	gl_FragColor = max(gl_FragColor, t5(vec2((pos.y*7.),8)));
	
	gl_FragColor.rgb = mix( gl_FragColor.rgb, vec3( dot( vec3( 0.3, max(0.0,cos(time*0.98)), 0.11 ), gl_FragColor.rgb ) ), sin(time)*step(sin(time*2.0),fract(time)) ).brg;
	
	
}//+ptkfs