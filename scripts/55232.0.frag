/*
 * Original shader from: https://www.shadertoy.com/view/XtyfDc
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy globals
float iTime = time;
vec3  iResolution = vec3(resolution, 0.0);
// --------[ Original ShaderToy begins here ]---------- //
// variant of https://shadertoy.com/view/4lGfDc

#define S(r)  smoothstep(  9./R.y, 0., abs( U.x -r ) -.1 )
void mainImage(inout vec4 O, vec2 u) {
    vec2 R = iResolution.xy,
         U = u+u - R;
    U =  length(U+U)/R.y    /* .955 = 3/pi  1.05 = pi/3 */
         *cos( ( mod( .955*atan(U.y,U.x) - iTime ,2.) - .92 ) *1.05 -vec2(0,1.57));
    U.x+U.y < 1.85 ? O += mix( .5* S(.5), S(.7), .5+.5*U.y ) : O ;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
	float s = 16.0*sin(time*0.9);
	
	mainImage(gl_FragColor, ceil(gl_FragCoord.xy / s) * s);
			
	gl_FragColor.a = 1.0;
}