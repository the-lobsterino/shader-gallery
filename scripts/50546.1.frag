#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution.xy; // 0. <> 1.
	uv = uv - 0.5; // .5 <> -.5
	uv /= vec2(resolution.y / resolution.x, 1.); // -1. <> 1.
	
	
	float c = 0.0;

	gl_FragColor = vec4(vec3(1., 1., 0.)*c, 1.0 );

}

/*

Here is great tutorial 2D GLSL : https://www.shadertoy.com/view/Md23DV
other tutorials : https://www.shadertoy.com/results?query=tag%3Dtutorial
book of shaders : https://thebookofshaders.com/
advanced stuff :
https://www.scratchapixel.com/index.php?redirect
http://iquilezles.org/www/index.htm
https://webgl2fundamentals.org/
https://learnopengl.com/


ENJOY SHADERS AND IN ADVANCE : HAPPY NEW YEAR !


*/