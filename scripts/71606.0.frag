
//Fragment Shader Source

precision mediump float;

uniform vec2 resolution;
uniform float time;

mat2 rotate(in float a)
{
    float s = sin(a), c = cos(a);
    return mat2(c, s, -s, c);
}

float circle(in vec2 p, in float r)
{
    return abs(length(p) - r);
}

float line(in vec2 p, in vec2 a, in vec2 b)
{
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float ezing(in float t)
{
    //return t;  
    //return t * t * (6.0 - 9.0 * t);
    //return sin(t * radians(90.0));
    //return 1.0 - pow(cos(t * radians(90.0)), 0.5);
    return pow(sin(t * radians(90.0)), 0.3);
}

float scene(in float t, in float w, in float s)
{
    return clamp(t - w, 0.0, s) / s;  
}

void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;
    p *= 1.5;
    float t = mod(time,6.0);
    float a, b;     
    vec3 line_col =  vec3(0.2, 0.4, 0.1); 
    vec3 col = vec3(0.05, 0.07, 0.15) * p.y * p.y;
    p *= rotate(radians(45.) * ezing(scene(t, 3.0, 1.0)));  
    a =  ezing(scene(t, 0.0, 1.0)); 
    col = mix(col, line_col, 1.0 - smoothstep(0.05, 0.052, line(p, vec2(-a, 0), vec2(a, 0))));  
    a =  ezing(scene(t, 2.0, 1.0)); 
    col = mix(col, line_col, 1.0 - smoothstep(0.05, 0.052, line(p, vec2(0, -a), vec2(0, a))));  
    a = ezing(scene(t, 1.0, 1.0));
    b = ezing(scene(t, 4.0, 2.0));
    col = mix(col, line_col, 1.0 - smoothstep(0.05, 0.052, circle(p - vec2( b, 0), 0.5 * a)));  
    col = mix(col, line_col, 1.0 - smoothstep(0.05, 0.052, circle(p - vec2(-b, 0), 0.5 * a)));  
    col = mix(col, line_col, 1.0 - smoothstep(0.05, 0.052, circle(p - vec2(0,  b), 0.5 * a)));  
    col = mix(col, line_col, 1.0 - smoothstep(0.05, 0.052, circle(p - vec2(0, -b), 0.5 * a)));    
    gl_FragColor = vec4(col, 1.0);
}