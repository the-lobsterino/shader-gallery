#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float map(vec3 p) {
	float k = .3 + .2 * (.5 + .5 * (cos(p.y * 10. + time) + cos(p.x * 2. + time) + cos(p.z * 5. + time)));
	float q = length(p.xy) - 1.;
	return length(vec2(q, p.z)) - k;
}

vec3 calcNormal( in vec3 pos )
{
  vec3 eps = vec3( 0.01, 0.0, 0.0 );
  vec3 nor = vec3(
  map(pos+eps.xyy) - map(pos-eps.xyy), 
  map(pos+eps.yxy) - map(pos-eps.yxy), 
  map(pos+eps.yyx) - map(pos-eps.yyx) );
  return normalize(nor);
}

vec3 render(vec3 ro, vec3 rd) {
	rd = normalize(rd);
	vec3 p = vec3(0);
	vec3 col = vec3(0);
	
	float t = 0.;
	for (int i = 0; i < 128; i++) {
		p = ro + rd * t;
		float d = map(p);
		if (t > 1000.) break;
		t += .5 * d;
	}
	
	
	
	if (t > 1000.) col += vec3(rd.y + 1.) / 3.;
	else {
		col = vec3(0);
	
		vec3 n = calcNormal(p);
		vec3 l = vec3(0, 1, 2);
		vec3 lp = normalize(l - p);
		float diff = max(dot(lp, n), 0.);
		vec3 ref = normalize(reflect(-lp, n));
		float spec = pow(.35 * max(dot(ref, ro), 0.), 8.);
		col += (.6 * diff + spec);
	}

	return col;
}

void main() {
	
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	
	vec3 ro = vec3(3. * cos(time / 10.), 1, 3. * sin(time / 10.));
	vec3 rd = vec3(uv, 1);
	vec3 lookAt = vec3(0.);
	vec3 up = vec3(0., 1., 0.);
	vec3 forward = normalize(lookAt - ro);
	vec3 right = normalize(cross(forward, up));
	up = normalize(cross(right, forward));
	rd = normalize(right * uv.x + up * uv.y + forward);
	
	for (int i = -1; i <= 1; i++) {
		for (int j = -1; j <= 1; j++) {
			col += render(ro, rd + vec3((1. / resolution) * vec2(i, j), 0.));
		}
	}
	col /= 9.;
	
	gl_FragColor = vec4(col, 1.);

}