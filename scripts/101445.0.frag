#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

//g

vec2 Mapping(vec3 p) {
	vec3 mp;
	float jt = (sin(p.z * 27.0) * sin(p.y * 21.0 + time) * sin(p.x * 20.0 + time)) * 0.02;
	jt += (sin(p.z * 47.0) * sin(p.y * 71.0 + time) * sin(p.x * 20.0 - time)) * 0.01;
	float t = 0.2;
	float id = 0.0;
	float tt = 0.0;
	mp = p;
	t = min(t, length(mp * vec3(1.0, 0.4, 1.0)) - 1.0 + jt);
	
	mp = p + vec3(1.0, 0.5, 0.0);
	tt = length(mp * vec3(1.0, 0.4, 1.0).yzx) - 0.3;
	t = min(t, tt + jt);

	mp = p + vec3(1.8, 0.9, 0.0);
	tt = length(mp * vec3(1.0, 0.4, 1.0).xyz) - 0.18;
	t = min(t, tt + jt);
	
	mp = p + vec3(0.3, 2.5, 0.0);
	tt = length(mp + jt) - 0.25;
	t = min(t, tt);
	
	mp = p + vec3(-0.3, 2.5, 0.0);
	tt = length(mp) - 0.25;
	t = min(t, tt + jt);

	mp = p + vec3(0.2, 1.5, 0.75);
	tt = length(mp) - 0.1;
	t = max(t, -tt);

	mp = p + vec3(-0.2, 1.5, 0.75);
	tt = length(mp) - 0.1;
	t = max(t, -tt);

	mp = p + vec3(0.0, 1.0, 0.9);
	tt = length(mp) - 0.1;
	t = max(t, -tt);

	mp = p + vec3(0.0, 1.3, 0.8);
	tt = length(mp) - 0.1;
	t = min(t, tt);

	t = min(t, 0.5 - dot(p, vec3(0, 1, 0)));

	return vec2(t, id);
}

float Hash(vec2 p)
{
	return fract(sin(dot(p, vec2(32.3391, 38.5373))) * 74638.5453);
}

void main( void ) {
	vec2 uv = -1.0 + 2.0 * (gl_FragCoord.xy / resolution.xy );
	vec3 direction = normalize(vec3(uv * vec2(resolution.x/resolution.y,-1.0), 1));
	vec3 position = vec3(0, -0.9 + sin(time * 3.3) * 0.05, -2.0);
	float t = 0.0;
	for(int i = 0 ; i < 30; i++) {
		float tt = Mapping(direction * t + position).x;
		if(tt < 0.001) break;
		t += tt;
	}
	vec3 ip = direction * t + position;
	t = min(t, 3.0);
	gl_FragColor = vec4(t * Mapping(ip - 0.07).x) * vec4(6,3,2,1) * 0.5 + Hash(max(1.0, time) * uv) * 0.0015;
	gl_FragColor.a = 1.0;
}