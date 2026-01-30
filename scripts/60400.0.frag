// WET ShiTz
#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
struct Ray {
	vec3 pos;
	vec3 dir;
};


// exponential smooth min (k = 32);
float smin( float a, float b, float k ) {
	float res = exp( -k*a ) + exp( -k*b );
	return -log( res )/k;
}

vec3 rotX(vec3 v, float a) {
	a *= 3.141592 / 180.;
	float c = cos(a);
	float s = sin(a);
	return vec3(
		v.x,
		v.y * c - v.z * s,
		v.z * c + v.y * s
	);
}

vec3 rotY(vec3 v, float a) {
	a *= 3.141592 / 180.;
	float c = cos(a);
	float s = sin(a);
	return vec3(
		v.x * c - v.z * s,
		v.y,
		v.z * c + v.x * s
	);
}

float distBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float dist1(vec3 p) {
	if (abs(p.z) < 0.3) p.x += p.z * p.z * sign(p.x);
	p.x += p.y * sign(p.x) * 0.04;
	return distBox(p, vec3(0.1, 0.15, 0.2)) - 0.01;
}

float dist2(vec3 p) {
	p.x /= 0.55;
	p.y -= 0.25;
	p.y /= 1.1;
	p /= 1.2;
	vec2 t = vec2(0.25, 0.06);
	vec2 q = vec2(length(p.xz)-t.x,p.y);
	float d = length(q)-t.y;
	d = max(d, p.y - 0.01);
	return d;
}

float lengthN(vec2 v, float n) {
	v.x = pow(v.x, n);
	v.y = pow(v.y, n);
	return pow(v.x + v.y, 1./n);
}

float dist3(vec3 p) {
	p.y *= 2.5;
	p.x /= 0.55 * 1.3;
	p.y -= 0.7;
	p.z /= 1.3;
	vec2 t = vec2(0.25, 0.06);
	vec2 q = vec2(length(p.xz)-t.x,p.y);
	float d = length(q)-t.y;
	return d;
}

float dist4(vec3 p) {
	p.y -= 0.55;
	p.y /= 1.4 - min(0., p.y) * 0.7;
	p.z += 0.34;
	float d = length(p.xy) - 0.2;
	d = max(d, p.z - max(0., length(p.xy) - 0.19));
	d = max(d, -p.z - 0.01);
	return d;
}

float dist5(vec3 p) {
    
	p.y -= 0.52;
	p.y = abs(p.y);
	p.y += 0.52;
	p.x = abs(p.x);
	p.y -= 0.66;
	p.x -= 0.12;
	p.z += 0.34;

	float d = length(p) - 0.015;
	d = max(d, -p.z);
	return d;
}

float dist6(vec3 p) {
	p.yz -= vec2(0.3, -0.34);
	p = rotX(p, 30. * sin(iTime * 10.) - 30.);
	p.yz += vec2(0.3, -0.34);
	return min(dist4(p), dist5(p));
}

float dist(vec3 p) {
	return min(min(smin(dist1(p), dist2(p), 25.), dist3(p)), dist6(p));
}

vec3 getNormal(vec3 p) {
	float eps = 1e-3;
	return normalize(vec3(
		dist(p+vec3(eps,0,0)) - dist(p),
		dist(p+vec3(0,eps,0)) - dist(p),
		dist(p+vec3(0,0,eps)) - dist(p)
	));
}

vec3 getColor(Ray ray) {
	vec3 pos = ray.pos;
	vec3 shit = vec3(1.0);
	for (int i = 0; i < 100; i++) {
		float d = dist(pos);
		if (abs(d) < 1e-3) break;
		pos += ray.dir * d;
	}
	if (dist(pos) < 1e-3) {
		float ambient = 0.3;
		vec3 lightPos = vec3(3);
		vec3 normal = getNormal(pos);
		float diffuse = max(0., dot(normal, normalize(lightPos - pos)));
		if(pos.x > 0.0 && pos.y < 0.27 && pos.y > 0.1 && pos.z > -1.0 && pos.z < 0.0)
			shit = vec3(0.8, 0.4, 0.1);
		return vec3(ambient + diffuse * shit);
	}
	return vec3(0,0,0);
}

Ray getRay(vec2 screenPos) {
	Ray ray;
	ray.pos = vec3(screenPos * 0.4,1);
	ray.dir = normalize(vec3(screenPos*0.2, -1));

    /*
	float angleX = -10.;
	angleX += sin(iTime) * 20.;
	ray.pos = rotX(ray.pos, angleX);
	ray.dir = rotX(ray.dir, angleX);

	float angleY = 0.;
	angleY += sin(iTime * 0.2) * 20.;
	ray.pos = rotY(ray.pos, angleY);
	ray.dir = rotY(ray.dir, angleY);
*/
    float b = -20.;
	ray.pos = rotX(ray.pos, b);
	ray.dir = rotX(ray.dir, b);
        
    float a = 20. * sin(iTime);
    ray.pos = rotY(ray.pos, a);
    ray.dir = rotY(ray.dir, a);
    

	ray.pos.y += 0.3;
	return ray;
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
	vec2 screenPos = (fragCoord / iResolution.xy - 0.5) * vec2(iResolution.x /iResolution.y, 1) * 2.;

	// Main Code Here...
	vec3 col = getColor(getRay(screenPos));
	fragColor = vec4(col,1);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}