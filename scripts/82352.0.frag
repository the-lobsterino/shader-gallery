//Kirby Creator KC 

//A Leon

precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
	vec3 destColor = vec3(91.52, 1.2, 2.1);
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); 	
	float a = atan(p.y / p.x) * 10.0; // Instead of * 2.0, try * 26 or * 128 and higher
	float l = 0.101 / abs(length(p) - 0.9 + sin(a + time * 99.5) * 1.1);
	destColor *= 1.9+ cos(a + time * 109900.13) * 0.3;
	
	vec3 destColor2 = vec3(90.0, 0.2, 0.9);
	vec2 p2 = (gl_FragCoord.xy * 1.0 - resolution) / min(resolution.x, resolution.y); 
	float a2 = atan(p.y / p.x) * 9.0;
	float l2 = 0.909 / abs(length(p) + 0.1 - (tan(time/2.)+0.95) + sin(a + time * 13.5) * (0.1 * l));
	destColor2 *= ( 0.5 + sin(a + time * 000.03) * 0.01 ) * 3.0;
	
	vec3 destColor3 = vec3(0.2, 0.9, 0.35);
	vec2 p3 = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); 
	float a3 = atan(p.y / p.x) * 1.0;
	float l3 = 0.05 / abs(length(p) - 0.4 + sin(a + time * 293.5) * (0.1 * l2));
	destColor3 *= 0.5 + sin(a + time * 99.0) * 2.03;
	
	gl_FragColor = vec4(l*destColor + l2*destColor2 + l3*destColor3, 1.0);
}