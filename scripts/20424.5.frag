#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	
	float t = 0.0;
	
	vec2 uv = 2.0 * (gl_FragCoord.xy / resolution.xy) - 1.0;
	uv.x *= resolution.x / resolution.y;
	
	t = step (-0.005,uv.x) - step (0.005,uv.x);
	t += step (-0.005,uv.y) - step (0.005,uv.y);
	
	vec2 p = surfacePosition;
	
	float eqx = p.x*4.;
	float eqy = p.y*4.;
	
	float eq = eqy - pow(sin(time+eqx)*3., eqx*5e-2);
	
	t += step (-0.005,eq+0.02) - step (0.005,eq-0.02);
		
	gl_FragColor = vec4(t, t, t, 0.7);
	
}