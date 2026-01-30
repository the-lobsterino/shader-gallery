#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );


	float r =  sin(p.x * p.y * 3.14 * 10.0 * mouse.y * time);
	float g =  sin(r * 3.14 * 10.0 + time);
        float b = tan(g * 3.14 * time);


	gl_FragColor = vec4(r, g, b, 1.0);
	
}