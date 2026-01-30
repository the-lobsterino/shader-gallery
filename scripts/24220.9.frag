#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float noise2d(vec2 p) {
	return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 456367.5453);
}

float getAngle(vec2 p) {
	return acos(dot(vec2(0,1.),p)/(length(p)));	
}

float calcCircle(vec2 uv,float radiusIn,float radiusOut,float roughness, float layer) {
	float angle = floor(getAngle(uv)*57./ roughness);
	
	radiusIn *= layer*.11;
	radiusOut *= layer*.11;
	
	float wave = .5+sin(time*2.+radiusIn*10.)*.5;
	
	float offsetIn = noise2d(vec2(angle,radiusIn))*.05 * wave;
	float offsetOut = noise2d(vec2(angle,radiusOut))*.05 * wave;
	float dist = length(uv);
	
	
	if(dist < radiusOut + offsetOut && dist > radiusIn + offsetIn) {
		return 1.;	
	}
	return 0.;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 uvCenter = uv -.5;
	
	uvCenter.x *= resolution.x/resolution.y;
	
	float c = 0.;
	for(float i=1.;i<20.;i++) {
		c += calcCircle(uvCenter,.14,.15,4.,i);
	}
	
	gl_FragColor = vec4(vec3(c*sin(uv), 0.), 1. );	
}