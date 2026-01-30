#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
vec3 hsb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}
void main() {
	vec2 s=gl_FragCoord.xy/resolution.xy;
	gl_FragColor=vec4(hsb(vec3(floor(10.*sqrt(2.)*distance(vec2(.5,.5),s.xy))/10.,1,1)),1);
}