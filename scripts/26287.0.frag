#ifdef GL_ES
precision mediump float;
#endif

// Function grapher shader

/*
	This is, I think, my first from-scratch shader I've done.
	I'm beginning in GLSL and a bit familiar with C++.
	If you have some optimizing or improving tips, feel free to modify, I'll often watch glsl sandbox.
	Thanks! - AsuMagic
*/

	/* Uniform */
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

	/* Varying */
varying vec2 surfacePosition;

	/* User-defined constants */
const float thickness = 0.25;
const vec3 fxcolor = vec3(0.5, 1.45, 0.0);

	/* Functions */

float fx(vec2 pos)
{
	pos += sin(time*1.5+1.5*pos.x+1.5*pos.y);
	return 2.2*(1.6+pos.y - cos(pos.y*0.5) + sin(pos.x) * pos.y);
}



void main( void )
{
	vec2 pos = (gl_FragCoord.xy / resolution) + (surfacePosition * 3.);
	
	vec3 fx_graph = vec3(fx(pos)) * fxcolor;
	
	gl_FragColor.rgb = fx_graph;
	gl_FragColor.a =2.1;
}