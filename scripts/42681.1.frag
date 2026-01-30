#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 mouse;
uniform vec2 resolution;

#define center(coord) (coord - resolution.xy * 0.5) / max(resolution.x, resolution.y)

void main( void )
{
    vec2 uv = center(gl_FragCoord.xy),
	 m = center(mouse.xy);
    
    float cDist = length(uv) * 5.0,
          mDist = length(m - uv) * 10.0,
          color = cDist * cDist * mDist;

    gl_FragColor = vec4(color > 1.0, 1, 1, 1);
}