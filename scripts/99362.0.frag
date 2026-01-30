#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float N(float t){
    return fract(sin(t * 3456.)*6547.);
}

float N12(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 uv = position;
	uv.x *= resolution.x / resolution.y;

	vec2 gridUV = fract(uv * 50.);
	vec2 gridID = floor(uv*50.);
	
	float r = sin((N(N(gridID.x) + gridID.y)))*.5+.5;
	
	float tileColor = r;
	vec2 shadowGlid = gridID - 1.;
	float shadowColor = 1. - (sin((N(shadowGlid.x + shadowGlid.y) + sin(time * N(shadowGlid.x*10. + shadowGlid.y)*4.))) +1.) / 2.;
	gridID /= 3.;
	float tileColor2 = (sin((N(gridID.x + gridID.y) + sin(time * N(gridID.x*10. + gridID.y)*4.))) +1.) / 2.;
	
	vec3 color = vec3(gridUV, 1.0) * tileColor*0.2 * tileColor2*1000. * shadowColor*10. ;
	
	gl_FragColor = vec4(color, 1.0);
}