#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

const float PI = 3.1415926;
const float PI2 = PI * 2.0;
const float EPS = 1e-4;

float dSphere(vec3 p, float r) {
    return length(p) - r;
}

mat2 rotate(float a) {
	float c = cos(a), s = sin(a);
	return mat2(c, s, -s, c);
}

float dMenger(vec3 z0, vec3 offset, float scale) {
    vec4 z = vec4(z0, 1.0);
    for (int n = 0; n < 5; n++) {
        z = abs(z);

        if (z.x < z.y) z.xy = z.yx;
        if (z.x < z.z) z.xz = z.zx;
        if (z.y < z.z) z.yz = z.zy;

        z *= scale;
        z.xyz -= offset * (scale - 1.0);

        if (z.z < -0.5 * offset.z * (scale - 1.0)) {
            z.z += offset.z * (scale - 1.0);
        }
    }
    return length(max(abs(z.xyz) - vec3(1.0), 0.0)) / z.w;
}

vec2 foldRotate(vec2 p, float s) {
    float a = PI / s - atan(p.x, p.y);
    float n = PI2 / s;
    a = floor(a / n) * n;
    p = rotate(a) * p;
    return p;
}

vec3 opRep(vec3 p, vec3 c) {
	return mod(p, c) - 0.5 * c;
}

vec2 dScene(vec3 p) {
    float ind=ceil(mod(p.z,8.))*.8;
    p -= vec3(2.0);
	p = opRep(p, vec3(4.0, 4.0, 2.0));	
	p.xy = foldRotate(p.xy, 8.0);
	float d = dMenger(p, vec3(1., 1.4, 0.5), 2.3);
	float d2 = dMenger(p, vec3(.8, 1.4 + 0.1 * sin(time), 0.5), 2.3);
	return vec2(mix(d2,-d,fract(.5*time)),ind);
}

void main( void ) {

	vec2 uv =vec2(2.*gl_FragCoord.xy- resolution.xy) / min(resolution.x,resolution.y);

	
	float t = fract(time);

	vec3 ro = vec3(0.01, 0.01, t);
	ro.xz*=rotate(.01*time);
	vec3 ta = vec3(.2, 0.01, t-.1);
	ta.xy*=rotate(time);

	vec3 fwd = normalize(ta - ro);
	vec3 right = cross(fwd, vec3(0, 1, 0));
	vec3 up = cross(right, fwd);
	vec3 rd = normalize(fwd + uv.x * right + uv.y * up);

	float distance = 0.0;
	vec3 p = ro;
	int step = 0;
	for (int i = 0; i < 80; i++) {
		step = i;
		float d = dScene(p).x;
		distance += d;
		p = ro + distance * rd;
		if (abs(d) < EPS) break;
	}

	vec3 c = (clamp(abs(6.*fract(vec3(.0,.6,.3)+dScene(p).y)-3.)-1.,.0,1.)*1.8+1.)*.2;
	c=mix(c,1.-2.*c,fract(time));
	c+=vec3(float(step) * 0.01)+length(p)/240.;
	c+=clamp(dScene(p+1.2*rd).x*1.2,.0,1.);
	c+=clamp(dScene(p-2.4*rd).x*.8,.0,1.)-.5;
	gl_FragColor = vec4(gl_FragCoord.xy / resolution.xy, 0.0, 1.0);
	gl_FragColor = vec4(c, 1.0);

}