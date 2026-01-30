#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


void main( void ) {
	vec2 position = gl_FragCoord.xy / resolution;
	vec2 pixel = 1. / resolution;

	if (length(position - mouse) < 2.*length(pixel)) {
 		gl_FragColor = vec4(.1);
	} else {
		float sum = 0.;
		for (float y = -1.; y < 2.; y++) {
			for (float x = -1.; x < 2.; x++) {
				sum += texture2D(backbuffer, fract(position + pixel * vec2(x, y))).a;
			}
		}
		vec4 me = texture2D(backbuffer, position);
		float age = sum / 9.;
		if (age < .99) {
			gl_FragColor = vec4(age + 0.1 * log(.0001 / age));
		} else {
			gl_FragColor = vec4(1.);
		}
		
		gl_FragColor.r = max(0., min(1., gl_FragColor.r));
		gl_FragColor.g = max(0., min(1., gl_FragColor.g));
		gl_FragColor.b = max(0., min(1., gl_FragColor.b));
		gl_FragColor.rgb += (0.98+vec3(.01,-.01,.01*cos(time/12.)))*(me-gl_FragColor).rgb;
	}
	
	gl_FragColor += (1.+cos(time))*0.01*fwidth(gl_FragColor);
}