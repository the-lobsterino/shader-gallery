precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MAX_MARCHING_STEPS 256
#define NEAR 0.0
#define FAR 150.0
#define EPSILON 0.001

float sphereSDF(vec3 p, float radius)
{
    return length(p) - radius;
}

float boxSDF( vec3 p, vec3 b )
{
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float sceneSDF(vec3 p)
{
    float s = 2.0;
    p = floor(p * s) / s ;
    return max(-sphereSDF(p, 3.0), boxSDF(p, vec3(2.5)));
}

vec3 getNormal(vec3 p) {
    return normalize(vec3(
        sceneSDF(vec3(p.x + EPSILON, p.y, p.z)) - sceneSDF(vec3(p.x - EPSILON, p.y, p.z)),
        sceneSDF(vec3(p.x, p.y + EPSILON, p.z)) - sceneSDF(vec3(p.x, p.y - EPSILON, p.z)),
        sceneSDF(vec3(p.x, p.y, p.z  + EPSILON)) - sceneSDF(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

float getDistance(vec3 eye, vec3 ray) {
    float depth = NEAR;

    for(int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = sceneSDF(eye + depth * ray);
        if(dist < EPSILON) {
            return depth;
        }

        depth += dist;

        if(depth >= FAR) {
            return FAR;
        }
    }

    return FAR;
}

vec3 getRay(vec2 p, float fov, vec3 eye, vec3 target, vec3 up)
{
    vec3 dir = normalize(eye - target);
    vec3 side = normalize(cross(up, dir));
    float z = - up.y / tan(radians(fov) * 0.5);
    return normalize(side * p.x + up * p.y + dir * z);
}

vec4 render(float t, vec2 p)
{
    float fov = 30.0;
    float s = sin(t);
    float c = cos(t);
    vec3 eye = vec3(c * 20.0, c * 10.0, s * 20.0);
    vec3 target = vec3(0.0, 0.0, 0.0);
    vec3 up = vec3(0.0, 1.0, 0.0);

    vec3 ray = getRay(p, fov, eye, target, up);

    float dist = getDistance(eye, ray);

    if(dist == FAR) {
        return vec4(0.5, 0.5, 0.5, 1.0);
    }

    vec3 normal = getNormal(eye + dist * ray);

    float diff = dot(normal, normalize(vec3(1.0, 1.0, 1.0)));

    return vec4(vec3(diff), 1.0);
}

void main( void ) {
    vec2 p = 2.0 * (gl_FragCoord.xy / resolution.xy - 0.5) * resolution.xy / resolution.y;
    gl_FragColor = render(time, p);
}