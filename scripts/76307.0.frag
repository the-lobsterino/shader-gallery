#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv-= vec2(0.5,0.5);
	uv.x*= resolution.x/resolution.y;
	
	vec2 s = vec2(1.0,1.0);
	
	float sl = sin(dot(normalize(uv),s)*3.14)*1.0;
	
	
	float l = length(uv) + sin(dot(normalize(uv),s)*3.14+time)*0.05;
	
	
	float d = 0.8;
	float range = 0.01+(sin(l*50.0-time*19.0)+1.0)*0.4;
	
	l = smoothstep(d-range,d,l);
	//l= sin(l*0.8);
	
	float c=1.0-l;
	
	vec4 result = vec4(c,c,c,10.0);

	gl_FragColor = result;

}