#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
        mat2 r=mat2(cos(time),-sin(time),
	            sin(time),cos(time));
	vec2 p =r* gl_FragCoord.xy ;
        mat2 r2=mat2(cos(-time),-sin(-time),
	             sin(-time),cos(-time));
	vec2 p2 =r2*gl_FragCoord.xy;
	mat2 r3=mat2(cos(-time),-sin(-time),
	             sin(-time),cos(-time));
	vec2 p3= r3*gl_FragCoord.xy;
	float color = 0.0;
	color =sin(p.x/20.0*sin(time))*(sin(time));
	color+=sin(p.y/20.0*sin(time))*(cos(time));
	
	float color2 = 0.0;
	color2 =cos(p2.x/20.0*cos(time))*(cos(time));
	color2+=cos(p2.y/20.0*cos(time))*(sin(time));
	float color3 = 0.0;
	color3 =sin(p3.x/20.0*sin(time))*(cos(time));
	color3+=sin(p3.y/20.0*cos(time))*(sin(time));
	
	gl_FragColor = vec4( vec3( color, color2,color3), 1.0 );

}