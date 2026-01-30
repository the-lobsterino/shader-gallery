#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float scene(vec3 pos){
	pos = mod(pos, 2.) - 1.;
	pos.x += sin(pos.y * 15. + (10. * time)) * 0.1;
	return length(pos) - 0.5;
}

vec3 getNorm(vec3 pos){
	vec2 eps = vec2(0.001, 0.);
	return normalize(vec3(
		scene(pos + eps.xyy) - scene(pos - eps.xyy),
		scene(pos + eps.yxy) - scene(pos - eps.yxy),
		scene(pos + eps.yyx) - scene(pos - eps.yyx)
	));
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;
	uv.x *= resolution.x / resolution.y;
	vec3 o = vec3(sin(time), time, time);
	vec3 dir = normalize(vec3(uv, 1.));
	mat2 rot = mat2(cos(time), -sin(time), sin(time), cos(time));
	dir.xy *= rot;
	dir.yz *= rot;
	
	float dist = 0.001;
	float totalDist = 0.;
	vec3 pos = o;
	
	for(int i = 0; i < 64; i++){
		if(dist < 0.001 || totalDist > 20.) break;
		
		dist = scene(pos);
		pos += dir * dist;
		totalDist += dist;
	}
	
	if(dist < 0.001){
		vec3 lightPos = o + 0.5;
		vec3 tnorm = getNorm(pos);
		vec3 s = normalize(lightPos - pos);
		vec3 diffuse = vec3(.75) * max(dot(s, tnorm), 0.);
		vec3 ambient = vec3(.25);
		
		vec3 col = vec3(sin(time), cos(time + pos.z), sqrt(cos(time + pos.y) + sin(time + pos.x))) * (diffuse + ambient);
		gl_FragColor = vec4( col, 1.0 );
	}else{
		gl_FragColor = vec4(vec3(0.), 1.);
	}

}