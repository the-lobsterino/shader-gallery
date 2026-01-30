#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float FOV = 1.0;
const int MAX_STEPS = 256;
const float MAX_DIST = 500.0;
const float EPSILON = 0.001;

vec2 map(vec3 p)
{
    float sphereDist = length(p) - 1.0;
    float sphereID = 1.0;
    vec2 sphere = vec2(sphereDist, sphereID);
    vec2 res = sphere;
    return res;
}

vec3 rayMarch(vec3 ro, vec3 rd)
{
    vec3 obj = vec3(0.0);
    for (int i = 0; i < MAX_STEPS; i++)
    {
        vec3 p = ro + obj.x * rd;
	vec3 hit = vec3(0.0, 0.0, 0.0);
        obj.x += hit.x;
        obj.y = hit.y;
        if (abs(hit.x) < EPSILON|| obj.x > MAX_DIST) break;
    }
    return obj;
}

vec3 render(in vec2 uv)
{
    vec3 c = vec3(0);
    vec3 ro = vec3(-3, 0, 0);
    vec3 rd = vec3(FOV, uv);
    
    vec3 obj = rayMarch(ro, rd);
    if (obj.x < MAX_DIST)
    c = vec3(1, 1, 1);
    return c;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );

	vec3 color = vec3(0.0);

	gl_FragColor = vec4(color, 1.0 );

}