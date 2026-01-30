#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Pls enjoy sphere normals

#define PI 3.14159265
vec3 hemisphereUniform(vec2 uv) {
	uv = uv * 2.0 - 1.0;
	float r = max(0.0, length(uv));
	//if(r <= 0.0) return vec3(0.5, 0.5, 1);
	r = sqrt(1.0 - r*r);
	vec3 d = normalize(vec3(uv, r) - vec3(0, 0, 1));
	return mix(d, vec3(0, 0, 1), r) * 0.5 + 0.5;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec3 normal = hemisphereUniform(position);
	
	normal.x = 1.0 - normal.x;
	
	gl_FragColor = vec4( normal, 1.0 );

}