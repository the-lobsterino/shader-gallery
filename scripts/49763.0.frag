#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float getHeightmap(vec2 p){
	p -= 0.5;
	return (p.x * p.y) * 100.0;
}

vec3 getNormals(vec2 p){
    const float delta = 0.00001;
    
    vec2 d;
    d.x = getHeightmap(p + vec2(delta, -delta));
    d.y = getHeightmap(p + vec2(-delta, delta));
    d -= getHeightmap(p + vec2(delta));

    vec3 normal = vec3(-2.0 * delta, -2.0 * (delta * delta + delta), 4.0 * delta * delta);
    normal.xy *= d;

    return normalize(normal);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;

	vec3 color = vec3(0.0);
	     color = getNormals(position);

	gl_FragColor = vec4(color, 1.0 );

}