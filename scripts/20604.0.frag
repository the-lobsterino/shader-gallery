#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float sdTorus( vec3 p, vec2 t )
{
	vec2 q = vec2(length(p.xz)-t.x,p.y);
	return length(q)-t.y;
}


void main( void )
{

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float tick = time / 0.4;
	//float off = sin(tick + (22.0 * position.y));
	float off = sin(tick);
	off /= 8.0;
	vec2 spinpos = position - 0.5;
//	if (off > 0.0) {
//		spinpos.x = asin(spinpos.x - off);
//	} else {
//		spinpos.x = spinpos.x * (off - sin(spinpos.x)) *128.0;
//	}

	vec2 p = spinpos;
	vec2 m = mouse - 0.5;

	float color = 0.0;
	vec3 sun = vec3(2.3, 2.0, 1.0);
	
	float t = sin((time / 3.14) * 12.0);
	float tpos = (t + 1.0) / 2.0;
	float tt = time / 4.0;
	float ry = tt * 2.7;
	float rz = tt * 3.33;
	mat4 roty = mat4(
		vec4(  cos(ry),     0.0, -sin(ry), 0.0),
		vec4(      0.0,     1.0,      0.0, 0.0),
		vec4(  sin(ry),     0.0,  cos(ry), 0.0),
		vec4(      0.0,     0.0,      0.0, 1.0)
	);
	mat4 rotz = mat4(
		vec4(  cos(rz), sin(rz),      0.0, 0.0),
		vec4( -sin(rz), cos(rz),      0.0, 0.0),
		vec4(      0.0,     0.0,      1.0, 0.0),
		vec4(      0.0,     0.0,      0.0, 1.0)
	);
	
	mat4 rot =  roty;


	vec2  torxy = p - m;
	float torz  = 0.0; //t/3.0;
	vec3 torp_pre = vec3(torxy.xy, torz);
	vec4 torp_rot4 = vec4(torp_pre, 0.0) * rot;
	//vec3 torp_rot = torp_rot4.xyz;
	vec3 torp_rot = torp_pre;
	
	float tora = 0.00;
	float torb = 0.00;
	vec2  torr = vec2(tora, torb);
	float torsize = 4.0;

	vec3 torp = torp_rot * torsize;
	float tor = sdTorus(torp, torr);
	//color += 1.0 - tor;
	float near = 0.5;
	float far = 0.8;
	
	if (tor < far) {
		if (tor > near) {
			float torw = far - near;
			float mid = torw/2.0;
			float rest = (tor - near);
			float rr = rest / mid;
			float r = (mid - rest) / mid;
			vec3 tnorm = normalize(torp);
			float torss = dot(sun, tnorm);
			float tors = sin(r) * atan(torss);
			color += 0.0 + cos(r) - (1.5 * tors);
			color += tors;
		} else {
			color += 0.0;
		}
	}

	gl_FragColor = vec4( vec3( color ), 1.0 );

}