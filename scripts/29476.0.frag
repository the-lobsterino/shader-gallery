#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define ITE_MAX      45*4
#define DIST_COEFF   1.00
#define DIST_MIN     0.001
#define DIST_MAX     1000.0

mat2 rot2( float angle ) {
	float c = cos( angle );
	float s = sin( angle );
	
	return mat2(
		 c, s,
		-s, c
	);
}

#define pi 3.14159265
float perlin(vec3 p) {
	vec3 i = floor(p);
	vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
	vec3 f = cos((p-i)*pi)*(-.5)+.5;
	a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
	a.xy = mix(a.xz, a.yw, f.y);
	return mix(a.x, a.y, f.z);
}

float map(vec3 p) {
	float t = DIST_MAX;
	float w = 0.0;

	p.xz = rot2(time * 0.1) * p.xz;
	
	w = length(p) - 0.5 + perlin(p * sin(time * 0.6) * 4.5) * 0.1; 
	t = min(t, w);

	return t;
}

vec3 getNormal(vec3 p){
  float d = 0.001;
  return normalize(vec3(
    map(p + vec3(  d, 0.0, 0.0)) - map(p + vec3( -d, 0.0, 0.0)),
    map(p + vec3(0.0,   d, 0.0)) - map(p + vec3(0.0,  -d, 0.0)),
    map(p + vec3(0.0, 0.0,   d)) - map(p + vec3(0.0, 0.0,  -d))
  ));
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	
	float aspect = resolution.x / resolution.y;
	vec3  dir = normalize(vec3(uv * vec2(aspect, 1.0), 1.0));
	
	vec3 pos = vec3(0.0, 0.0, -1.0);
	
	float t = 0.0;
	
	for(int i = 0 ; i < ITE_MAX; i++) {
		float ttemp = map(t * dir + pos);
		if(ttemp < DIST_MIN) break;
		
		t += ttemp * DIST_COEFF;
	}
	
	vec3 ip = pos + dir * t;
	
	vec3 normalVector = getNormal(ip);
	
    	float dark = min(3.0 / length(ip), 1.0);

    	float color_ = max(dot(normalVector, normalize(vec3(1.0, 1.0, -1.0))), 0.1);
	vec3 color = vec3(pow(color_, 1.5));
	color *= vec3(normalVector.x, normalVector.y, 0.7-normalVector.y*normalVector.x);

	gl_FragColor = vec4(color * (1.0 - normalVector.z*normalVector.z) * dark, 1.0);
}
