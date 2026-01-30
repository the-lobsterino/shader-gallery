#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D bb;

// afl_ext 2018

float waterWaves(vec2 q, vec3 e){
	float s = texture2D(bb, q).a;
	
	vec2 tmp0 = texture2D(bb, q).rg;
	vec2 tmp1 = texture2D(bb, q + e.yz).rg;
	vec2 tmp2 = texture2D(bb, q - e.yz).rg;
	vec2 tmp3 = texture2D(bb, q + e.xz).rg;
	vec2 tmp4 = texture2D(bb, q - e.xz).rg;
	
	float p0 = mix(tmp0.g, tmp0.r, s);
	float p1 = mix(tmp1.r, tmp1.g, s);
	float p2 = mix(tmp2.r, tmp2.g, s);
	float p3 = mix(tmp3.r, tmp3.g, s);
	float p4 = mix(tmp4.r, tmp4.g, s);	
	
	return -p0 + (p1 + p2 + p3 + p4) * 0.5;
}

vec2 getLastMousePos(){
	return texture2D(bb, vec2(0.0)).ba;	
}
float segment(vec2 position, vec2 start_p, vec2 end_p)
{
	vec2 AP = position - start_p;
	vec2 AB = end_p - start_p;
	float h = clamp(dot(AP, AB) / dot(AB, AB), 0.0, 1.0);
	float seg = length(AP - AB * h);
	return seg;
}
vec4 shade(vec2 uv){
	vec2 q = uv;
	vec3 e = vec3(vec2(1.0)/resolution.xy,0.);
	vec4 c = texture2D(bb, q);
	
	float p11 = mix(c.y, c.x, c.a);
	float d = waterWaves(q, e);

	
	
	float iter = 0.0;
	vec2 start = getLastMousePos();
	vec2 end = mouse.xy;
	float m = segment(q, start, end);
	
	d += 1.0 - smoothstep(0.0, 0.01, m); 
	
	c.x = mix(c.x, d, c.a);
	c.y = mix(c.y, d, 1.0 - c.a);
	c.a = 1.0 - c.a;
	return c;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 e = vec2(1.0/resolution.xy)*2.0;
	if(position.x < e.x && position.y < e.y){
		gl_FragColor = vec4(0.0, 0.0, mouse.x, mouse.y);
	}
	else gl_FragColor = shade(position);

}