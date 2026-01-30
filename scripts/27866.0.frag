/*

Supershapes!
Use 0.5

by xpansive

*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float supershape(vec2 p, float m, float n1, float n2, float n3, float a, float b, float s, float r) {
	float ang = atan(p.y * resolution.y, p.x * resolution.x) + r;
	float v = pow(pow(abs(cos(m * ang / 4.0) / a), n2) + pow(abs(sin(m * ang / 4.0) / b), n3), -1.0 / n1);
	return 1. - step(v * s * resolution.y, length(p * resolution)); 
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution) * 2.0 - 1.0;
	p *= 2.5;
	
	float color ;
	float color1 ;
	float color2 ;
		
	color += supershape(p - vec2(-2, 1), 6.0, 1.0, 7.0, 8.0, 1.0, 1.125, 0.12, (time*0.5));
	color1 += supershape(p - vec2(-2, -1), 3.0, 4.5, 10.0, 10.0, 1.0, 1.0, 0.95, (-time*0.5));
	color2 += supershape(p - vec2(-1, 1), 7.0, 10.0, 6.0, 6.0, 1.0, 1.0, 0.95, (-time*0.5));
	color += supershape(p - vec2(-1, -1), 16.0, 0.5, 0.15, 16.0, 1.1, 1.0, 1.125, (time*0.5));
	color1 += supershape(p - vec2(0, 1), 4.0, 12.0, 15.0, 15.0, 1.0, 1.0, 0.95, (time*0.5));
	color2 += supershape(p - vec2(0, -1), 19.0, 9.0, 14.0, 11.0, 1.0, 1.0, 0.9, (-time*0.5));
	color += supershape(p - vec2(1, 1), 6.0, 60.0, 55.0, 1000.0, 1.0, 1.0, 0.67, (-time*0.5));
	color1 += supershape(p - vec2(1, -1), 6.0, 0.53, 1.69, 0.45, 1.0, 1.0, 1.25, (time*0.5));
	color1 += supershape(p - vec2(2, 1), 8.0, 0.5, 0.5, 0.3, 1.0, 1.5, 1.5, (time*0.5));
	color2 += supershape(p - vec2(2, -1), 6.0, -0.62, 30.0, 0.6, 1.0, 1.0, 1.25, (-time*0.5));
	
	gl_FragColor = vec4(color2+0.3,color-0.25,0.5+color1,1.0);
}
