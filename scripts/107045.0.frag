// WonkyKIM
// https://vimeo.com/WonkyKIM
// https://www.facebook.com/WonkyKIM

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141592;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 2.0 - 1.0;
	p.x *= resolution.x / resolution.y;
		
	float h = atan(p.y, p.x);
	h = h/PI * 0.5 + 0.5;
	h = sin(h * PI * 4.);
	
	float d = length(p) - 0.5;
	//d = 1.0 - d;
	
	float tw = sin((atan(p.y, p.x)/PI*0.5+0.5)*PI*32.0 + d*PI*12.0 + time*-30.0);
	
	
	//float c = d+h*0.05;
	//c = smoothstep( 0.01, 0.0, c);

	h = clamp(h, 0.1, 0.9);
	float c = d+h*0.1;

	c = smoothstep( 0.02, 0.0, c);
	
	
	vec3 c1 = vec3(h*0.5,0,0);
	vec3 c2 = vec3(0,d,0);
	vec3 c3 = vec3(0,0,tw);
	
	//gl_FragColor = vec4( c1+c2+c3, 1.0 );
	gl_FragColor = vec4(c,c,c, 1.0);

}