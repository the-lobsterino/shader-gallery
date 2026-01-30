precision mediump float;
uniform float time;	
uniform vec2  resolution; 

void main(void){
	vec3 destColor = vec3(0.0, 0.1, 0.5);
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); 	
	float a = atan(p.y / p.x) * 2.0; 
	float l = 0.05 / abs(length(p) - 1.2 - atan(a + time * 1.0) * 0.1);
	destColor +=1.0+ cos(a + time * 3.0) * 1.0;
	
	vec3 destColor2 = vec3(0.0, 0.1, 0.1);
	vec2 p2 = (gl_FragCoord.xy * 9.0 - resolution) / min(resolution.x, resolution.y); 
	float a2 = atan(p.y / p.x) * 3.0;
	float l2 = 0.05 / abs(length(p) + 0.1 - (tan(time/5.0)+0.5) + sin(a + time * 18.5) * (0.1 * l));
	destColor2 -= ( 0.5 + tan(a + time * 000.05) * 0.2 ) * 1.5;
	
	vec3 destColor3 = vec3(0.1, 0.2, 0.9);
	vec2 p3 = (gl_FragCoord.xy * 5.0 - resolution) / min(resolution.x, resolution.y); 
	float a3 = asin(p.y / p.x) * 15.0;
	float l3 = 0.05 / abs(length(p) - 0.4 + sin(a + time * 1.5) * (0.1 * l2));
	destColor3 *= 0.9 + sin(a + time * 10.0) * 5.;
	
	gl_FragColor = vec4(l*destColor + l2*destColor2 + l3*destColor3, 1.0);
}