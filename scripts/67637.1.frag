#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




void main( void ) {

	vec2 position = ( gl_FragCoord.xy*2.0 - resolution.xy) / resolution.y;
	
	vec3 col = vec3(1,0,1);
	

	gl_FragColor = vec4(col, 1.0 );

}

