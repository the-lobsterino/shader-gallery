#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );

}