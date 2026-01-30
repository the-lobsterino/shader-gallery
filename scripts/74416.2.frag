#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float scene_distance(vec3 p)
{
    float x = p.x, y = p.z, z = p.y;
    return z - sin(x) + cos(y);
}

vec3 normal(vec3 p)
{
    const vec3 small_step = vec3(.0001, 0, 0);

    float gradient_x = scene_distance(p + small_step.xyy) - scene_distance(p - small_step.xyy);
    float gradient_y = scene_distance(p + small_step.yxy) - scene_distance(p - small_step.yxy);
    float gradient_z = scene_distance(p + small_step.yyx) - scene_distance(p - small_step.yyx);

    return normalize(vec3(gradient_x, gradient_y, gradient_z));
}

vec3 lighting(vec3 d){
    return 2.0/(exp(d) + exp(-d));
}

const int MAX_STEPS = 32;
const float MIN_DISTANCE = 0.001;
const float MAX_DISTANCE = 1000.0;
vec3 ray_march(vec3 camera, vec3 point, vec3 light)
{
    float total_distance_traveled = .0;

    for (int i = 0; i < MAX_STEPS; ++i)
    {
        vec3 pos = camera + total_distance_traveled * point;

        float d = scene_distance(pos);

	if (d < MIN_DISTANCE){
	    vec3 distance_to_light = (pos - light);
	    const float b = .1;
	    vec3 l = normalize(distance_to_light) * 2.0/(exp(distance_to_light * b)+exp(-distance_to_light * b));
            return vec3(1.0) * max(0.03, dot(normal(pos), l));
	}
	if(total_distance_traveled > MAX_DISTANCE) break;
	    
        total_distance_traveled += d;
    }
    return vec3(0.0);
}

void main() {
    vec2 position = (gl_FragCoord.xy - resolution * .5) / resolution.y + (mouse - 0.5);

    vec3 camera_position = vec3(0.0, 0.0, -5.0);
    vec3 light_position = vec3(6.0, -10.0, 4.0);
	
    gl_FragColor = vec4(ray_march(camera_position, vec3(position, 1.0),light_position), 1.0);
}