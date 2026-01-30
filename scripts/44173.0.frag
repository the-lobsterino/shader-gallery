#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//afl_ext 2017
float extremelyFast1dNoise(float v){
	return cos(v + cos(v * 90.1415) * 100.1415) * 0.5 + 0.5;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 100000.0 + time;
 
	float color = extremelyFast1dNoise(position.x);
	
	gl_FragColor = vec4( vec3(color), 600.0 );

}