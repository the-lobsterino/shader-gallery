#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2;
uniform vec2 resolution;

vec3 fl(vec2 uv) {
	float w = .03;
	return (abs(uv.x) > w && abs(uv.y) > w) ? vec3( 1.0, 1.0, 1.0) : vec3( .1, .2, .8);
}

vec3 light(vec3 c, float a) {
	a *= .33;
	return a > 0. ? mix(c, vec3(1.,1.,1.),a) : mix(c, vec3(0.,0.,0.), -a);
}

float mask(vec2 uv) {
	return step(uv.x, 0.5) * step(-0.2, uv.x)* step(abs(uv.y), 0.20);
}

float hash(float x) {
	return fract(sin(x)*1751.5453);
}

void main( void ) {
	
	vec2 uv = ( gl_FragCoord.xy - resolution.xy*.5) / resolution.x;
	uv.x += 0.15;

	vec2 dir=vec2(-50., 25.);
	vec3 bg = mix(vec3(0.3,0.4,.7), vec3(1.2,1.3,1.0), -uv.y*6.);
	for (float i=0.; i<300.; i+=1.){
		float s = hash(i+1356.);
		vec2 p = vec2(fract(hash(i)+time*s*.1)*2.-1., hash(i*10. + 1000.));
		bg+=smoothstep(s*0.004, 0., length(uv - p))*2.;
	}
	
	float ampl = sin(dot(dir,uv)*0.41 + time*3.1415);
	ampl += sin(dot(dir,uv)*0.21 - time*1.3) *.5;
	ampl += sin(dot(dir,uv)*0.11 + time*2.3) *.25;
	uv += ampl*.01;
	
	gl_FragColor = vec4(mix(bg, light(fl(uv),ampl), mask(uv)), 1.0 );
}