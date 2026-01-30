#ifdef GL_ES
precision mediump float;
#endif
//c64cosmin@gmail.com

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float texture0(vec2 p){
	return cos(p.x*30.0)*cos(p.y*30.0+time*20.0);
}
float texture1(vec2 p){
	return cos(p.x*30.0)+cos(p.y*30.0-time*20.0);
}
void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )-vec2(0.5,0.5);

	float color;
	if(p.y>0.0)color=texture0(vec2(p.x/p.y,1.0/p.y));
	else color=texture1(vec2(p.x/p.y,1.0/p.y));
	
	color=color*(p.y*p.y);
	
	gl_FragColor = vec4( vec3( color ), 1.0 );

}