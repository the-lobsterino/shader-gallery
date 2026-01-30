#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2. -1.;
	uv.x*= resolution.x/resolution.y;
	float speed = 2.;
	float len = .75;
	uv *= mat2(cos(sin(time*len)*speed),-sin(sin(time*len)*speed),sin(sin(time*len)*speed),cos(sin(time*len)*speed));
	float lr = smoothstep(pow(uv.x/uv.y,2.),.0,.5);
	float ud = smoothstep(pow(uv.y/uv.x,2.),.0,1.);
	vec3 lrCol = vec3(lr,lr,lr);
	vec3 udCol = vec3(ud,ud,0.);
	float border = step(length(uv),sin(time*.2)*.5+1.);
        gl_FragColor = vec4((udCol+lrCol)*border,1.);

}