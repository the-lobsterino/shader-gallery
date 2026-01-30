#extension GL_OES_standard_derivatives : enable


// Have an acid-friday!

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;

	p.x *= resolution.x/resolution.y;
	vec3 col =vec3(0);
	
	
	//p *= 1.3;
	//p.y += 0.9*sin(p.x*1.0+time*3.0)*sin(time*0.8);
	//p.x += 0.04*sin(p.y*8.0+time*32.0)*sin(time*0.7);
	
	vec2 mm;
	mm.x = mouse.x;
	mm.y = mouse.y;
	mm.x = mm.x*2.0 - 1.0;
	mm.y = mm.y*2.0 - 1.0;
	mm.x *= resolution.x/resolution.y;
	//mm.x = 0.0;
	//mm.y = 0.0;
	vec2 mm2;
	mm2.x = 0.3;
	mm2.y = 0.3;
	mm2.x *= resolution.x/resolution.y;
	vec2 mm3;
	mm3.x = -0.1;
	mm3.y = sin(time*0.3) * 0.8;
	mm3.x *= resolution.x/resolution.y;
	//if (length(p - mm) < 0.25*2.0) col = vec3(0.2,0.8,0.2);
	//if (length(p - mm2) < 0.25*2.0) col = vec3(0.2,0.8,0.8);
	//if (length(p - mm3) < 0.25*2.0) col = vec3(0.8,0.2,0.2);
	float len;
	float G = 0.4;
	float M = 0.2;
	float minl = 0.35;
	float F1, F2, F3;
	vec2 V1, V2, V3;
	len = length(p-mm);
	if (len > minl) {
		F1 = G * M / len / len;
		V1 = (mm - p) / len;
	}
	else {
		F1 = 0.0;
		V1 = vec2(1.0, 1.0);
	}
	len = length(p-mm2);
	if (len > minl) {
		F2 = G * M / len / len;
		V2 = (mm2 - p) / len;
	}
	else {
		F2 = 0.0;
		V2 = vec2(1.0, 1.0);
	}
	len = length(p-mm3);
	if (len > minl) {
		F3 = G * M / len / len;
		V3 = (mm3 - p) / len;
	}
	else {
		F3 = 0.0;
		V3 = vec2(1.0, 1.0);
	}

	p.x += V1.x*F1 + V2.x*F2 + V3.x*F3;
	p.y += V1.y*F1 + V2.y*F2 + V3.y*F3;
	//if (length(p) < 0.6) col = vec3(0.8,0.8,0);
	vec3 col1 = vec3(0);
	if (length(p-mm) < 0.6) col1 = vec3(0.3,0.9,0.3);
	vec3 col2 = vec3(0);
	if (length(p-mm2) < 0.6) col2 = vec3(0.3,0.9,0.9);
	vec3 col3 = vec3(0);
	if (length(p-mm3) < 0.6) col3 = vec3(0.9,0.3,0.3);
	col += col1/4.0 + col2/4.0 + col3/4.0;
	col = col/2.0+ col1/3.0 + col2/3.0 + col3/3.0;
	
	//if (length(p) < 1.0) col = vec3(0);
	//if (length(p) < 0.6) col = vec3(9,1,0);
	

	gl_FragColor = vec4(col, 108.0);
}