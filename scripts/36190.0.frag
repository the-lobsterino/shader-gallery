precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float cdist(vec2 v0, vec2 v1){
	v0 = abs(v0-v1);
	return min(v0.x,v0.y);
}

void main( void ){
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec2 q = vec2(p.x / p.y, abs(1.0 / p.y) + mod(time/1.5, 1.0));
	float grid = 2.0 * cdist(vec2(0.5), mod(q, 1.0));
		grid += 2.0 * cdist(vec2(0.), mod(q, 0.5));
	
	vec3 color = vec3 (smoothstep(0.0, 0.8, grid) * abs(p.y));
	
	if(p.y<0.0)// r
	gl_FragColor += vec4(color.r*.2,color.g*0.8,color.b*1.0, 1.0);
}

