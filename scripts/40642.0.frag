#ifdef GL_ES
precision mediump float;
#endif
#define M_PI 3.1415926535897932384626433832795
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float ttime=time*1.0;
	vec3 color = vec3(0.0,0.0,0.0);
	
	float valor = sin(time+position.x*37.0) * cos(position.y*29.0);
	float background = abs(0.05/valor);
	
	color.x=valor*sin(ttime)+-valor*sin(ttime+M_PI);
	color.y=valor*sin(ttime+M_PI)+-valor*abs(sin(ttime+M_PI/2.0));
	color.z=valor*abs(sin(ttime+M_PI/2.0))+-valor*sin(ttime);
	
	color.x = color.x + background * abs(sin(ttime+M_PI/2.0));
	color.y = color.y + background * sin(ttime);
	color.z = color.z + background * sin(ttime+M_PI);
	gl_FragColor = vec4( color, 1.0 );

}