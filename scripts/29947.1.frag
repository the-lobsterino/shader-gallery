#ifdef GL_ES
precision lowp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main()
{       
        vec2 pozicija = gl_FragCoord.xy / resolution.xy;
	gl_FragColor.r = 0.0;
	gl_FragColor.g = 1.0;
	gl_FragColor.b = 1.0;
	gl_FragColor.a = 0.0;
}
