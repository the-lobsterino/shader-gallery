#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
#define mouse (  vec2(0, 1) + vec2(1, -1) * mouse  )
uniform vec2 resolution;
varying vec2 surfacePosition;

vec2 complexPowa(vec2 Z, float P){
	vec2 Rt = vec2(length(Z), atan(Z.x, Z.y));
	vec2 RtP = vec2(pow(Rt.x, P), Rt.y * P);
	vec2 ZP = RtP.x * vec2(sin(RtP.y), cos(RtP.y));
	return ZP;
}

float func(float s, vec2 pos){
	const int iterLim = 10;
	vec2 cSum = vec2(0);
	for(int i = 0; i < iterLim; i++){
		cSum += complexPowa(pos, float(i)/(s+float(i)));
	}
	return length(cSum);
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	gl_FragColor = vec4( vec3( fract(func(length(mouse*4.), surfacePosition*128.)) ), 1.0 );
}