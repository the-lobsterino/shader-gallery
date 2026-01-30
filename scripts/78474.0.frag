
precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	vec3 col = vec3(0);
	
	col += vec3(1)*1.0/(1.0+50.0*abs(p.y+sin(p.x*10.0)*0.3)); 
	col += vec3(1)*1.0/(1.0+50.0*abs(p.y+sin(p.x*10.0+3.1415)*0.3)); 
	gl_FragColor = vec4(col, 1.0);

}