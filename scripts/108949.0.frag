#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
        uv *= mat2(cos(time),-sin(time),sin(time),cos(time));
	float line = clamp(abs(uv.x-uv.y),.2,1.);
        float border = smoothstep(uv.x-uv.y,-.8,-.05)+smoothstep(uv.y-uv.x,-.8,-.05);
	
	vec3 result = vec3(border/line,.0,line*(abs(uv.x-uv.y)));

	gl_FragColor = vec4(result, 1.0 );

}