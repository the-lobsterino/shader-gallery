/*By Xor
Shader tutorial on converting GLSL Sandbox shaders to GameMaker: Studio: http://xorshaders.weebly.com/tutorials/converting-glslsandbox-shaders

arr @gyabo
*/
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
vec3 tex(vec2 uv)
{
	return vec3(fract(sin(dot(floor(uv*32.0),vec2(5.364,6.357)))*357.536));
}

float map(vec3 p) {
	if(p.y < 0.0) return 10.0 - dot(abs(p), vec3(0,1,0)) + tex(p.zx * 0.01).x * 2.5 - 0.1;
	return 3.0 - dot(p, vec3(0,1,0)) + tex(p.xz * 0.015).x * 2.5 - 0.1;
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	uv.x *= resolution.x / resolution.y;
	uv.y = -uv.y;
	//if(abs(uv.y) > 0.7) return;
	vec3 d = normalize(vec3(uv,1));
	vec3 p = vec3(time, 0, time * 4.0);
	float t = 0.0;
	for(int i = 0 ; i < 128; i++) {
		float k = map(t * d + p) * 0.17320504;
		if(k < 0.01) break;
		t += k;
	}
	
	vec3 ip = (t * 0.95) * d + p;
	vec3 col = mix(vec3(1,2,3), vec3(1,2,7).zyx, t * 0.01);
	col /= map(ip + 0.002);
	gl_FragColor = vec4(0.1 * col + vec3(t * 0.012), 1.0 ) * min(1.0, (3.0- dot(uv, uv)));
}