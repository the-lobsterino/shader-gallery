#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float u = mouse.x * 4.0 - 2.0;
float a = 1.0 - mouse.y;
float coef1 = 1.0 / (sqrt(2.0 * 3.1415 * a * a)); // can be precomputed 
float coef2 = -1.0 / (2.0 * a * a); // can be precomputed 

float gaussian(float x){
	return coef1 * pow(2.7182818, pow(x - u, 2.0) * coef2 );
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = position * 2.0 - 1.0; 
	position *= 2.0;
	
	gl_FragColor = vec4( smoothstep(0.0, 0.03, abs(gaussian(position.x) - position.y)));

}