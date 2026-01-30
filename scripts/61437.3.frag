#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


struct Ray{
    vec3 origin;
    vec3 direction;
};

struct Sphere{
    float radius;
    vec3  position;
    vec3  color;
};

bool intersectSphere(Ray R, Sphere S){
    vec3  a = R.origin - S.position;
    float b = dot(a, R.direction);
    float c = dot(a, a) - (S.radius * S.radius);
    float d = b * b - c;
    if(d > 0.0){
        float t = -b - sqrt(d);
        return (t > 0.0);
    }
    return false;
}

uniform float t;
uniform vec2 m;
uniform vec2 r;

void main( void ) {
	// fragment position
	vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);

	// ray init
    Ray ray;
    ray.origin = vec3(0.0, 0.0, 5.0);
    ray.direction = normalize(vec3(p.x, p.y, 1.0));

    // sphere init
    Sphere sphere;
    sphere.radius = 1.0;
    sphere.position = vec3(0.0);
    sphere.color = vec3(1.0);

    // hit check
    vec3 destColor = vec3(0.0);
    if(intersectSphere(ray, sphere)){
        destColor = sphere.color;
    }

    gl_FragColor = vec4(destColor, 1.0);

}