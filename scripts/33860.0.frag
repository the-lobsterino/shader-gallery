#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float halfpi = asin(1.0);
float pixel;

float circle(vec2 uv, vec2 pos, float d){
	// Modified to add anti-aliasing.
	return 1.0 - smoothstep(d, d + pixel * 1.5, length(uv - pos));
}

void main( void ) {

	pixel = 1.0 / resolution.y;
	
	vec2 aspect = vec2(resolution.x/resolution.y,1.);

	vec2 uv = 0.5 + ( gl_FragCoord.xy / resolution.xy -0.5 )*aspect;
	
	//vec2 mouse = 0.5 + (mouse-0.5)*aspect;
	
	float t = 0.01;
	t = time*t+5.0*sin(time*4.0*t);
	vec2 ab = vec2( sin(t), cos(t) )/length(mouse-0.5);
	vec2 m = sin( vec2( ab.x * t + halfpi, ab.y * t + halfpi ) )*aspect*0.5+0.5;

	float N = 8.0;
	vec2 pos1 = floor(uv * N) * (1.0/N) + (0.5/N);
	
	vec2 d1=vec2(0);
	
	if (distance(m, pos1) < 0.07) {
		d1 = (m - pos1) / 0.7;
	} else {
		float w1 = atan(m.x-pos1.x, m.y-pos1.y);
		d1 = vec2(sin(w1), cos(w1));
	}
	
	float layer1 = circle(uv, pos1, 0.1) - circle(uv, pos1, 0.09);
	layer1 += sin( circle(uv, pos1 + d1*0.07, 0.015) );
	
	gl_FragColor = vec4(layer1);

	
	gl_FragColor.a = 1.0;

}