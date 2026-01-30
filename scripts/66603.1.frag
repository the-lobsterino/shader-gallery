// 040820N Light at the end of the tunnel

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
uniform sampler2D backbuffer;

#define MAX_ITERATION 120.
float mandelbrot(vec2 c)
{
	float count = 0.0;
	float t = time*.5 + length(c)*1234.567890 - resolution.x*gl_FragCoord.y - gl_FragCoord.x;
	
	vec2 z = c;
	for (float i = 0.0; i < MAX_ITERATION; i++)
	{
		z = vec2(z.x,  z.y) + c;
		c += vec2(.0125*sin(t), .05*cos(t));
		if (length(z) > 5.) break;
		
		count += 1.0;
	}

	float re = (length(z*count/MAX_ITERATION));
	// if (re <= 0.0) return 1.;
	return re;
}

void main( void ) {

	vec2 uv = surfacePosition;
	uv *= 2.;		
	float mb = mandelbrot(uv);
	gl_FragColor = vec4(vec3(mb), 1.0);
	
	vec2 spos = gl_FragCoord.xy/resolution;
	vec2 spos2 = mix(spos, vec2(0.5), 0.1);
	
	vec4 scol = texture2D(backbuffer, spos2);
	gl_FragColor = max(gl_FragColor, scol-1./256.);
	
	scol = texture2D(backbuffer, spos);
	gl_FragColor = scol + sign(gl_FragColor-scol)/256.;
}