#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
	
float random2D(vec2 st) { 
    return fract(sin(dot(st.xy, vec2(1348.98,1.33)))* 235456.5453123);
}

float random2D(vec2 st,vec2 seed) { 
    return fract(sin(dot(st.xy, seed))* 235456.5453123);
}

float circle(vec2 p,vec2 center,float rad)
{
	return 1.0-smoothstep(rad*0.8,rad*1.01,distance(p,center));	
}

#define divide(what, part) floor(what * part) / part
void main( void ) {

	vec2 uv = gl_FragCoord.xy;
	
	
	float c = circle(uv,mouse*resolution, 10.0)*10.0;
	
	vec4 back = texture2D(backbuffer,gl_FragCoord.xy/resolution);
	if(back.r <= 3./256. && back.r > 0.) back.r = 1.;
	vec4 color = max(vec4(c),back-1./256.);
	
	color.b = .5-.5*cos(back.r*30.)*cos(back.r*30.);
	color.g = .5-.5*cos(back.r*50.)*cos(back.r*50.);
	
	gl_FragColor = vec4(color);
}