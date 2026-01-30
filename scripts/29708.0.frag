#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float x){
    return fract(sin((x*12.9898*cos(x*8.523314)) * 43758.5453));
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy);
	uv *= resolution.xy/min(resolution.x, resolution.y);
	
	float a = float(mod(uv.x*20.,1.)>.5 ^^ mod(uv.y*20.,1.)>.5);
	float b = float(fract(uv.y*floor(rand(floor(uv.y*9.))*20.))>0.4)*a;
	float c = float(fract(uv.y*floor(rand(floor(uv.y*6.))*30.))>0.4)*a;
	float d = float(fract(uv.y*floor(rand(floor(uv.y*5.))*25.))>0.4)*a;
	
	gl_FragColor = vec4(b,c,d, 1.0 );
}