#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( 2.0 * gl_FragCoord.xy / resolution.xy - 1.0) * 2.0;
	uv.y *= 0.5;
	float d1 = abs (length (uv - vec2 (0.0, -0.9)) - 0.5);
	float d2 = abs (length (uv - vec2 (-1.95, 0.7)) - 1.9);
	float d3 = abs (length (uv - vec2 (1.95, 0.7)) - 1.9);
	vec3 color = (d1 < d2 && d1 < d3) ? vec3 (0.9) : d2 < d3 ? vec3 (0.4, 0.4, 1.0) : vec3 (1.0, 0.4, 0.4);
	color = mix (color, vec3 (0.1, 0.1, 0.2) * (uv.y + 0.5), smoothstep (0.015 - 0.005 * uv.y, 0.035, max (min (d1, min (d2, d3)), abs (uv.y) - 0.65)));
	gl_FragColor = vec4 (color, 1.0);
	
	
	vec3 c;
	float l,z=time/16.;
	
	for(int i=0;i<3;i++) {
		
		vec2 uv,p=gl_FragCoord.xy/resolution;
		uv=p;
		p.x-=.5;
		p.y-=1.;
		p.x*=resolution.x/resolution.y;
		z+=.07;
		l=length(p*pow(abs(p*10.), vec2(cos(length(p)*3.+time*0.1))));
		uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z*2.));
		c[i]=.01/length(abs(mod(uv,1.)-.5));
	}
	gl_FragColor+=vec4(.15*c/l,0.);
}
