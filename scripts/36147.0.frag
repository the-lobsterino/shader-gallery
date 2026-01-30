precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float cdist(vec2 v0, vec2 v1){
	v0 = abs(v0-v1);
	return max(v0.x,v0.y);
}

void main( void ){
	//fragment position
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	vec2 q = vec2(p.x* abs(5.0/p.y), abs(5.0/p.y)-10.0+cos(time*0.5));

	float grid = 2.0 * cdist(vec2(0.5), mod((q),1.0));
	vec3 color = vec3 (smoothstep(0.9,1.0,grid)*1.0 / length(q-mouse));

	gl_FragColor += vec4( color, 1.0 );
}

