precision highp float;

uniform vec2 resolution;
uniform float time;

// https://codepen.io/ilithya/pen/MWjBBYW

float circleDF(vec2 uv) {
	vec2 centerPt = vec2(.5) - uv;
	float dist = length(centerPt);
	
	return dist;
}
	
void main() {
	vec2 uv = (gl_FragCoord.xy - resolution * .5) / resolution.yy + 0.5;
	
	vec3 color = vec3(0.);
	
	vec3 pink = vec3(0.96, .21, .67);
	vec3 yellow = vec3(0.88, 0.91, 0.13);
	
	float n = 5.;
	float circle = circleDF(fract(uv*n));
	
	float breathAnim = sin(time + 0.5);

	vec2 grid = floor(uv * n); 
	float edge = sin(uv.x * grid.y * 0.5 + time) * 0.15 + 0.3;
	
	color += step(edge, fract(circle * n + breathAnim));	
	
	vec3 purple = vec3(.6, .5, .9);
	vec3 yellow2 = vec3(5.25, 0.6, 1.);
	
	float n2 = ceil(n*5.5);
	
	vec3 c = mix(yellow, pink, color);
	
	vec3 waves = mix(
		purple, 
		yellow2, 
		abs(
			sin(time-uv.x*n2) + cos(time-uv.y*n2) * breathAnim
		)*0.5 
	);	
	
	c *= waves * 0.5 + 0.5;
	
	gl_FragColor = vec4(c, 1.);
}