#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 uv = vec2(0);

float plotline(float x){
	return 1./length(x-uv.y);
}

float followmouse(vec2 m){
	float linex = 1./length(m.x-uv.x);
	float liney = 1./length(m.y-uv.y);
	return mix(linex,liney,.5);
}

void main( void ) {

	uv = ( gl_FragCoord.xy / resolution.xy );
	uv = uv*2.-1.;
	uv.x *= resolution.x/resolution.y;
	vec2 m = mouse*2.-1.;
	m.x *= resolution.x/resolution.y;
	uv*=2.;
	m*=2.;

	float c = 0.;
	float eq1 = smoothstep(m.x,1.,uv.x);
	float eq2 = smoothstep(m.y,-1.,uv.x);
	float lx = plotline(uv.x);
	
	c += lx;
	
	c = max(plotline(0.),c);
	c = max(c,1./length(0.-uv.x));
	
	//c = max(c,followmouse(m));
	//c = max(c,1./length(m.x-uv.x));
	//c = max(c,1./length(m.y-uv.x));
	
	c = max(c,1./length(1.-uv.x));
	c = max(c,1./length(1.-uv.y));
	c = max(c,1./length(-1.-uv.x));
	c = max(c,1./length(-1.-uv.y));

	gl_FragColor = vec4(max(vec3(0,1./length(m.x-uv.x),1./length(m.y-uv.x))*.005+c*.005,vec3(plotline(clamp(eq1-eq2,0.,1.)),plotline(eq1),plotline(eq2))*.05), 1.0 );

}