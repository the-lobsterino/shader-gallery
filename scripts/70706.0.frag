/*
Gay eye of Sauron

Remixed for comedian effect by DannyFromDenmark
Original from TIEDYE by Jonathan Proxy: http://glslsandbox.com/e#70560.0

*/


#ifdef GL_ES
precision highp float;
#endif

vec2 uv;

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec3 rainbow1(float h )
{
	h = fract(h);
	return vec3(smoothstep(0.3, 1.0, h) + smoothstep(0.5, 0.3, h), 
		    smoothstep(0.0, 0.3, h) * smoothstep(0.7, 0.4, h),
		    smoothstep(0.3, 0.7, h) * smoothstep(1.0, 0.8, h));
}

vec2 cln(vec2 v){	
	return vec2(log(length(uv * uv.x) - 0.003), atan(uv.y, uv.x)) / 6.283;
}

void main( void ) 
{
	uv = surfacePosition;//(gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
	uv = cln(uv);

	vec3 bg_color = mix(
		rainbow1(uv.x*3.0+(uv.y-0.25*time*4.)),
		vec3(1.0, 0.5, 1.0),
		0.25);
		
	vec3 fg_color = mix(
		rainbow1(uv.x+(uv.y*13.0)),
		vec3(1.0, 1.0, 1.0),
		0.25);
	
	gl_FragColor = vec4(bg_color*fg_color, 1.0);
}
