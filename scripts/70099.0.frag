#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 position = ( vec2(0.0,gl_FragCoord.y / resolution.y) );
	
	float val = min(0.3,max(0.25,rand(position)));
	vec3 col = vec3(val);

	gl_FragColor = vec4( col, 1.0 );
}
