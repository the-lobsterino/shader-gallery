#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void translate2D(inout vec2 v, vec2 d){
	v+d;	
}

void scale2D(inout vec2 v, vec2 d){
	v*d;	
}
void main()
{

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	
	scale2D(uv, vec2(0.5));
	translate2D(uv,vec2(1.0));
	
	
	vec3 col = vec3(0.0);
	
	vec3 up = vec3(1.0,0.0,1.0);
	vec3 right = vec3(0.0,1.0,0.0);
	vec3 forward = vec3(1.0,0.0,1.0);
	vec3 eye = vec3(0.0,0.0,-1.0);
	
	float foc = 0.1;
	vec3 dir = normalize(right*uv.x +up*uv.y + forward*foc-eye);


	col = vec3(uv.x,uv.y,0.0);	
	
	gl_FragColor = vec4(col, 1.0 );

}