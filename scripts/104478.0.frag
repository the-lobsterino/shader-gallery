#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;


vec2 pixel = 4.0 / resolution;
vec3 normal = vec3(0);

float getMomentum(vec2 uv, float angle){
	vec2 pshuf = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * vec2(1.0, 0.0);
	float m0 = texture2D(bb, uv).y;
	float part = (3.1415 * 2.0) / 16.0;
	mat2 rot = mat2(cos(part), -sin(part), sin(part), cos(part));
	vec3 last = vec3(pshuf.x, texture2D(bb, uv + pshuf * pixel).y, pshuf.y);
	pshuf = rot * pshuf;
	vec3 force = vec3(0.0);
	float prs = 0.0;
	float velocity = 0.0;
	for(int i=0;i<16;i++){
		vec3 p = vec3(pshuf.x, texture2D(bb, uv + pshuf * pixel).y, pshuf.y);
		prs += p.y;
		force += normalize(cross(normalize(last - vec3(0.0, m0, 0.0)), normalize(p - vec3(0.0, m0, 0.0))));
		last = p;
		pshuf = rot * pshuf;
	}
	pshuf = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * vec2(1.0, 0.0);
	last = vec3(pshuf.x, texture2D(bb, uv + pshuf * pixel).y, pshuf.y);
	pshuf = rot * pshuf;
	force /= 16.0;
	prs /= 16.0;
	for(int i=0;i<16;i++){
		vec3 p = vec3(pshuf.x, texture2D(bb, uv + pshuf * pixel).y, pshuf.y);
		velocity += max(0.0, dot(normalize(-force.xz), normalize(pshuf))) * p.y;
		last = p;
		pshuf = rot * pshuf;
	}
	velocity /= 32.;
	normal = clamp(normalize(force) * 11.0, 0.0, 1.0);
	vec2 res = (force).xz;
	//m1 *= max(0.0, dot(normalize(res), normalize(rot * pshuf.xy)));
	//m2 *= max(0.0, dot(normalize(res), -normalize(rot * pshuf.xy)));
	//m3 *= max(0.0, dot(normalize(res), normalize(rot * pshuf.yx)));
	//m4 *= max(0.0, dot(normalize(res), -normalize(rot * pshuf.yx)));
	return clamp(velocity * 6.0, 0.05, .995);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float momentum = getMomentum(position, time);
	 
	
	position.x *= resolution.x / resolution.y;
	vec2 mouse2 = mouse;
	mouse2.x *= resolution.x / resolution.y;
	momentum += ((cos(time * 1.0) * cos(time * 7.9873) * cos(time * 1.45)) )  * (1.0 - smoothstep(0.0, 0.1, distance(mouse2, position)))*.125;
	//float phase = cos(time * 6.0)  * 1.0 - smoothstep(0.0, 0.1, distance(mouse, position));

	gl_FragColor = vec4(normal.x, momentum, normal.z, 1.);
	
	//gl_FragColor = vec4( 0.0 );

}