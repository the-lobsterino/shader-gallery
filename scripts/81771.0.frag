#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat3 triangle_mat = mat3(vec3(.50, .00, .00),
			 vec3(0.00, 0.00, -1.0), 
			 vec3(0.00, 1.0, 0.00));
mat3 triangle_mat2 = mat3(vec3(.10, .50, .00),
			 vec3(0.00, 0.00, -1.0), 
			 vec3(0.00, 1.0, 0.00));


float sdTriPrism(vec3 p, vec2 h)
{
  vec3 q = abs(p);
	
  return max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5;
}

float calculate_displacement(in vec3 p, in vec2 off, in vec2 scale)
{
    float scale_displacement = 0.0;
    vec2 offeset = off * time * .5;
    float displacement = (sin(scale.x * (p.x + offeset.x)) + sin(scale.y * (p.y + offeset.y))) * 0.4 - 0.4;
    return displacement;
}

float opRep(in vec3 p, in vec2 c)
{
    float displacement = calculate_displacement(p, vec2(1.2, 3.0), vec2(2.0,1.0))+calculate_displacement(p, vec2(2.2, 1.0), vec2(1.0, 2.0));
	vec3 p_disp = p + vec3(0.5,0.2,1.0)*displacement;
    vec3 q = vec3(mod(p_disp.xy+0.5*c,c)-0.5*c, p_disp.z);
    return min(sdTriPrism(q * triangle_mat, vec2(0.2, 1.0)),
	    sdTriPrism(q * triangle_mat2, vec2(0.2, 1.0)));
}

vec2 ray_march(in vec3 ro, in vec3 rd)
{
    float total_distance_traveled = 0.0;
    const int NUMBER_OF_STEPS = 32;
    const float MINIMUM_HIT_DISTANCE = 0.01;
    const float MAXIMUM_TRACE_DISTANCE = 1000000000.0;

    for (int i = 0; i < NUMBER_OF_STEPS; ++i)
    {
        vec3 current_position = ro + total_distance_traveled * rd;

        float distance_to_closest = opRep(current_position,vec2(0.125));
	    

        if (distance_to_closest < MINIMUM_HIT_DISTANCE) 
        {
	    float ao = 1.0 - float(i) / (float(NUMBER_OF_STEPS) - 1.0);
            return vec2(total_distance_traveled, ao);
        }

        if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE)
        {
            break;
        }
        total_distance_traveled += distance_to_closest;
    }
    return vec2(0.0);
}

void main( void ) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);

    vec3 camera_position = vec3(-2.0, 1.0, -5.0);
    vec3 ro = camera_position;
    vec3 rd = vec3(uv, 1.0);

    vec2 ray_result = ray_march(ro, rd);
    vec3 shaded_color = (vec3(0.0, 0.3, 0.5) + vec3(0.55, 0.2, 0.0) * clamp(1.0-(ray_result.x * 14.0 - 89.5),0.0,0.9)) * ray_result.y;

    vec4 o_color = vec4(shaded_color, 1.0);

    gl_FragColor = o_color;

}