#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// THIS
// THIS IS PERFECT
vec3 getScatterColor(float dist){ 
	vec3 color = vec3(0.03, 0.06, 0.1) * dist;
	return max(pow(color, 1.-color), 0.0);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.y); 
	
	gl_FragColor = vec4(getScatterColor(3.14 / position.y), 1.0 );

}