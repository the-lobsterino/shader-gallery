/*
 * Original shader from: https://www.shadertoy.com/view/tdXyzB
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
// analytical raytracing speres with phong shading and reflections
// this is written for clarity, not for performance.

const float INFINITY = 1e20;
const float PI = 3.1415;

// sphere locations. radius is equal to z
const int SPHERE_COUNT = 10;
vec4 spheres[SPHERE_COUNT];

// ambient, diffuse, specular, RGB
const vec3 AMBIENT = vec3(0.001);
const vec3 DIFFUSE = vec3(0.5);
const vec3 SPECULAR = vec3(1.);
const float SHININESS = 50.;
const vec3 REFLECT = vec3(1.);

// light, RGB. light is an isentropic light as I'm lazy.
const vec3 LIGHT = vec3(1.0, 1.0, 1.0);
const vec3 LIGHT_DIR = normalize(vec3(0.0, -1.0, -0.5)); 

// calculate analytic collision with the geometry.
vec3 collide(vec3 origin, vec3 dir, out float depth) {
    depth = INFINITY;
    vec3 n = vec3(0.);

    // try colliding with the spheres, keeping the lowest depth entry
    for (int i = 0; i < SPHERE_COUNT; i++) {
        // math
        vec3 s = spheres[i].xyz - origin;
        float t = dot(dir, s);
        vec3 d = (dir * t - s);
        // early collision test
        if (length(d) > spheres[i].w) {
            continue;
        }
        // early-z. Due to properties of spheres sorting them by center depth is enough
        if (t > depth || t < 0.) {
            continue;   
        }
        
        // more math
        vec3 r = d - dir * sqrt(spheres[i].w * spheres[i].w - dot(d, d));
        
        // surface normal and final depth
        n = normalize(r);
        depth = length(s + r);
    }
    return n;
}

vec3 light_ray(vec3 orig, vec3 dir, out vec3 hit, out vec3 hit_norm) {
    // hit something
    float depth;
    hit_norm = collide(orig, dir, depth);
    hit = orig + depth * dir;

    // shadow
    float shadow_depth;
    collide(hit, -LIGHT_DIR, shadow_depth);
    
    // lighting
    vec3 light = vec3(0.0);
    if (depth < 1e9) {
        light += AMBIENT;
        if (shadow_depth > 1e9) {
            light += DIFFUSE * dot(-LIGHT_DIR, hit_norm);
            light += SPECULAR * pow(max(0.0, dot(reflect(-LIGHT_DIR, hit_norm), dir)), SHININESS);
        }
    }
    return light * LIGHT;
}

vec3 camera;
vec3 camera_dir;
vec3 camera_up;
const float AR = 1.4;

// this part is identical for every pixel
void setup() {
    camera = vec3(5.0 * cos(iTime), 5.0 * sin(iTime), 1.);
    camera_dir = normalize(-camera);
    camera_up = vec3(0., 0., 1.);
}

vec3 calcpixel(vec2 uv) {
    // setup ray dir, norm vector >
    vec3 camera_x = normalize(cross(camera_dir, camera_up));
    // setup ray dir, norm vector ^
    vec3 camera_y = normalize(cross(camera_x, camera_dir));
    // final ray dir
    vec3 ray_dir = normalize(camera_dir * AR + camera_x * uv.x + camera_y * uv.y);
    
    vec3 hit, hit_norm;
    vec3 light = light_ray(camera, ray_dir, hit, hit_norm);
    
    vec3 reflect_dir = reflect(ray_dir, hit_norm);
    vec3 reflect_hit, reflect_norm;
    vec3 reflection = light_ray(hit, reflect_dir, reflect_hit, reflect_norm);

    // assemble
    return light + reflection * REFLECT;
}

const int AA = 2;

void setup_spheres() {
    spheres[0] = vec4(0.0, 0.0, -100.0, 100.0);
    spheres[1] = vec4(0.0, 0.0, 0.8, 0.8);
    spheres[2] = vec4(1.0, 1.0, .4+abs(sin(time+1.2)), 0.4);
    spheres[3] = vec4(1.0, -1.0, .4+abs(sin(time+.8)), 0.4);
    spheres[4] = vec4(-1.0, 1.0, 0.4 + abs(sin(time+.4)), 0.4);
    spheres[5] = vec4(-1.0 , -1.0, 0.4 + abs(sin(time)), 0.4);
    spheres[6] = vec4(1.5, 0.0, 0.1, 0.1);
    spheres[7] = vec4(0.0, 1.5, 0.1, 0.1);
    spheres[8] = vec4(-1.5, 0.0, 0.1, 0.1);
    spheres[9] = vec4(0.0, -1.5, 0.1, 0.1);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    setup_spheres();
    // setup scene parameters
    setup();

    vec3 color = vec3(0.);
    for (int i = 0; i < AA; i++) {
        for (int j = 0; j < AA; j++) {
            // setup screen coord system. up = (0, 1), down = (0, -1), right = (AR, 0), left = (-AR, 0)
            vec2 coord = fragCoord + vec2(i, j) / float(AA);
            vec2 uv = (coord - iResolution.xy * 0.5) / iResolution.y;

            color += calcpixel(uv);
        }
    }
    color /= float(AA * AA);
    
    // gamma correct and write to output
    fragColor = vec4(pow(color, vec3(1. / 2.2)), 1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}