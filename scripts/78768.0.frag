precision mediump float;
uniform float time; // time
uniform vec2  resolution; // resolution

void main(void){
	vec3 destColor = vec3(0.52, 0.2, 0.1);
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); 	
	float a = atan(p.y / p.x) * 2.0; // Instead of * 2.0, try * 26 or * 128 and higher
	float l = 0.05 / abs(length(p) - 0.8 + sin(a + 4.5) * 0.1);
	//destColor *= 1.9+ sin(a + 00.13) * 0.03;
	
	vec3 destColor2 = vec3(0.0, 0.2, 0.9);
	vec2 p2 = (gl_FragCoord.xy * 3.0 - resolution) / min(resolution.x, resolution.y); 
	float a2 = atan(p2.y / p2.x) * 3.0;
	float l2 = 0.05 / abs(length(p2) -0.8 + sin(a2 + 4.5)*0.1);
	//destColor2 *= ( 0.5 + sin(a + 00.03) * 0.03 ) * 4.0;
	
	vec3 destColor3 = vec3(0.2, 0.9, 0.35);
	vec2 p3 = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); 
	float a3 = atan(p3.y / p3.x) * 10.0;
	float l3 = 0.05 / abs(length(p3) - 0.4 + sin(a3 + 23.5) * (0.1 * l));
	//destColor3 *= 0.5 + sin(a + 10.23) * 0.03;
	
	gl_FragColor = vec4(l*destColor, 1.0);
}