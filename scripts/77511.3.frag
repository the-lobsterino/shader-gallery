#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 rot(vec2 p, float a) {
	return vec2(
		p.x * cos(a) - p.y * sin(a),
		p.x * sin(a) + p.y * cos(a));
	
}

float map(vec3 p) {
	float t = length(mod(p, 2.0) - 1.0) - 0.3;
	t = min(t, 5.0 - dot(abs(p), vec3(0, 1, 0)));
	float g = 0.2;
	vec3 offset = vec3(0.0);
	for(int i =0 ; i < 4; i++) {
		vec3 ap = p;
		ap += offset;
		t = min(t, length(mod(ap.xz, 2.0) - 1.0) - 0.1 * g);
		t = min(t, length(mod(ap.zy, 2.0) - 1.0) - 0.1 * g);
		t = min(t, length(mod(ap.yx, 2.0) - 1.0) - 0.1 * g);
		g *= 0.9;
		offset.xz += vec2(0.2) + time * 0.1;
	}
	return t;
}

vec3 getnor(vec3 ip) {
	float t = map(ip);
	vec2 d = vec2(0.001, 0.0);
	return normalize(vec3(
		t - map(ip + d.xyy),
		t - map(ip + d.yxy),
		t - map(ip + d.yyx)));
}

void main( void ) {
	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y );
	if(abs(uv.y) > 0.8) {
		gl_FragColor = vec4(0, 0, 0, 1);
		return;
	}
	vec2 duv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	vec3 dir = normalize(vec3(uv, 1.0));
	float tm = time * 0.001;
	dir.xz = rot(dir.xz, tm);
	dir.zy = rot(dir.zy, tm);

	vec3 pos = vec3(0, 0, time * 0.3);
	float t = 0.0;
	for(int i =0 ;  i < 100; i++ ){
		t += map(dir * t + pos);
	}

	vec3 ip = dir * t + pos;
	vec3 N = getnor(ip);
	vec3 L = normalize(vec3(1, 2, 3));
	float D = max(0.1, dot(L, N));
	float S = pow(D, 64.0);
	vec3 fog = t * 0.01 * vec3(1,2,3);
	float mm = 1.0 - dot(uv * 0.3, uv);
	gl_FragColor = vec4(t * 0.01) * dir.xyzz + fog.xyzz;
	gl_FragColor.xyz += D * vec3(0.2,2,3) * 0.1;
	gl_FragColor.xyz += S * vec3(1,2,3) * 0.1;
	gl_FragColor.xyz = pow(gl_FragColor.xyz, vec3(0.454545));
	gl_FragColor.xyz *= mm;
	gl_FragColor.xyz += map(ip + dir) * 0.3;
	gl_FragColor.w = 1.0;
}
