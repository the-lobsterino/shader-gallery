precision highp float; 
uniform vec2 resolution;
uniform vec4 mouse;
uniform float time;
const float pi = 3.141592653589793;

vec2 hash(in vec2 p) {
    return fract(sin(mat2(15.34,35.78,75.64,153.32) * p) * 43758.21) * 2.0 - 1.0;
}

float noise( in vec2 p )
{
    const float K1 = 0.366; // (sqrt(3)-1)/2;
    const float K2 = 0.211; // (3-sqrt(3))/6;
    vec2 i = floor(p + (p.x+p.y)*K1);
    
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0 );
    vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot(n, vec3(70.0)) * 0.5 + 0.5;
}

void main() { 
    vec2 p = gl_FragCoord.xy / resolution;
    p = 2.0 * p - 1.0;
    p.x *= resolution.x / resolution.y;
    float col = noise(p * 2.0);
    gl_FragColor = vec4(vec3(col), 2.0);
}