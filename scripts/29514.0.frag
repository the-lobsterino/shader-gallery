#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float Cn = -1.0 / sqrt(2.0);
const float Cp =  1.0 / sqrt(2.0);

vec4 toqray (vec3 v) {
    	vec4 q = v.xxyy * vec4(Cn, Cp, Cn, Cp);
    	vec4 s = v.zzzz * vec4(-0.5,-0.5,0.5,0.5);
    	return q + s;
}

vec3 fromqray (vec4 v) {
    vec4 q = v * vec4(Cn,Cp,Cn,Cp);
    vec4 s = v * vec4(-0.5,-0.5,0.5,0.5);
    return vec3(
        q.xz + q.yw,
        s.x+s.y+s.z+s.w);
}

// distance field of sphere in tetrahedral coordinates
float df (vec4 p) {
	return length(p) - 1.0;
}

void main( void ) {
	vec2 aspect = vec2 (resolution.x / resolution.y, 1.0);
	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5) * aspect;
	position = position * 2.0;
	
	vec4 c = toqray(vec3(position.xy, sin(time)));
	float eps = 0.001;
	vec4 o = vec4(eps,0.0,0.0,0.0);
	vec4 n = normalize(vec4(
		df(c + o.xyyy) - df(c - o.xyyy),
		df(c + o.yxyy) - df(c - o.yxyy),
		df(c + o.yyxy) - df(c - o.yyxy),
		df(c + o.yyyx) - df(c - o.yyyx)));
	// convert back to cartesian
	vec3 nc = fromqray(n);
	
	float r = abs(df(c));

	gl_FragColor = vec4(vec3(r) * (nc * 0.5 + 0.5), 1.0);

}