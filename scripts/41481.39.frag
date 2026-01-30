/*
 * Ray tracing.
 *
 * Student card number: 161031
 */

#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
    precision mediump float;
#endif

const vec3 VZ = vec3(0.0);

#define RGB vec3
#define RGBA vec4

const RGB WHITE = RGB(1.0, 1.0, 1.0);
const RGB RED = RGB(1.0, 0.0, 0.0);
const RGB GREEN = RGB(0.0, 1.0, 0.0);
const RGB BLUE = RGB(0.0, 0.0, 1.0);
const RGB NO_COLOR = VZ;

const float PI = 3.1415926535;
const float EPSILON = 1e-3;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Light {
    vec3 pos;
    float irrad;
};

struct Ray {
    vec3 origin;
    vec3 dir; // normalized
};

#define SurfaceType int
const SurfaceType MATTE = 0;
const SurfaceType MIRROR = 1;

struct Surface {
    SurfaceType type;
    RGB color;
    float coeff;
};

struct HitPoint {
    vec3 pos;
    vec3 normal; // normalized
    vec3 ray_dir;
    Surface surface;
};

struct Hit {
    bool ok;
    float t;
    HitPoint point;
};

struct Sphere {
    vec3 center;
    float radius;
    Surface surface;
};

struct Plane {
    vec3 pos;
    vec3 normal; // normalized
    Surface surface;
};

struct Triangle {
    vec3 a;
    vec3 b;
    vec3 c;
    Surface surface;
};

const Hit NO_HIT
    = Hit(false, 0.0, HitPoint(VZ, VZ, VZ, Surface(MATTE, NO_COLOR, 0.0)));

const int SPHERE_NUM = 3;
Sphere spheres[SPHERE_NUM];

const int PLANE_NUM = 4;
Plane planes[PLANE_NUM];

const int TRIANGLE_NUM = 4;
Triangle triangles[TRIANGLE_NUM];

const int REFLECT_MAX = 5;

Hit traceSphere(Sphere sphere, Ray ray) {
    vec3 oc = ray.origin - sphere.center;
    float dc = dot(ray.dir, oc);
    float d = dc * dc - dot(oc, oc) + sphere.radius * sphere.radius;
    if (d < 0.0)
        return NO_HIT;
    float d_sq = sqrt(d);
    float t = -dc - d_sq;
    if (t < EPSILON)
        t = -dc + d_sq;
    if (t < EPSILON)
        return NO_HIT;

    vec3 hit_pos = ray.origin + t * ray.dir;
    HitPoint hit_point = HitPoint(
        hit_pos,
        (hit_pos - sphere.center) / sphere.radius,
        ray.dir,
        sphere.surface);
    return Hit(true, t, hit_point);
}

Hit tracePlane(Plane plane, Ray ray) {
    float t = dot(plane.pos - ray.origin, plane.normal)
                / dot(ray.dir, plane.normal);
    if (t < EPSILON)
        return NO_HIT;

    vec3 hit_pos = ray.origin + t * ray.dir;
    HitPoint hit_point = HitPoint(
        hit_pos,
        plane.normal,
        ray.dir,
        plane.surface);
    return Hit(true, t, hit_point);
}

float det(vec3 a, vec3 b, vec3 c) {
    return dot(cross(a, b), c);
}

Hit traceTriangle(Triangle triangle, Ray ray) {
    vec3 rhs = triangle.a - ray.origin;
    float det_a = det(triangle.a - triangle.b, triangle.a - triangle.c, ray.dir);

    float beta = det(rhs, triangle.a - triangle.c, ray.dir) / det_a;
    if (beta < 0.0 || 1.0 < beta)
        return NO_HIT;

    float gamma = det(triangle.a - triangle.b, rhs, ray.dir) / det_a;
    if (gamma < 0.0 || 1.0 < gamma)
        return NO_HIT;

    float alpha = 1.0 - beta - gamma;
    if (alpha < 0.0 || 1.0 < alpha)
        return NO_HIT;

    float t = det(triangle.a - triangle.b, triangle.a - triangle.c, rhs)
                / det_a;
    if (t < EPSILON)
        return NO_HIT;

    vec3 hit_pos = ray.origin + t * ray.dir;
    HitPoint hit_point = HitPoint(
        hit_pos,
        normalize(cross(triangle.b - triangle.a, triangle.c - triangle.a)),
        ray.dir,
        triangle.surface);
    return Hit(true, t, hit_point);
}

Hit trace(Ray ray) {
    Hit nearest_hit = NO_HIT;

    for (int i = 0; i < SPHERE_NUM; i++) {
        Hit hit = traceSphere(spheres[i], ray);
        if (hit.ok && (!nearest_hit.ok || hit.t < nearest_hit.t))
            nearest_hit = hit;
    }

    for (int i = 0; i < PLANE_NUM; i++) {
        Hit hit = tracePlane(planes[i], ray);
        if (hit.ok && (!nearest_hit.ok || hit.t < nearest_hit.t))
            nearest_hit = hit;
    }

    for (int i = 0; i < TRIANGLE_NUM; i++)  {
        Hit hit = traceTriangle(triangles[i], ray);
        if (hit.ok && (!nearest_hit.ok || hit.t < nearest_hit.t))
            nearest_hit = hit;
    }

    return nearest_hit;
}

