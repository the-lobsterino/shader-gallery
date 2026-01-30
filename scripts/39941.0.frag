#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float circle(float h,float k, float r){
	return distance(pow((gl_FragCoord.x - h),2.0) + pow((gl_FragCoord.y - k),2.0),pow(r,2.0));}

void main( void ) {
	vec2 fragmentPos = ( gl_FragCoord.xy / resolution.xy );
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float intensity = tan(gl_FragCoord.y) * tan(gl_FragCoord.x)*80.0/circle(mouse.x *resolution.x,mouse.y * resolution.y,30.0);
	float blueness = 0.3 + 1000. * length(mouse - position) / length(resolution);
	float redness = 1. - blueness;
	gl_FragColor = intensity * vec4(redness,.1,blueness,1.);}