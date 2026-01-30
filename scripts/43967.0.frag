#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	// gl_FragCoord.xy - position of the pixel on the screen, for example X: (0 - 1280), Y: (0 - 960)
	// resolution.xy - actual screen resolution, for example (1280, 960)
	
	// 1.
	// normalizedCoord now has values in the [0, 1] range in both X and Y directions
	vec2 normalizedCoord = ( gl_FragCoord.xy / resolution.xy );
	// Let's put this on the screen!
	gl_FragColor.xy = 1.0-normalizedCoord;
	
	
	// 2.
	// Maybe visualize the mouse
	// Also try gl_FragColor.xy = mouse;
	// float distanceToMouse = length(gl_FragCoord.xy - mouse * resolution.xy);
	// gl_FragColor.z = 1.0 - smoothstep(0., 1., pow(distanceToMouse * 0.06, 5.0));
}