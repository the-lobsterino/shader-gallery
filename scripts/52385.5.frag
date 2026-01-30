#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy * 2.0 - resolution)  / min(resolution.x,resolution.y);

	float l = 0.2 / length(position);
	float g =  gl_FragCoord.y * abs(sin(time / 1.234322));
	float f =  gl_FragCoord.x / abs(cos(time / 212.0));
        float h =  (g + f) / 2.0;
	gl_FragColor = vec4( vec3(cos(g / time),sin(l * time / 2.0),cos(f / time + 1.0)),h);

}