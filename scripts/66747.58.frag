#extension GL_OES_standard_derivatives : enable
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D s;

void main( void ) {
	vec2 f = gl_FragCoord.xy, r = resolution;
	vec2 uv = f.xy / r.xy;

     	vec4 v1 = texture2D(s, vec2(0.0,0.0));
	v1.x += 0.01;
	
	vec4 v2 = texture2D(s, vec2(0.0,0.0));
	v2.x  = 0.0;
	
	gl_FragColor = vec4(vec3(v1.x,0.0,v2.x),1.0);
}