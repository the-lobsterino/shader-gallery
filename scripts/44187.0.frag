#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec2 curMouse = vec2(0.0, 0.0);
vec2 prevMouse = vec2(0.0, 0.0);

vec3 simpleBall(vec2 fragCoord, vec2 position) {
	if(length(fragCoord - position) < 0.08)
		return vec3(1.0);
	
	return vec3(0.0, 0.0, 0.0);
}

vec3 ball(vec2 fragCoord) {
	vec2 velocity = curMouse - prevMouse;
	
	vec3 result = vec3(0.0, 0.0, 0.0);
	
	if(fragCoord.x > 1.0)
		velocity *= 0.0;
	
	//velocity = vec2(0.2, 0.1);
	//velocity *= 1.5;
	//velocity.x *= (mouse - fragCoord).y * 15.0;
	
	for(int i = 0; i < 60; i++) {
		vec2 pos = prevMouse + (velocity / 60.0) * float(i);
		result += simpleBall(fragCoord, pos) / 60.0;
	}
	
	return result;
}

void main( void ) {
	curMouse = mouse;
	curMouse.x *= resolution.x / resolution.y;
	prevMouse = texture2D(backbuffer, vec2(0, 0)).xy * 2.0;
	if(gl_FragCoord.xy == vec2(0.5, 0.5)) {
		gl_FragColor = vec4(curMouse * 0.5, 0.0, 1.0);
		return;
	}
	
	vec2 position = ( gl_FragCoord.xy / resolution.yy );

	vec3 result = ball(position);
	
	gl_FragColor = vec4(result, 1.0);

}