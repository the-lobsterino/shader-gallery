#ifdef GL_ES
precision mediump float;
#endif

// amiga ball...
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = atan(1.)*4.;

vec3 sphereTex(vec2 p,vec3 n,float radius)
{
	float t = time;
	vec2 sc = vec2(sin(t), cos(t));
	mat3 rotate_x = mat3(  1.0,  0.0,  0.0,
			       0.0, sc.y,-sc.x,
			       0.0, sc.x, sc.y);
	t = time * 1.1;
	sc = vec2(sin(t), cos(t));
	mat3 rotate_y = mat3( sc.y,  0.0, sc.x,
			       0.0,  1.0,  0.0,
			     -sc.x,  0.0, sc.y);
	t = time * 0.9;
	sc = vec2(sin(t), cos(t));
	mat3 rotate_z = mat3( sc.y,-sc.x,  0.0,
			      sc.x, sc.y,  0.0,
			       0.0,  0.0,  1.0);
	n *= rotate_x * rotate_y * rotate_z;
	
	vec2 uv = vec2(atan(n.z,n.x), atan(n.y,length(n.xz)));
		
	float checker = sin(uv.x*6.0)*sin(uv.y*6.0);
	checker = max(checker,0.);
	checker = pow(checker, 0.001);
	checker *= smoothstep(radius,radius-0.01,length(p));
	checker = max(checker,0.3);
		
	return checker > 0.3 ? vec3(1.0) : checker * vec3(2.0, 0.2, 0.2);
}

void main( void ) {

	vec2 res = vec2(resolution.x/resolution.y,1.0);
	vec2 cen = (res / 2.0);
	float x = mod(time*.5, 2.);
	vec2 sc = vec2(min(x, 2.-x)-.5, -abs(-cos(time*1.99))*.35+.1);
	vec2 p = ( gl_FragCoord.xy / resolution.y ) - cen;
	vec2 m = mouse*res-cen;
	
	vec3 col=vec3(0.0);
	
	float radius = 0.4;
	p += sc;
	float height = sqrt(dot(vec3(radius, p), vec3(-radius, p)));
	vec3 normal = normalize(vec3(p.x,p.y,height));
	
	vec3 lightDir = normalize(vec3(m,1.));
	
	float shad = dot(normal,vec3(mouse*res-cen,1.));
	float spec = dot(lightDir,normalize(reflect(-lightDir,normal)));
	spec = max(0.,spec);
	spec = pow(spec,10.)*0.7;	
	
	col = sphereTex(p,normal,radius)*shad+spec;				
	
	gl_FragColor = vec4( vec3(col), 1.0 );
}