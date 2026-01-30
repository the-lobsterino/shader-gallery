#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main(void) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * aspect;
	
	#define stepped(x, n) (ceil(x*n)/n)
	position = stepped(position, 64.);
	//vec2 mouse = stepped(mouse, 64.);
	
	vec4 color = texture2D(backbuffer, position / aspect);
	// http://glslsandbox.com/
	if(color.a > 0.5){
		color.rgb -=  2./256.;
		if(length(color.rgb) < 0.1){
			color.a = 0.25;
		}
	}else if(color.a > 0.1){
		color.rgb +=  1./256.;
		if(length(color.rgb) > sqrt(2.9)){
			color.a = 0.75;
		}
	}
	
	
	
	if(distance(position, mouse * aspect) < 0.05) color = vec4(1.0);

	gl_FragColor = color;
	
	gl_FragColor.g = .5+.125*sin(10.*gl_FragColor.r);
	gl_FragColor.b = .5-.125*sin(4.*gl_FragColor.r+gl_FragColor.a);
}

// humans should start farms under the oceans before we try to put feet on mars. 
//   ... or at least prove we can get worms living on the moon/mars first. 