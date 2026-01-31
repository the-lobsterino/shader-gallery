#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution ;
float Tilling = 3.;
vec4 TriangleColor = vec4(0.1,0.8,0.1,1.0);
vec4 TriangleLineColor = vec4(0.1,0.4,0.1,1.0);
float EdgeWidth = 0.4;
vec4 DissolveEdgeColor = vec4(1.0,0.0,0.0,0.0);

void main( void ) {
	vec2 r = resolution;
	vec2 uv = (gl_FragCoord.xy*2.-r)/min(r.x,r.y);
	vec2 p = vec2(uv.x*.856,uv.y);
	
	float istwo = mod(floor(p.y*Tilling),2.);
	float isone=1.-istwo;
	
	vec2 p2= p*Tilling;
	p2= vec2(p2.x+istwo*0.5,p2.y);
	
	vec2 pindex = floor(p2);
	vec2 process= fract(p2);
	float xsign  = sign(process.x-0.5);
	vec2 p3 = vec2(abs(process.x-0.5),process.y);
	
	//Column2
	float w1 = max(p3.x*2.+p3.y,1.-(p3.y*1.5));
	vec2 process2 =vec2(1.5,1.)-p3;
	float w2 = max(process2.x*2.+process2.y,1.-(process2.y*1.5));
	
	float TriangleBase = mix(1.-w2,1.-w1,step(1.0,p3.x*2.+p3.y))/0.6;
	
	//Column3
	vec2 TriangleCoord = (pindex+vec2(xsign/2.* 1.-(step(1.0,p3.x*2.+p3.y))+isone/2.,0.0) / 2.)-0.5;
	
	vec4 TriangleTileColored = mix(TriangleLineColor,TriangleColor,step(TriangleBase,0.1));
	
	
	
	//
	float TriangleX = (.2*(TriangleCoord+TriangleBase)).x /.5;
	
	float time = sin(time)*.2/.2;
	
	vec3 EmissiveColor= mix(DissolveEdgeColor * 1.0-step(TriangleX, time + EdgeWidth), TriangleTileColored, TriangleTileColored).xyz;
	float opacity = step(TriangleX,time);
	
	
	gl_FragColor = vec4(EmissiveColor,opacity);
	

}