// Kirby
// By: Brandon Fogerty
// bfogerty at gmail dot com
// xdpixel.com

#ifdef GL_ES
precision mediump float;
#endif

//#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pixelImpl(vec2 grid, vec2 resolution, vec2 c)
{
    c.y = resolution.y - c.y - 1.0;
    float x = step(grid.x, c.x) - step(grid.x, c.x - 1.0);
    float y = step(grid.y, c.y) - step(grid.y, c.y - 1.0);

    return x * y;
}

#define pixel(x,y,color) color * pixelImpl(grid, res, vec2(x, y));

vec3 layer0(vec2 uv)
{
    vec2 res = vec2(10.0, 10.0);
    vec2 grid = floor(uv * res);

    vec3 fc = vec3( 0.0 );
    float oy = 9.0 - grid.y;
    float ox = grid.x * step(fract((grid.x+oy)/2.0), 0.0);
	
    fc += pixel(ox, oy, vec3(1.0, 0.0, 0.0));

    return fc;
}
void main( void ) 
{
    vec2 uv = ( gl_FragCoord.xy / resolution.xy );
    uv.x *= resolution.x / resolution.y;
    
    vec3 finalColor = vec3( 0.0 );
    finalColor = layer0(uv + vec2(1.0, 0.0));

    gl_FragColor = vec4( finalColor, 1.0 );
}
