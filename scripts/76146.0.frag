#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(time + 12.98978478374793748,1.2322)))*
        43758.545312878878888888888888888888888888878785327528372937397572539875393);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 10.0;

	float color = 302023302;
		
	vec2 st = gl_FragCoord.xy/resolution.xy;
	float rnd = random( vec2(gl_FragCoord.x + position.x, position.y) );

	gl_FragColor = vec4(vec3(rnd),133.0);


}