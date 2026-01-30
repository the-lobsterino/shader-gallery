#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 norm(vec2 p0, vec2 p1, float r) {
	vec2 n = vec2(p1 - p0);
	float d = length(n);
	n = normalize(n);
	mat2 m = mat2(n.yx*vec2(-1.,1.), n);
	
	float y = r*r/d;
	float x = sqrt(r*r - y*y);
	
	return normalize(m*vec2(x,y));
}

float heart(vec2 uv, float r) {
	vec2 p0 = vec2(0, -r*2.1);
	vec2 p1 = vec2(r, r*.25);
	
	vec2 n = norm(p0, p1, r);
	
	uv.x = abs(uv.x);
	
	float c = length(uv - p1) - r;
	
	vec2 d = norm(p0, p1, r);
	vec2 q = p1-d*r;

	float pl = -dot(n, uv - q);
	
	float mask = step(c, .0);
	
	if (uv.y < q.y) mask = step(min(c,pl), 0.);
	mask = max(mask, step(uv.x, r) * step(abs(uv.y), r*.5));
	return mask;
}

void main( void ) {
	
	vec2 uv = (gl_FragCoord.xy - resolution * .5) / resolution.x;

	uv *= 9.;
	vec2 c = floor(uv);
	vec2 g = fract(uv)*2.-vec2(1.);
	float phase = (c.x+c.y)*.4;
	
	float r = (abs(sin(time*2.+phase))+1.)*.2;

	vec3 bg = vec3(1.4-uv.y) * vec3(0.3,.4,1.);
	vec3 col =  vec3(1.0,1.0,0.0);
	if (g.y > -r*.2)
		col = vec3(.1,.3,1.0);
	

	gl_FragColor = vec4(mix(vec3(bg),col, heart(g, r)), 1.0 );
}