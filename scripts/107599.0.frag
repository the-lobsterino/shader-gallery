#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{
    // input: pixel coordinates
    vec2 p = (-resolution.xy + 2.0 * gl_FragCoord.xy) / resolution.y;

    // angle of each pixel to the center of the screen
    float a = atan(p.y,p.x);
    
    // modified distance metric
    float r = abs(p.x*p.x*p.x) + abs(p.y*p.y*p.y);
    
    // index texture by (animated inverse) radius and angle
    vec2 uv = vec2( 0.5/r + 0.4*time, a );

    // pattern: cosines
    float f = cos(3.0*uv.x)*cos(6.0*uv.y);

    // color fetch: palette
    vec3 col = 0.5 + 0.5*cos( 3.1416*f + vec3(0.6,0.2,0.0) );
    
    // lighting: darken at the center    
    col = col*r*20.;
    
    // output: pixel color
    gl_FragColor = vec4( col, 1.0 );
}