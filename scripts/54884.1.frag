#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define TWO_PI 6.28318530718
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main( void ) {
	vec2 st = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 color = vec3(0.);
	
	vec2 stToCenter = vec2(0.)-st;
	float angle = atan(stToCenter.y,stToCenter.x)+time;
	float angle2 = atan(stToCenter.y,stToCenter.x)-time;
	float radius = length(stToCenter)*20.*abs(sin(time*8.+TWO_PI)*.2-0.4);
	
	if(radius < 0.5)
		color = hsb2rgb(vec3((angle/TWO_PI)+.5,radius,1.));
	else 
		color = hsb2rgb(vec3((3.*angle2/TWO_PI)+.5,radius*2.,1.));
	gl_FragColor = vec4(color,1.);
	
}