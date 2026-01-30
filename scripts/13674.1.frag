#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;uniform vec2 resolution;
void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	float m = 50.5;
	float green = sin(p.x*m)*sin(p.y*m+-time*5.)*time*0.01;
	green += (p.x*p.x)*m;
	green += sin(p.y*p.x*m-time*5.);
	green += cos(p.y*p.x*m);
	float red = 0.8; 	
	float blue = 0.3;
	gl_FragColor = vec4( vec3( red, green ,blue) ,1.0 );
}