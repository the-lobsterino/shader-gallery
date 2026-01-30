#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circ(vec2 p, float r) {
	return length(p) - r;
}

float hash(vec2 p) {
	return fract(sin(p.x * 15.23 + p.y * 35.78) * 43758.49);
}

float smin( float a, float b, float k ) {
	float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p -= 0.5;
	p.x *= resolution.x / resolution.y;
	p *= 3.8;
	float col = 0.0;
	float phi = sin(time*0.1);
	float aphi = cos(time*0.1);
	float da = length(p) - 0.5;
	float db = 0.5;
	if(aphi < 0.5){
		db = (1.9+aphi)*length(p - vec2(2.0*phi+0.1, 0.0)) - 0.5;
	}
	float aa = smoothstep(0.1, 0.0, da);
	float ab = smoothstep(0.1, 0.0, db);
	float u = pow(smoothstep(-1.0, 1.0, ab - da), 0.2);
	float v = 1.0 - u;
	col = pow(smin(u, v, 0.1) + 0.5, 3.0);
	gl_FragColor = vec4( vec3( col ), 1.0 );

}