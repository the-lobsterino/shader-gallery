
//Simple Color Interpolation
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 colorA=vec3(1.0,0.0,0.0);
	vec3 colorB=vec3(0.0,0.0,1.0);		
	vec3 finalColor=((colorB*(1.0-position.y))+(colorA*position.y));		
	gl_FragColor = vec4(finalColor, 1.0 );
}