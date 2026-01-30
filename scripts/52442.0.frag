#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	
	if(pos.x > .5){
		gl_FragColor = vec4(pos.y,0.0,pos.x,1.0);
	} else {
		gl_FragColor = vec4(pos.x,pos.y, 1.0, 1.0 );
	}
}