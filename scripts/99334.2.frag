#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float noise(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main( void )
{
    vec2 div = vec2( 6, 6.*resolution.y/resolution.x );
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 xy = div*uv;
    vec2 v = fract( xy );
    vec2 g = floor( xy );
    float c = mod(g.x + g.y, 2.0 );
    float speed = sin(time/30.0) + 2.0;
    float timeA = float(int(speed*time)) / 10000.0;
    float timeB = float(int(speed*time + 0.5)) / 10000.0;
    float t = 0.;
    if (length(v - vec2(0.5)) < 0.25)
    {
        if (c > 0.5)
            t = timeA;
        else
            t = timeB;
    }
    else
    {
        if (c > 0.5)
            t = timeB;
        else
            t = timeA;
    }
    float n = noise(gl_FragCoord.xy * t);
    gl_FragColor = vec4(mix(vec3(0), vec3(1), n), 1.0);
}
