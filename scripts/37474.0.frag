#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 getDir(vec2 uv){
	return normalize(vec3(uv.x, uv.y, 1.0));	
}

vec3 getAtmosphere(vec3 dir, vec3 sun){
	vec3 rhc = vec3(0.0, 0.4, 0.9) * 1.0;
	float dircoeff = (tan(1.0 - dir.y) * tan(1.0 - dir.y)) / 2.425518820;
	float raycoeff = (tan(1.0 - sun.y) * tan(1.0 - sun.y)) / 2.425518820;
	float raylen = 50.0 + 350.0 * raycoeff;
	float dirlen = 50.0 + 350.0 * dircoeff;
	vec3 suncolor = vec3(1.0) - rhc * raycoeff;
	
	return dirlen * rhc * 0.016;// + suncolor;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	gl_FragColor = vec4( getAtmosphere(getDir(position * 2.0 - 1.0), vec3(0.0, 1.0, 0.0)) , 1.0 );

}