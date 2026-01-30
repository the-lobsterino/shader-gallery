#extension GL_OES_standard_derivatives : enable
#define PI 3.1415
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float snowflake(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(sin(time*3.)*0.2+0.5,cos(mod(time,PI)*0.5+0.5));
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist));
}

void main(){
	vec2 st = gl_FragCoord.xy/resolution.xy;

	vec3 color = vec3(snowflake(st,0.01));

	gl_FragColor = vec4(color, 1.0);
}
