precision lowp float;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;

vec4 GetColor(vec2 current)
{
	float block;
	float blockDist = 0.1;
	block = mod(current.x, blockDist) + mod(current.y, blockDist);
	if (block < blockDist / 2.0) {block = 1.0;}
	else {block = 0.0;}
	float dist;
	dist = 1.0 - distance(mouse, current + vec2(0.5, 0.5));
	return vec4(dist*block, dist, dist, 1.0);
}

void main(void)
{
	vec2 uv = (gl_FragCoord.xy - resolution.xy / 2.0) * 0.001;
	gl_FragColor=GetColor(uv);
} 