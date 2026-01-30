#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 vUv;

float interpolate(float x, float min_x, float max_x) {
	return x * max_x + (1.5 - x) * min_x;
}

float normsin(float x) {
	return (sin(x) + 1.0) / 2.0;
}

void main( void ) {

	vec2 position = ( -gl_FragCoord.xy / resolution.xy ) + 0.5 / time;

	float color = 0.0;
	color += sin( position.x * -cos( time / 8.0 ) * 80.0 ) + cos( position.y * ( time / 15.0 ) * 10.0 );
	color += cos( position.y * cos( time / 10.0 ) * 40.0 ) + cos( position.x * -sin( time / 25.0 ) * 40.0 );
	float colorA = ( position.x * -tan( time / 5.0 ) * 10.0 ) + -cos( position.y * position.y*( time / 10.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;


	float vv = interpolate(color, position.y / 100.0, position.x);
	vv+=sin(sin(sin((position.x*3.14))));
	
	
	
	float v = normsin(sin(position.x*6.0)*2.0+(vv) *50.0 + time * 2.0);
	v+=0.25;

	vec2 o = gl_FragCoord.xy - resolution/2.0;
	o = vec2(length(o) / resolution.y - .3, atan(o.y,o.x));    
	vec4 s = 0.08*cos(1.5*vec4(0,1,2,3) + time + o.y + sin(o.y) * cos(time)),
	e = s.yzwx, 
	f = max(o.x-s,e-o.x);
	
	vec4 color1 = dot(clamp(f*resolution.y,0.,1.), 72.*(e-e)) * (s-.1) + f;
	


	float pr = step(colorA, float(color1.r));
	float pg = step(colorA, float(color1.g));
	float pb = step(colorA, float(color1.b));

	gl_FragColor = vec4( vec3( normsin(vv), vv/color, sin( time + color / 40.0 ) * pb ), 1.0 );

}