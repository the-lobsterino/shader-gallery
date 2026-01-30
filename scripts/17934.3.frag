//what the fuck is this, i'm on drugs

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

varying vec2 surfacePosition;

float rand(vec2 co){
	return fract(sin(dot(co.xy, vec2(12.9898,78.233)))*43758.5453);
}

void main( void ) {

	//vec2 position = -1.0 + 2.0 * ( gl_FragCoord.xy / resolution.xy );
	//position.x *= resolution.x / resolution.y;
	#define surfacePosition surfacePosition*pow(cos(time*0.1), 1e0)
	vec2 p, position = surfacePosition*3.0;
	p = position;
	float time = time + length(p)*100.;
	
	float d = 1.0;
	for (int i = 0; i < 512; i++) {
		float t = mod(time+float(i), 8.0*cos(time));
		vec2 p = -1.0+2.0*vec2(rand(vec2(i)), rand(vec2(i,i*2)));
		if (t < 1.0) {
			p.x += t*0.1;
		} else if (t < 2.0) {
			p.x += 0.1;
			p.y += (t-1.0)*0.1;
		}
		d = min(d, distance(p, position)+clamp(1.0-1.0*distance(t,3.0),0.0,1.0));
	}

	gl_FragColor = vec4(1.0-smoothstep(0.0,0.01,d) ) + texture2D(backbuffer, gl_FragCoord.xy / resolution.xy)*0.9;
}