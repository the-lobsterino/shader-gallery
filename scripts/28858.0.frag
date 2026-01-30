#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// inspired by https://www.shadertoy.com/view/ll2GD3

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d+time*11.) );
}

void main()
{
    vec2 p = ( gl_FragCoord.xy / resolution.xy );
    vec3 col = pal( p.x, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.33,0.67) );
    gl_FragColor = vec4( mix( col.rgb, mix( vec3(0.0,0.0,0.0), vec3(1.0,1.0,1.0), p.y ), 1.0 - sin( pow( p.y, 1.5 ) * 3.141592 ) ), 1.0 );
}