bool isShadow(vec3 pos, Light light) {
    vec3 to_light = light.pos - pos;
    Ray ray = Ray(pos, normalize(to_light));

    for (int i = 0; i < SPHERE_NUM; i++) {
        Hit hit = traceSphere(spheres[i], ray);
        if (hit.ok && hit.t < length(to_light))
            return true;
    }

    for (int i = 0; i < PLANE_NUM; i++) {
        Hit hit = tracePlane(planes[i], ray);
        if (hit.ok && hit.t < length(to_light))
            return true;
    }

    for (int i = 0; i < TRIANGLE_NUM; i++)  {
        Hit hit = traceTriangle(triangles[i], ray);
        if (hit.ok && hit.t < length(to_light))
            return true;
    }

    return false;
}

float irradiance(vec3 pos, vec3 normal, Light light) {
    vec3 to_light = light.pos - pos;
    float r = length(to_light);
    float d = dot(normal, to_light);
    if (d < 0.0)
        return 0.0;
    else
        return light.irrad * d / (4.0 * PI * r * r) / PI;
}

RGB shade(Ray ray, Light light) {
    RGB color = NO_COLOR;

    for (int i = 0; i <= REFLECT_MAX; i++) {
        Hit hit = trace(ray);
        if (!hit.ok)
            return NO_COLOR;

        HitPoint hp = hit.point;

        light.irrad *= hp.surface.coeff;
        float irrad = irradiance(hp.pos, hp.normal, light);

        if (hp.surface.type == MATTE) {
            if (isShadow(hp.pos, light)) {
                return NO_COLOR;
            } else {
                if (irrad < EPSILON)
                    return NO_COLOR;
                else
                    return color += irrad * hp.surface.color;
            }
        } else if (hp.surface.type == MIRROR) {
            color += irrad * hp.surface.color;
            vec3 reflect_dir = reflect(hp.ray_dir, hp.normal);
            ray = Ray(hp.pos + EPSILON * reflect_dir, reflect_dir);
        }
    }

    return color;
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy / resolution.xy - 1.0)
        * vec2(resolution.x / resolution.y, 1.0);
    uv *= -1.0; // flip screen

    const int LIGHT_NUM = 2;
    Light lights[LIGHT_NUM];

    vec2 mouse_uv = 2.0 * mouse.xy - 1.0;
    lights[0] = Light(vec3(5.0 * mouse_uv.x, 10.0 + 5.0 * mouse_uv.y, -5.0), 300.0);
    lights[1] = Light(vec3(5.0 * sin(time), 10.0, -5.0 - cos(time)), 500.0);

    spheres[0] = Sphere(vec3(5.0, -4.0, -12.0), 4.0,
                        Surface(MIRROR, BLUE / 2.0, 0.9));
    spheres[1] = Sphere(vec3(-4.0, 0.0, -8.0), 2.0,
                        Surface(MATTE, (RED + GREEN) / 2.0, 1.0));
    spheres[2] = Sphere(vec3(1.0, 5.0, -10.0), 1.5,
                        Surface(MIRROR, GREEN / 2.0, 0.5));

    planes[0] = Plane(vec3(0.0, -10.0, 0.0), vec3(0.0, 1.0, 0.0),
                      Surface(MATTE, WHITE, 1.0));
    planes[1] = Plane(vec3(0.0, 15.0, 0.0), vec3(0.0, -1.0, 0.0),
                      Surface(MATTE, WHITE, 1.0));
    planes[2] = Plane(vec3(0.0, 0.0, -20.0), normalize(vec3(1.0, 0.0, 2.0)),
                      Surface(MATTE, (2.0 * BLUE +  WHITE) / 3.0, 1.0));
    planes[3] = Plane(vec3(0.0, 0.0, -20.0), normalize(vec3(-1.0, 0.0, 2.0)),
                      Surface(MATTE, (2.0 * RED + WHITE) / 3.0, 1.0));

    vec3 v0 = vec3(-2.0, -3.0, -7.0);
    vec3 v1 = vec3(-1.0, 3.0, -9.0);
    vec3 v2 = vec3(3.0, -2.0, -8.0);
    vec3 v3 = vec3(1.0, 1.0, -6.0);

    mat3 rotmat = mat3( cos(time), 0, sin(time),
                                0, 1,         0,
                       -sin(time), 0, cos(time));
    vec3 v_center = (v0 + v1 + v2 + v3) / 4.0;
    v0 = rotmat * (v0 - v_center) + v_center;
    v1 = rotmat * (v1 - v_center) + v_center;
    v2 = rotmat * (v2 - v_center) + v_center;
    v3 = rotmat * (v3 - v_center) + v_center;

    triangles[0] = Triangle(v0, v1, v2,
                            Surface(MIRROR, WHITE / 2.0, 0.9));
    triangles[1] = Triangle(v0, v3, v1,
                            Surface(MIRROR, RED / 2.0, 0.9));
    triangles[2] = Triangle(v0, v2, v3,
                            Surface(MIRROR, NO_COLOR, 0.9));
    triangles[3] = Triangle(v2, v1, v3,
                            Surface(MIRROR, BLUE / 2.0, 0.9));

    vec3 origin = VZ; // vec3(2.0 * cos(time), 0.0, 0.0);
    const float FILM_DIST = 1.0;
    Ray ray = Ray(origin, -normalize(vec3(uv, FILM_DIST)));

    RGB color = NO_COLOR;
    for (int i = 0; i < LIGHT_NUM; i++)
        color += shade(ray, lights[i]);

    gl_FragColor = RGBA(color, 1.0);
}
