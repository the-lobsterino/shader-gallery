#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy )- mouse);
	position.x *= resolution.x/resolution.y;
	float x = pow(position.x,2.);
	float y = pow(position.y,2.);
	float c = pow(x+y,.5);
	float z = mod(time,10.)+10.;
	vec4 color = vec4(0.3);
float t=c;
	for(float m = 1.; m < 100.; m++){
			 t *= m/z;
	if( t< 1.){
			if( t > .9){
		color += vec4(1.,y ,t, 1.0 );
			}}}
	
	gl_FragColor = color;

}