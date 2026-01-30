#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec2 getTexel(){
	return 1.0/resolution.xy;	
}

#define pressure(a) texture2D(backbuffer,a).r;

float getPressure(vec2 uv){
	float pres = 0.0;
	vec3 texel = vec3(getTexel(), 0.0);
	pres += pressure(uv + texel.xz);
	pres += pressure(uv - texel.xz);
	pres += pressure(uv + texel.yz);
	pres += pressure(uv - texel.yz);
	return pres*0.25;
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	float pres = getPressure(uv);
	pres += 1.0 - smoothstep(0.0, 0.01, distance(mouse, uv));

	
	gl_FragColor = vec4(pres * 0.6, 0.0, 0.0, 1.0 );

}