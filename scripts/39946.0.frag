#ifdef GL_ES
	precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

#define EPS 1e-3
#define PI 3.1415
#define INF 9e9

vec3 rotateX(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 rotateY(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(c*p.x + s*p.z, p.y, c*p.z - s*p.x); }
vec3 rotateZ(vec3 p, float a) { float c = cos(a); float s = sin(a); return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z); }

vec3 rot1 = vec3(0.1, -0.629, 0.04);
vec3 rot2 = vec3(PI/2., 0., -2.1);
vec3 rot3 = vec3(0., PI+0.82, 0.0);
vec3 rot4 = vec3(0.18, -0.629, 0.);

vec3 rotate(vec3 p, vec3 rot){
	return rotateX(rotateY(rotateZ(p, rot.x), rot.y), rot.z);
}

float sdBox(vec3 p, vec3 b) {
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sdEllipsoid(in vec3 p, in vec3 r) {
    return (length(p/r) - 1.) * min(min(r.x,r.y),r.z);
}

float sdCappedCylinder( vec3 p, vec2 h )
{
  vec2 d = abs(vec2(length(p.xz),p.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float sdCone( vec3 p, vec2 c )
{
    c = normalize(c);
    float q = length(p.xy);
    return dot(c,vec2(q,p.z));
}

float sdCappedCone( in vec3 p, in vec3 c )
{
    vec2 q = vec2( length(p.xz), p.y );
    vec2 v = vec2( c.z*c.y/c.x, -c.z );
    vec2 w = v - q;
    vec2 vv = vec2( dot(v,v), v.x*v.x );
    vec2 qv = vec2( dot(v,w), v.x*w.x );
    vec2 d = max(qv,0.0)*qv/vv;
    return sqrt( dot(w,w) - max(d.x,d.y) ) * sign(max(q.y*v.x-q.x*v.y,w.y));
}

float sdPlane(vec3 p, vec4 n) {
  // n must be normalized
  return dot(p,n.xyz) + n.w;
}

float substract(float d1, float d2) {
    return max(-d1,d2);
}

float add(float d1, float d2) {
	return min(d1,d2);
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float blend( float d1, float d2 )
{
    return smin( d1, d2, 0.2);
}

float scene(vec3 p) {
	float sub = add(
		sdCone(rotate(p,rot3)+vec3(0.37,0.1,-1.32), vec2(1.6,0.2)),
		sdBox(rotate(p,rot4)+vec3(0.,0.1,-0.9), vec3(2.,0.1,0.6))
	);
	//sub = sdCone(rotate(p,rot3)+vec3(0.37,0.1,-1.7), vec2(1.7,0.15));
	float wavebody = sdEllipsoid(rotate(p-vec3(0.,-0.15,0.),rot1), vec3(1.,0.4,0.5));
	float wave = substract(sub, wavebody);
	float plane = sdPlane(p, vec4(0.,1.,-0.02,.23));
	float d = blend(plane, wave);
	//p += vec3(.6+.2*sin(time),-0.123,0.);
	//return sdCone(rotate(p,rot3)+vec3(0.,0.1,0.), vec2(1.7,0.3)); //x->vorne/hinten, y->
	//return sdBox(rotate(p+vec3(-0,-0.,-0.),rot4), vec3(0.2,0.2,.4));
	//return wave;
	//return sub;
	return d;
}
	
vec3 normal(vec3 p) {
	vec2 e = vec2(EPS, 0.);
	float d = scene(p);
	return normalize(vec3(d-scene(p+e.xyy), d-scene(p+e.yxy), d-scene(p+e.yyx)));
}

vec3 hitcol(vec3 hitp) {
	hitp = rotateX(rotateY(rotateZ(hitp, -rot1.x), -rot1.y), -rot1.z);
	float fac = 15.;
	if (hitp.z*fac-floor(hitp.z*fac) < 0.05)
		return vec3(0.6, 0.6, 0.6);
	else
		return vec3(.07, .21, .3);
}

bool raytrace(vec3 ro, vec3 rd, out vec3 p) {
	float f = 0.;
	
	const float fMax = 2.5;
	
	for (int i=0; i<256; i++) {
		p = ro+f*rd;
		float d = scene(p);
		if (d <= EPS) return true;
		if (f > fMax) return false;
		f += d;
	}
	
	return false;
}

void main(void) {
	vec2 uv = (2.*gl_FragCoord.xy-resolution.xy)/min(resolution.x,resolution.y);

	vec3 ro = vec3(0.,0.05,1.);
	vec3 rd = normalize(vec3(0.6*uv.xy,-1.));
	vec3 p;
	bool hit = raytrace(ro, rd, p);
	vec3 color;
	if (hit) {
		//vec3 n = normal(p);
		//color = vec3(dot(n,normalize(p-ro)));
		color = hitcol(p);
	} else {
		if (length(uv-vec2(0., 0.3))<0.6)
			color = vec3(0.7, 0., 0.);
		else
			color = vec3(0.8,0.8,0.7);
	}
	gl_FragColor = vec4(color, 1.);

}