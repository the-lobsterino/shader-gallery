#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float sdPlane(vec3 p) {
	return p.y;
}

float sdSphere(vec3 p, float r) {
	return length(p) - r + 0.01 * sin(p.z * 3.14 * 4.0 + time * 2.0) + 0.01 * sin(p.y * 3.14 * 20.0 + time * 2.0);
}

float smin(float a, float b, float k) {
	float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
	return mix(b, a, h) - k * h * (1.0 - h);
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return length(max(d,0.0))
         + min(max(d.x,max(d.y,d.z)),0.0); // remove this line for an only partially signed sdf 
}

float sdRoundBox( vec3 p, vec3 b, float r )
{
  vec3 d = abs(p) - b;
  return length(max(d,0.0)) - r
         + min(max(d.x,max(d.y,d.z)),0.0); // remove this line for an only partially signed sdf 
}


float map(vec3 p) {
	float d = sdPlane(p-vec3(0.0,0.2+sin(p.x+p.z+time)*0.2,0.0));
	d = smin(d, sdSphere(p - vec3(0.0, 0.45, 0.0), 0.5), 0.4);
	
	p.x = abs(p.x);
	
	float d1 = sdRoundBox(p-vec3(1.+sin(time)*0.4,p.x*0.3,0.0),vec3(0.4,0.05,0.05),0.2);
	d = smin(d,d1,0.2);
		
	return d;
}

vec3 calcNormal(vec3 p) {
	vec2 e = vec2(-1.0, 1.0) * 0.0001;
	return normalize(
		e.xyy * map(p + e.xyy) +
		e.yxy * map(p + e.yxy) +
		e.yyx * map(p + e.yyx) +
		e.xxx * map(p + e.xxx)
	);
}

float shadow(vec3 ro, vec3 rd, float min_t, float max_t, float k) {
	float t = min_t;
	float h = 0.0;
	float res = 1.0;
	for(int i = 0; i < 30; i++) {
		if(t > max_t) continue;
		h = map(ro + rd * t);
		res = min(res, k * h / t);
		t += h;
	}
	return res;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	
	vec3 ro = vec3(0.0, 1.0, 3.0);
	vec3 rd = normalize(vec3(p.x, p.y - 0.5, -2.5));
	
	float e = 0.0001;
	float t = 2.0 * e;
	float h = 0.0;
	for(int i = 0; i < 160; i++) {
		if(t < e || t > 20.0) continue;
		h = map(ro + rd * t);
		t += h*0.5;
	}
	
	float col = 0.58;
	
	if(t < 100.0) {
		vec3 pos = ro + rd * t;
		vec3 nor = calcNormal(pos);
		vec3 lig = normalize(vec3(1.0));
		float dif = clamp(dot(lig, nor), 0.0, 1.0);
		float spe = pow(clamp(dot(reflect(lig, nor), rd), 0.0, 1.0), 32.0);
		float sh = shadow(pos, lig, e, 20.0, 6.0);
		col = (dif + spe) * sh;
	}

	gl_FragColor = vec4( vec3( col ), 1.0 );

}