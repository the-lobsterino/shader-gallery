#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec2 p1 = vec2(0.75, 0.5);
const vec2 p2 = vec2(0.25, 0.5);

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 directionVectorFromP1 = position - p1;
	directionVectorFromP1.x *= resolution.x/resolution.y;
	float distanceFromP1 = length(directionVectorFromP1);
	
	vec2 directionVectorFromP2 = position - p2;
	directionVectorFromP2.x *= resolution.x/resolution.y;
	float distanceFromP2 = length(directionVectorFromP2);
	
	vec2 directionVectorFromMouse = position - mouse;
	directionVectorFromMouse.x *= resolution.x/resolution.y;
	float distanceFromMouse = length(directionVectorFromMouse);


	float r = exp(-pow(distanceFromP1*4.0, 2.0))*0.75*(sin(time*1.0/10.0)+2.0)/3.0 + exp(-pow(distanceFromP2*4.0, 2.0))*0.5 *sin((time*1.3/10.0)+2.0)/3.0 + exp(-pow(distanceFromMouse*4.0, 2.0))*0.25*(sin(time*1.7/10.0)+2.0)/3.0;
	float g = exp(-pow(distanceFromP1*4.0, 2.0))*0.5 *(sin(time*1.3/10.0)+2.0)/3.0 + exp(-pow(distanceFromP2*4.0, 2.0))*0.25*sin((time*1.7/10.0)+2.0)/3.0 + exp(-pow(distanceFromMouse*4.0, 2.0))*0.75*(sin(time*1.0/10.0)+2.0)/3.0;
	float b = exp(-pow(distanceFromP1*4.0, 2.0))*0.25*(sin(time*1.7/10.0)+2.0)/3.0 + exp(-pow(distanceFromP2*4.0, 2.0))*0.75*sin((time*1.0/10.0)+2.0)/3.0 + exp(-pow(distanceFromMouse*4.0, 2.0))*0.5 *(sin(time*1.3/10.0)+2.0)/3.0;
	gl_FragColor = vec4( vec3(r, g, b), 1.0 );
}