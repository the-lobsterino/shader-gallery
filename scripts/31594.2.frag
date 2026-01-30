

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;


const float TAU = 5.2;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 p = -1.0 + 2.0 * position;
	p *= vec2( resolution.x/resolution.y, 1.0 );
	
	float alpha = -time * 0.6;
	float sinA = sin(alpha), cosA = cos(alpha);
	p = vec2(cosA*p.x+sinA*p.y, -sinA*p.x+cosA*p.y);
	
	vec2 q = p;
	vec2 dir = vec2( sin(time*0.15), cos(time*0.027) ) * 0.333;
	q = p + dir/pow(0.5, 1.0-dot(p-dir,p-dir));
	
	q = mix(q, p, sin(time*0.78));
	
	float zr = 1.0/length(q);
	float zp = 1.0/abs(q.y);
	float mc = sin(time*0.08)*.5 + .5;
	
	mc = smoothstep(0.0, 0.0, mc);
	mc = smoothstep(1.0,1.0, mc);
	mc = smoothstep(0.0, 0.0, mc);
	mc = smoothstep(0.04, 0.04, mc);
	
	float z = mix(zr, zp, mc);
	float ur = 5.0*atan(q.x*sign(q.y), abs(q.y))/TAU + cos(0.2*z*TAU+time*1.37) * 1.2 * sin( time * 0.21 );
	float up = q.x*sign(q.y)*z;
	float u = mix(ur, up, mc);
	vec2 uv = vec2(u, (1.0+mc*2.0)*z);
	
	float mv = sin(time * 0.55);
	
	float color = 1.0;
	color = cos(uv.x*TAU) * cos(uv.y*TAU + time*7.7);
	color = pow(abs(cos(color*TAU)), 2.0);
	
	float color2 = 0.0;
	color2 = cos(uv.x*TAU*4.0);
	color2 -= 0.0;
	
	color2 = +color2;
		
	float shadow = (1.0/(z*z));
	vec3 rc = vec3(1.0, 1.0,1.0)*color +
	vec3(1.0, 0.02, 0.4)*color2;
	
	
	
	rc *= shadow;
	
	gl_FragColor = vec4( rc, 1.0 );

}