#ifdef GL_ES
precision mediump float;
#endif


#extension GL_OES_standard_derivatives : enable

// Input vertex attributes (from vertex shader)
//in vec2 fragTexCoord;
//in vec4 fragColor;
 
// Input uniform values
uniform vec2 resolution;
 
// Output fragment color
//out vec4 finalColor;
 
const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 0.0001;
 
 
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
 
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
 
 
float sphereSDF(vec3 p)
{
    return length(p) - 1.0;
}
 
 
float sceneSDF(vec3 samplePoint)
{
    return sphereSDF(samplePoint);
}
 
 
float trace(vec3 eye, vec3 marchingDirection, float start, float end)
{
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = sceneSDF(eye + depth * marchingDirection);
        if (dist < EPSILON) {
            // We're inside the scene surface!
            return depth;
        }
        // Move along the view ray
        depth += dist;
 
        if (depth >= end) {
            // Gone too far; give up
            return end;
        }
    }
    return end;
}
 
 
vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord)
{
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}
 
 
void main()
{
    //vec3 dir = rayDirection(45.0, iResolution.xy, fragCoord);
    //float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);
 
    vec3 dir = rayDirection(60.0, resolution.xy, gl_FragCoord.xy);
    vec3 eye = vec3(0.0, 0.0, 5.0);
    float dist = trace(eye, dir, MIN_DIST, MAX_DIST);
 
    if (dist > MAX_DIST - EPSILON) {
        // Didn't hit anything
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.9);
        //discard;
        return;
    }
   
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}