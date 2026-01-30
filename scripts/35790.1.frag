#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi = 3.141592;

float sdSphere(vec3 p, float r) {
	return length(p) - r;
}

float sdPlane(vec3 p) {
	return p.y + 0.02*sin(p.z * 10.0 + time * 2.0);
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float ra, float rb) {
	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
	return length(pa - ba * h) - mix(ra, rb, h);
}

vec2 opU( vec2 d1, vec2 d2 ) {
	return (d1.x<d2.x) ? d1 : d2;
}

/*
vec2 solve(vec2 p, float l1, float l2) {
	vec2 q = p*( 0.5 + 0.5*(l1*l1-l2*l2)/dot(p,p) );

	float s = l1*l1/dot(q,q) - 1.0;

	if( s<0.0 ) return vec2(-100.0);
	
    	return q + q.yx*vec2(-1.0,1.0)*sqrt( s );
}
*/
vec4 solve(vec2 p1, float r1, vec2 p2, float r2) {
	vec2 p = p2 - p1;
	float d = length(p);
	float k = (d * d + r1 * r1 - r2 * r2) / (2.0 * d);
	float x1 = p1.x + (p.x * k) / d + (p.y / d) * sqrt(r1 * r1 - k * k);
	float y1 = p1.y + (p.y * k) / d - (p.x / d) * sqrt(r1 * r1 - k * k);
	float x2 = p1.x + (p.x * k) / d - (p.y / d) * sqrt(r1 * r1 - k * k);
	float y2 = p1.y + (p.y * k) / d + (p.x / d) * sqrt(r1 * r1 - k * k);
	
	return vec4(x1, y1, x2, y2);
}

vec2 map(vec3 p) {
	vec2 d = vec2(sdPlane(p), 3.0);
	float z = p.z;
	float phase = sin(z) * 3.14;
	p.z = mod(p.z, 0.25) - 0.125;
	float t = time * 10.0;
	vec3 center = vec3(0.1 * sin(z + time * 4.0), 0.5, 0.0);
	vec3 joint_r = vec3(-0.4, 0.4, 0.0); 
	vec3 joint_l = vec3(0.4, 0.4, 0.0);
	float h = mouse.y;
	vec3 foot_r = vec3(-0.5, h * (0.5 + 0.5 * sin(t + phase)), 0.0); 
	vec3 foot_l = vec3(0.5, h * (0.5 + 0.5 * sin(t + pi + phase)), 0.0);
	joint_r.xy = solve(center.xy, 0.4, foot_r.xy, 0.4).xy;
	joint_l.xy = solve(center.xy, 0.4, foot_l.xy, 0.4).zw;
	
	d = opU(d, vec2(sdSphere(p - center, 0.1), 1.0));
	d = opU(d, vec2(sdCapsule(p, center, joint_l, 0.05, 0.02), 2.0));
	d = opU(d, vec2(sdCapsule(p, joint_l, foot_l, 0.02, 0.01), 2.0));
	d = opU(d, vec2(sdCapsule(p, center, joint_r, 0.05, 0.02), 2.0));
	d = opU(d, vec2(sdCapsule(p, joint_r, foot_r, 0.02, 0.01), 2.0));
	return d;
}

vec3 calcNormal(vec3 p) {
	vec2 e = vec2(-1.0, 1.0) * 0.001;
	return normalize(
		e.xyy * map(p + e.xyy).x +
		e.yxy * map(p + e.yxy).x + 
		e.yyx * map(p + e.yyx).x + 
		e.xxx * map(p + e.xxx).x
	);
}

float softshadow(vec3 ro, vec3 rd, float mint, float tmax ) {
	float res = 1.0;
	float t = mint;
	for( int i=0; i<16; i++ )
	{
		float h = map( ro + rd*t ).x;
		res = min( res, 32.0*h/t );
		t += clamp( h, 0.02, 0.10 );
		if( h<0.001 || t>tmax ) break;
	}
	return clamp( res, 0.0, 1.0 );
}


void main( void ) {

	vec2 p = ( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;
	vec3 ro = vec3((mouse.x - 0.5) * 10.0, 2.0, 6.0);
	vec3 ta = vec3(0.0, 0.0, 0.0);
	vec3 cw = normalize(ta - ro);
	vec3 up = vec3(0.0, 1.0, 0.0);
	vec3 cu = normalize(cross(cw, up));
	vec3 cv = normalize(cross(cu, cw));
	vec3 rd = normalize(p.x*cu + p.y*cv + 2.7*cw); 
	
	float precis = 0.001;
	float t = 0.0;
	float h = precis * 2.0;
	float m = 0.0;
	for(int i = 0; i < 120; i++) {
		if(abs(h) < precis || t > 20.0) continue;
		vec2 o = map(ro + rd * t);
		h = o.x;
		m = o.y;
		t += h;
	}
	
	vec3 c = vec3(0.0);
	vec3 col = vec3(0.5 + 0.5 * sin(m * 0.1), 0.5 + 0.5 * sin(m * 2.0), 0.3);
	if(h < precis) {
		vec3 pos = ro + rd * t;
		vec3 lig = normalize(vec3(1.0));
		vec3 nor = calcNormal(pos);
		float dif = clamp(dot(lig, nor), 0.0, 1.0);
		float spe = pow(clamp(dot(reflect(lig, nor), rd), 0.0, 1.0), 64.0);
		float sh = softshadow(pos, lig, 0.01, 10.0);
		float fre = 1.0 - dot(-rd, nor);
		float fog = 1.0 - clamp(exp(-0.2 * (pos.z + 5.0)), 0.0, 1.0);
		c = 1.5 * col * (dif + spe + fre * 0.5) * (0.5 + 0.5 * sh) * fog;
	}

	gl_FragColor = vec4( c, 1.0 );
}