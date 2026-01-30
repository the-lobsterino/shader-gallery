#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
void main( void ) {
 
	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);
	vec3 c = vec3(0.0,0.0,2.0);
	float r = 1.0;
	vec3 o = vec3(0.0,0.0,0.0);
	vec3 d = normalize(vec3(uv,1.0)); //上下左右の反転を防止
	vec3 l = vec3(mouse.x-0.5, mouse.y-0.5, 0.0); //光源の位置はマウスの位置と同期している
	float D = dot(d,o-c) * dot(d,o-c) - dot(d,d) * (dot(o-c,o-c) - r * r);
	bool p_exists = D >= 0.0;
	float t = 0.0;
	vec3 p = vec3(0.0,0.0,0.0);
	vec3 n = vec3(0.0,0.0,0.0);
	if (p_exists) {
		t = (-dot(d,o-c) - sqrt(D)) / dot(d,d);
		p = o + t * d;
		n = (p - c) / r;
	}
	vec3 color = vec3(1.0,0.0,0.8);
	color = color * dot(normalize(l - p),n);
	if (!p_exists){
		color = vec3(0.0,0.0,0.0);
	}
	gl_FragColor = vec4(color, 1.0);
 
}