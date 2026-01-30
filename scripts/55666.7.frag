#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float square(vec2 p){
	return abs(p.x) + abs(p.y);
}
mat2 r2(float w){
	vec2 cs = vec2(cos(w), sin(w));
	return mat2(cs.xy, vec2(-1,1)*cs.yx);
}


void main( void ) {

	vec2 p = 1.4*(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	float time = time*300. - pow(abs(p.x)*1.5+abs(p.y), 3.0)*sin(p.x)*sin(p.y);
	float d = square(p);
	gl_FragColor = vec4(1);
	#define W {	p *= r2(0.1+time-dot(p,p)*1234.);p -= (1./resolution.x)*(cos(time/3.-dot(p,p)/5.)*0.2+0.)*cos(time*10.+length(p))*sign(p)*654321.7890;	d = mix(d, square(p), 0.125);   	gl_FragColor = mix(gl_FragColor, vec4(vec3(smoothstep(0.5,0.51,d)), 1.0), 0.1);	}
	W W W W W W W W W W W W W W W W 
	gl_FragColor.rgb += vec3(0,.0,1.);
	
	//vec3 color = vec3(smoothstep(0.5,0.51,d)); 
	float r = 3.+0.04*length(p);
	vec2 w = 2.*normalize(p);
	gl_FragColor = min(gl_FragColor, 1./256. + texture2D(backbuffer, gl_FragCoord.xy/resolution));
	gl_FragColor = min(gl_FragColor, 4./256. + texture2D(backbuffer, (w+r*vec2(1,0)+gl_FragCoord.xy)/resolution));
	gl_FragColor = min(gl_FragColor, 4./256. + texture2D(backbuffer, (w+r*vec2(-1,0)+gl_FragCoord.xy)/resolution));
	gl_FragColor = min(gl_FragColor, 4./256. + texture2D(backbuffer, (w+r*vec2(-1,0).yx+gl_FragCoord.xy)/resolution));
	gl_FragColor = min(gl_FragColor, 4./256. + texture2D(backbuffer, (w+r*vec2(1,0).yx+gl_FragCoord.xy)/resolution));
}