#extension GL_OES_standard_derivatives : disable


precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	float s = 0.0, v = 0.0;
	vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.;
    float time = (time-2.0)*58.0;
	vec3 col = vec3(0);
    vec3 init = vec3(sin(time * .0032)*.3, .35 - cos(time * .005)*.3, time * 0.002);
	for (int r = 0; r < 100; r++) 
	{
		vec3 p = init + s * vec3(uv, 0.05);
		p.z = fract(p.z);
        // Thanks to Kali's little chaotic loop...
		for (int i=0; i < 10; i++)	p = abs(p * 2.04) / dot(p, p) - .9;
		v += pow(dot(p, p), .7) * .06;
		col +=  vec3(v * 0.2+.4, 12.-s*2., .1 + v * 1.) * v * 0.00003;
		s += .025;
	}
	gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
	}