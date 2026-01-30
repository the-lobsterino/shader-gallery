#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
        uv = fract(uv*5.) * atan(uv.y*10.);
        uv *= mat2(cos(time),-sin(time),sin(time),cos(time));
	float a = distance(vec2(1.),uv*5.)*distance(vec2(.5),uv-.2) * 2.;
	uv.x *= 2.;
	uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x -= .5;	
        float b = atan(uv.y+uv.x*sin(time))+fract(uv.x*5.+clamp(uv,uv-2.,uv+3.).y/clamp(uv,uv-2.,uv+3.).x+fract(time));
	gl_FragColor = vec4(b*b,1.-a,3.-b,1.);

}