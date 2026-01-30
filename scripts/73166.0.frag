#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

float panzoom_pareidolia8bpp( vec2 sp, vec2 fc, vec2 sz, float t )
{
    float o = cos(t+t*sin(dot(sp,sp))+t*cos(dot(fc,fc))+cos(t));//+(t*t+(dot(sp*t,sp.yx*t)+(t+(fc.y*resolution.x+fc.x))+sz.x*sz.y)));
	
    o = ( ( t +o * dot(sz,sp)) );
	
    return o;
}

void main( void ) {

	float t = panzoom_pareidolia8bpp( (gl_FragCoord.xy)*surfaceSize, (surfacePosition.yx) * resolution, mouse, 1.0 );
	
	float o = panzoom_pareidolia8bpp( surfacePosition * resolution, ( gl_FragCoord.xy )*surfaceSize, surfaceSize, t );

	gl_FragColor = vec4( vec3( fract(time+o) ), 1.0 );

}
