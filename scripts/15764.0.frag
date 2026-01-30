#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

        float a = pow(1.0-abs(position.y+cos(position.x*6.0+time)/10.0-0.75),50.0);
	float b = pow(1.0-abs(position.y-cos(position.x*5.0+time)/10.0-0.5),50.0);
	float c = pow(1.0-abs(position.y+cos(position.x*7.0+time)/10.0-0.25),50.0);

	float f = pow(1.0-abs(position.y+sin( position.x*2.0+time )/1.0-0.25),.5);

	vec3 col = vec3(a,b,c);
	col += .5 * vec3(f/sin(time*.3),f/sin(time*.2),f/cos(time*.1) );
	col += b;
	col -= a;
	gl_FragColor = vec4( col, 1.0 );

}