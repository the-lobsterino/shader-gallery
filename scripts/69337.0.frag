#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float map(vec2 p, float r, float t) {
    return distance(0.3*vec2(cos(3.0*t), sin(2.0*t)), p) - r;
}

vec2 direction = 2.0 * mouse.xy - 1.0;
void main( void )	
{
    const int l = 300;
    vec2 uv = (gl_FragCoord.xy-resolution.xy*.5)/resolution.y-direction;
    vec3 col = vec3(smoothstep(-0.005,0.2, -map(uv, 0.1,time)));
    
    for(int i=0; i<l; i++) { 
        col = max(col,
                 vec3(
                     smoothstep(-0.01, 0.0005, -map(uv, 0.007*float(l-i)/float(l), time-float(i)*0.002)))
                     *pow(float(l-i), 0.9)/float(l));
    }
    
    col *= vec3(1.0, 2.0, 10.0);
    gl_FragColor = vec4(col,1.0);
}
