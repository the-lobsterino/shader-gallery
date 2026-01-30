#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray {
    vec3 o;
    vec3 d; //should always be normalized
};

struct Sphere {
  vec3 pos;
	float rad;
	vec4 col;
};

float rrad = 1.35;
float rspeed = 1.0;

vec4 specularColor = vec4(1.0);

Sphere sphere1 = Sphere(vec3(rrad*cos(rspeed*time), 1.0+0.5*sin(rspeed*time), rrad*sin(rspeed*time)),
		 1.0, vec4(1.0, 0.5, 0.5, 1.0));
Sphere sphere2 = Sphere(vec3(-rrad*cos(rspeed*time), 1.0-0.5*sin(rspeed*time), -rrad*sin(rspeed*time)),
		 1.0, vec4(1.0, 1.0, 0.5, 1.0));

vec3 lightPos = vec3(10.0, 10.0, 10.0);
vec3 cameraPos = vec3(mouse.x-0.5, mouse.y, 4.0);

vec4 amb = vec4(0.1, 0.2, 0.4, 1.0);

float intersectSphere(in Ray ray, in Sphere sphere)
{
    vec3 oc = ray.o - sphere.pos;
    float b = 2.0 * dot(ray.d, oc);
    float c = dot(oc, oc) - sphere.rad*sphere.rad;
    float disc = b * b - 4.0 * c;

    if (disc < 0.0)
        return -1.0;

    // compute q as described above
    float q;
    if (b < 0.0)
        q = (-b - sqrt(disc))/2.0;
    else
        q = (-b + sqrt(disc))/2.0;

    float t0 = q;
    float t1 = c / q;

    // make sure t0 is smaller than t1
    if (t0 > t1) {
        // if t0 is bigger than t1 swap them around
        float temp = t0;
        t0 = t1;
        t1 = temp;
    }

    // if t1 is less than zero, the object is in the ray's negative direction
    // and consequently the ray misses the sphere
    if (t1 < 0.0)
        return -1.0;

    // if t0 is less than zero, the intersection point is at t1
    if (t0 < 0.0) {
        return t1;
    } else {
        return t0; 
    }
}
float triangleIntersectionDistance( vec3 origin, vec3 direction, vec3 v1, vec3 v2, vec3 v3){    
	v1 -= origin;
    v2 -= origin;
    v3 -= origin;
    origin = vec3(0.0);
    vec3 e0 = v2 - v1;
	vec3 e1 = v3 - v1;

	vec3  h = cross(direction, e1);
	float a = dot(e0, h);
    
	float f = 1.0 / a;

	vec3  s = origin - v1;
	float u = f * dot(s, h);

	vec3  q = cross(s, e0);
	float v = f * dot(direction, q);

	float t = f * dot(e1, q);
            
    vec3 incidentPosition = v1 + (v2 - v1)*u + (v3 - v1)*v;

    return t > 0.0 && t < 9999999.0 && 
       (a <= -0.000001 || a >= 0.000001) && 
        u >= 0.0 && u <= 1.0 && 
        v >= 0.0 && u + v <= 1.0 && 
        t >= 0.000001 ? distance(origin, incidentPosition) : -1.0;

}
float intersectPlane(in Ray ray)
{
    return -ray.o.y/ray.d.y;
}

vec3 sphereNormal(in vec3 pos, in Sphere sphere)
{
	return (pos - sphere.pos)/sphere.rad;
}

float diffuseFactor(in vec3 surfaceNormal, in vec3 lightDir) {
	return clamp(dot(surfaceNormal, lightDir), 0.0, 1.0);
}

float specularFactor(in vec3 surfaceNormal, in vec3 lightDir)
{
	vec3 viewDirection = normalize(cameraPos);
	vec3 halfAngle = normalize(lightDir + viewDirection);
	float ks = dot(surfaceNormal, halfAngle);
	ks = clamp(ks, 0.0, 1.0);
	ks = pow(ks, 50.0);
	return ks;
}

int worldIntersect(in Ray ray, float maxlen, inout float t)
{
    t = maxlen;
    int id = 0;
	
		vec3 v1 = vec3(-1.0, 1.0, 0.0);
		vec3 v2 = vec3(1.0, 1.0, 1.0);
		vec3 v3 = vec3(0.0, 2.0, 0.0);
	
    float ts1 = triangleIntersectionDistance(ray.o, ray.d, v1, v3, v2);
    float ts2 = intersectSphere(ray, sphere2);
    float tp = intersectPlane(ray);
    if (ts1 > 0.0) {
        t = ts1;
        id = 1;
    }
    if (ts2 > 0.0 && ts2 < t) {
        t = ts2;
        id = 2;
    }
    if ( tp > 0.0 && tp < t) {
        t = tp;
        id = 3;
    }
    return id;
}

float worldShadow(in Ray ray, in float maxlen, in int id)
{
		vec3 v1 = vec3(-1.0, 1.0, 0.0);
		vec3 v2 = vec3(1.0, 1.0, 1.0);
		vec3 v3 = vec3(0.0, 2.0, 0.0);
	
    float ts1 = triangleIntersectionDistance(ray.o, ray.d, v1, v3, v2);
    float ts2 = intersectSphere(ray, sphere2);
    if(ts1 > 0.0 && id != 1)
        return 0.0;
    if(ts2 > 0.0 && id != 2)
        return 0.0;
    return 1.0;
}   

void applyFog(in float t, inout vec4 col)
{
    col = mix(col, amb, clamp(sqrt(t*t)/10.0, 0.0, 1.0));
}

void main( void ) {
    //pixels from 0 to 1
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    vec3 d = vec3(-1.0 + 2.0*uv, -1.0);
    d.x *= resolution.x/resolution.y;

    Ray ray = Ray(cameraPos, normalize(d));
    vec4 col = vec4(0.0,0.0,0.0,1.0);
    float t = 0.0;
    int id = worldIntersect(ray, 1000.0, t);
    vec3 pos = ray.o + t*ray.d;
    vec3 lightDir = normalize(lightPos-pos);
    if (id == 1) {
	vec3 surfaceNormal = sphereNormal(pos, sphere1);
        float dif = diffuseFactor(surfaceNormal, lightDir);
	float spec = specularFactor(surfaceNormal, lightDir);
        col = dif*sphere1.col+spec*specularColor;
    } else if (id == 2) {
        vec3 surfaceNormal = sphereNormal(pos, sphere2);
        float dif = diffuseFactor(surfaceNormal, lightDir);
	float spec = specularFactor(surfaceNormal, lightDir);
        col = dif*sphere2.col+spec*specularColor;
    } else if (id == 3) {
        col = vec4(0.7, 0.7, 0.7, 1.0);
    }
    col *= worldShadow(Ray(vec3(pos), lightDir), 100.0, id);
    col = col + 0.2*amb;
    //col = sqrt(col);
    applyFog(t, col);
    
    gl_FragColor = col;
}