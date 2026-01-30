#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
//bb8_ bsgo 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
		
	vec2 m = vec2(sin(mouse.x), cos(mouse.y));
	
	gl_FragColor=vec4(m,m);
}

