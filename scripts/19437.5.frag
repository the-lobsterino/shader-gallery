#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265
#define NEAR 0.1
#define FAR 100.0

const float fov = PI / 3.0;
vec3 camPos = vec3(0.0, 0, -0.5);
vec3 camUp = vec3(0.0, 1.0, 0.0);
vec3 camLook = vec3(sin(time * 0.25), 0.0, 1.0);
vec3 camRight = cross(camUp, camLook);

vec3 getRay (vec2 uv) {
    return normalize(camPos+camLook + (uv.x*camRight + uv.y*camUp) * tan(fov/2.0));
}

float dist (vec3 p) {
    float sphere = length(p - vec3(0.0, 2.0, 16.0)) - (6.0 * sin(p.x+p.y*0.1*p.z+time*4.0));
    float plane = p.y + (4.0 - sin(p.x * 0.25)*4.0*sin(time));
    float cilinder = length(p - vec3(p.x, 5.0, 64.0)) - 4.0;
    float cube = max(abs(p.x-16.0)-4.0+sin(time*8.0), max(abs(p.y-2.0)-5.0+sin(time*4.0), abs(p.z-25.0)-2.0));
    return min(min(sphere, cube), min(plane, cilinder));
}

float depth (vec3 p) {
    return (length(p) - 1.0) / (FAR - NEAR);
}

float shadow (vec3 p) {
    vec3 lightPos = vec3(8.0, 8.0, 10.0);
     for (float t = 0.1; t < 1.0; t += 0.025) {
	    vec3 s = t * lightPos + (1.0-t)*p;
           if (dist(s) < 0.0) {
           return dist(s);
      }
    }
    return 1.0;
}

void main(void)
{
    vec3 finalColor = vec3(0.0);
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;
    vec3 ray = getRay(uv);
    
    for (float i = NEAR; i < FAR; i += 0.1) {
        vec3 pos = ray * i;
        if (dist(pos) < 0.0) {
         	finalColor = vec3(1.0 - depth(pos));
            if (shadow(pos) < 0.0)
                finalColor *= 0.25;
            break;
        }
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
}