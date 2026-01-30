#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 scaleFragCoord(vec2 coord)
{
    return (coord*2. - resolution.xy) / min(resolution.x, resolution.y);
}
	
vec3 drawMandelbrot(vec2 c)
{
    vec2 z = vec2(0.);
    for (int i = 0; i < 1000; ++i) {
        z = vec2(z.x*z.x - z.y*z.y, z.x*z.y*2.) + c;
        if (length(z) >= 2.) return vec3(rand(c*1.*time), rand(c*2.*time), rand(c*3.*time))*(1.-10./float(i));
    }
    return vec3(0.);
}

void main( void )
{
    vec2 c = scaleFragCoord(gl_FragCoord.xy);
    vec3 locColor = drawMandelbrot( 
		c);
    	gl_FragColor =vec4(locColor, 1.0);
}