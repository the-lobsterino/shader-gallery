#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 splines = vec2(pow(1.0-abs(position.y-cos(position.x*3.0+(time*0.16))/10.0-0.5),50.0),
			    pow(1.0-abs(position.y+cos(position.x*3.0+(time*0.24))/10.0-0.45),50.0));
	
	splines += pow(splines.x+splines.y, 3.0);
	
	vec3 color = vec3(0.15 * splines.x * splines.y,
			  0.15 * splines.x * splines.y,
			  0.8 * splines.x * splines.y);
	
	
	gl_FragColor = vec4( color.r,color.g,color.b, 1.0 );
}