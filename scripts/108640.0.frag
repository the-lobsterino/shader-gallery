#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x*= resolution.x/resolution.y;

        float f = smoothstep(.1,uv.y,tan(abs(uv.x*15.-.5)))*.2;
	float dots = distance(sin(uv*50.),vec2(uv.x*2.));
	vec3 col = mix(vec3(1.,0.,0.),vec3(.5,.2,0.),dots)*3.5;
	
	gl_FragColor = vec4(col,1.);
}