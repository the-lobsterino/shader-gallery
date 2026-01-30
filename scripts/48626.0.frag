#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// example from https://www.shadertoy.com/view/4dccWj
void main( void ) {

	vec2 uv = 6.*( gl_FragCoord.xy / resolution.xy );

	// pattern
    float f = sin(uv.x + sin(2.0*uv.y + time)) +
              sin(length(uv)+time) +
              0.5*sin(uv.x*2.5+time);
    
    // color
    //vec3 col = 15.0 * cos(f + vec3(0., 2., 4.));
	vec3 col = 1;//vec3(f,f,f,1);
    gl_FragColor = vec4(col, 1.0);
}