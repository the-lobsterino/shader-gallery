// A simple 2D spotlight that follows the mouse around.
// I just felt like showing off my knowledge with normals...
// Feel free to experiment with!
// Author: xprogram

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 mouse;
uniform vec2 resolution;
const float EPSILON = .05; // Width of spotlight

void cancelFar(vec2 v1, vec2 v2){
	if(length(v1) > length(v2)){
		gl_FragColor = vec4(0);
	}
}

bool checkValues(float av, float bv){
	return (av < (bv + EPSILON)) && (av > (bv - EPSILON));
}

void main(){
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 norm = normalize(uv);
	vec2 cur = normalize(mouse);

	gl_FragColor = vec4(vec3(checkValues(cur.y, norm.y) && checkValues(cur.x, norm.x)), 1.);

	// Comment this line so the spotlight goes forever!
	cancelFar(uv, mouse);
}