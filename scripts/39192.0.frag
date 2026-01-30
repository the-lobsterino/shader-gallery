#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
//converted by batblaster

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float factor = 1.0;
vec3 color = vec3(0.2, 0.5, 1.0);

vec4 fn(vec2 uv,float t)
{
    float j = sin(uv.y * 3.14 + t * 5.0);
    float i = sin(uv.x * 15.0 - uv.y * 2.0 * 3.14 + t * 27.0);
    float n = -clamp(i, -0.2, 0.0) - 0.0 * clamp(j, -0.2, 0.0);
    
    return 3.5 * (vec4(color, 1.0) * n);
}

vec4 main2( vec2 fragCoord, float t )
{
    vec2 p = -1.0 + 2.0 * fragCoord.xy / resolution.xy;
    vec2 uv;
    
    float r = sqrt(dot(p, p*p*p));
    float a = atan(
        p.y * (0.27 + 0.1 * cos(t * 2.0 + p.y)),
        p.x * (0.27 + 0.1 * sin(t * 4.0 + p.x))
    ) + time;
    
    uv.x = time + 1.0 / (r + .01);
    uv.y = 0.9 * a / .31416;
    
    return mix(vec4(0.0), fn(uv,t) * r * r * 2.0, factor*2.0); //abs(mouse.x.x*2.0));
}

void main( void )
{
    vec4 col = main2( gl_FragCoord.xy, time );
    gl_FragColor = col;
	
}