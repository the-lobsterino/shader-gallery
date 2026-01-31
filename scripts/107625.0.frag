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
    float r = pow( pow(p.x*p.x,4.0) + pow(p.y*p.y,4.0), 1.0/57. );
    
    // index texture by (animated inverse) radius and angle
    vec2 uv = vec2( 1.0/r + 0.2*time, a );

    // pattern: cosines
    float f = cos(12.0*uv.x)*cos(6.0*uv.y);

    // color fetch: palette
    vec3 col = 0.5 + 0.5*sin( 3.1416*f + vec3(0.0,0.5,1.0) );
    
    // lighting: darken at the center    
    col = col*r;
    
    // output: pixel color
    gl_FragColor = vec4( col, 1.0 );
}