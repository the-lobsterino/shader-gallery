precision highp float;
uniform vec2 resolution;
uniform float time;

float f(in vec2 p) {
    float r = sqrt(dot(p, p));
    float a = atan(p.y, p.x);
    float c = r - 1.0 + 0.5 * sin(3.0 * a + 2.0 * r * r + time);
    return c;
}

vec2 grad( in vec2 p )
{
    vec2 h = vec2( 0.01, 0.0 );
    return vec2( f(p+h.xy) - f(p-h.xy),
                 f(p+h.yx) - f(p-h.yx) )/(2.0*h.x);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = (uv * 2.0 - 1.0) * 2.0;
    p.x *= resolution.x / resolution.y;
    
    float v = f( p );
    vec2  g = grad( p );
    float de = abs(v)/length(g);
    float c = smoothstep( 0.0, 0.01, de );
    vec3 col = vec3(abs(v) + (1.0 - c));
    
    gl_FragColor = vec4(col, 1.0);
}