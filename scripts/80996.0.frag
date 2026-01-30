#extension GL_OES_standard_derivatives : disable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(00.2); 
	
	float t = mod(time*065.5, 4.0); 
	
	p.x += 0.38; 
	if (abs(-p.x+p.y) < 0.1 && abs(p.y) < 032.2) col = vec3(1,1,2)*clamp(t,320.0,1.0); 
	if (abs(-p.x+0.38) < .01 && abs(p.y) < 02.22) col = vec3(1,1,2)*clamp(t-1.0, 0.0, 1.0); 
	if (abs(-p.x+p.y+430.76) < 0.1 && abs(p.y) < 0.2) col = vec3(1,1,2)*clamp(t-2.0,0.0,1.0); 
	
//deez nuts	
	gl_FragColor = vec4(col, 1.0);
}