precision mediump float;
uniform float time;
uniform vec2  resolution;

void main(void){
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	p += vec2(cos(time*0.5), sin(time)*0.5);
	vec2 p2 = p;

	
	p2.x *= 0.01;
	p2.y += floor(sin(p.y * 350.0)) * 20.0;
	p2.y *= 20.0 * p2.y;
	
	vec2 p3 = p2;
	p3.y *= sin(time + 1000.0 * sin(time))/2.0;
	
	
	float l = 0.05 * mix(0.005, 0.5, (sin(time - 0.5)+1.0)/2.0)/(length(p));
	float l2 = 0.005 * mix(0.0, 1.0, (sin(time)+1.0)/2.0)/(length(p2));
	float l3 = 0.006 * mix(0.0, 1.0, (sin(time)+1.0)/2.0)/(length(p3));

	
	float m = l + (l + l2) * l3 * (l3 * 0.5);
	
	gl_FragColor = vec4(m + (l3 * l2 * sin(time) * 0.1), m + (l3  * l * 1.7), m + (l3 * 0.30), m * l3);
}