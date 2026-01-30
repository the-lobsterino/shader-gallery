#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

const vec3 cLight = normalize(vec3(.5, .5, 1.));

//float randomNoise(vec2 p) {
//	return fract(10000. * sin(47. * p.x + 9973. * p.y));
//}
float randomNoise (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

// 8连平滑函数
float smoothNoise(vec2 p) {
	vec2 nn = vec2(p.x, p.y + 1.);
	vec2 ne = vec2(p.x+1., p.y+1.);
	vec2 ee = vec2(p.x+1., p.y);
	vec2 se = vec2(p.x+1., p.y-1.);
	vec2 ss = vec2(p.x, p.y-1.);
	vec2 sw = vec2(p.x-1., p.y-1.);
	vec2 ww = vec2(p.x-1., p.y);
	vec2 nw = vec2(p.x-1., p.y+1.);
	vec2 cc = vec2(p.x, p.y);
	float sum = 0.;
	sum += randomNoise(nn);
	sum += randomNoise(ne);
	sum += randomNoise(ee);
	sum += randomNoise(se);
	sum += randomNoise(ss);
	sum += randomNoise(sw);
	sum += randomNoise(ww);
	sum += randomNoise(nw);
	sum += randomNoise(cc);
	sum /= 9.;
	return sum;
}

//  Von Neumann近邻 平滑函数
float smoothNoise2(vec2 p) {
	vec2 nn = vec2(p.x, p.y + 1.);
	vec2 ee = vec2(p.x+1., p.y);
	vec2 ss = vec2(p.x, p.y-1.);
	vec2 ww = vec2(p.x-1., p.y);
	vec2 cc = vec2(p.x, p.y);
	float sum = 0.;
	sum += randomNoise(nn) / 8.;
	sum += randomNoise(ee) / 8.;
	sum += randomNoise(ss) / 8.;
	sum += randomNoise(ww) / 8.;
	sum += randomNoise(cc) / 2.;
	return sum;
}

float interpolatedNoise(vec2 p) {
	vec2 s = smoothstep(0., 1., fract(p));
	float q11 = smoothNoise2(vec2(floor(p.x), floor(p.y)));
	float q12 = smoothNoise2(vec2(floor(p.x), ceil(p.y)));
	float q21 = smoothNoise2(vec2(ceil(p.x), floor(p.y)));
	float q22 = smoothNoise2(vec2(ceil(p.x), ceil(p.y)));
	float r1 = mix(q11, q21, s.x);
        float r2 = mix(q12, q22, s.x);
	return mix (r1, r2, s.y);
}

float diffuseSphere(vec2 p, float r) {
  float z = sqrt(r*r - p.x*p.x - p.y*p.y);
  vec3 normal = normalize(vec3(p.x, p.y, z));
  float diffuse = max(0., dot(normal, cLight));
  return diffuse;
}

void main( void ) {
	vec2 center = resolution / 2.;
	float radius = min(resolution.x, resolution.y) / 2.;
	
	vec2 position = gl_FragCoord.xy - center;
	if (length(position) > radius) {
		gl_FragColor=  vec4(0.16, 0., 0.22, 1.);
	} else {
		float diffuse = diffuseSphere(position, radius);
		
		position/= (radius);
		position += time / 2.;
		
		float noise = interpolatedNoise(position);
		gl_FragColor = vec4(vec3(noise * diffuse * vec3(1., 0., 0.)), 1.);
	}

}