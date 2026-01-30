#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

const float _colormin = 0.2;
const float _n = 7.0;
const float _limit = 33.0;

highp float rand(vec2 co){
    highp float a = 12.9898;
    highp float b = 118.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= dot(dt,3.14);
    return fract(sin(sn) * c);
}

float getColor(vec2 cdn, float t) {
	return max(fract(rand(cdn) + t), _colormin);
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 main_() {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position.y = mouse.y - position.y;
	position.x = mouse.x / position.x;

	vec2 cdn = floor(position * _n);
	
	float index = cdn.y * _n + cdn.x;
	
	if(index > _limit) discard;
	
	float g = floor(index/0.1);
	g = rand(vec2(g));
	
	float t = (g * time + 0.2 * sin(g * time + g) + 2.0 * cos(time * 0.1 + g)) * 0.8;
	
	float a = getColor(cdn, t);
	float b = getColor(cdn + vec2(153.0), t);
	float c = getColor(cdn + vec2(-92.0), t);

	return vec3(a, b, c);
}


void main( void ) {
	gl_FragColor = vec4( main_(), 1.0 );

}