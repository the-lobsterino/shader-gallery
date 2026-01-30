precision mediump float;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform sampler2D backbuffer;

// based on thing by Robert Schütze (trirop) 05.12.2015

void main(){
	vec3 p = vec3((gl_FragCoord.xy-resolution/sin(time/100.))/(resolution.y),mouse.x);
	vec2 p2 = vec2(gl_FragCoord.xy/resolution);
	
	for (float i = 0.; i < 23.; i++){
	   p = abs((abs(p)/dot(p, p)-1.) * sin(time/100.) * mouse.y);
	   if(length(p) > 1. && length(p) < 1.07) break;
	}
	
	
	//gl_FragColor.rgb = p;
	
	gl_FragColor = vec4(p, 1.0) + 0.9*texture2D(backbuffer, gl_FragCoord.xy/resolution);
	gl_FragColor.a = 1.0;
}