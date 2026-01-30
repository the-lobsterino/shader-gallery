/*
 * Original shader from: https://www.shadertoy.com/view/Wts3DS
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define CELLS 30.

float rand(vec2 p) {
	return fract(sin(p.x*61.21+p.y*45.58)*4001.0);
}

vec2 cell(vec2 p) {
	return floor(p.xy*CELLS);
}

vec2 cellorigin(vec2 ij) {
	return ij/CELLS;
}

vec2 cellcenter(vec2 ij) {
	vec2 offset = vec2(rand(ij.xy*10.), rand(ij.yx*10.))/CELLS;
	float movSpeed = .3;
	offset += vec2(sin(iTime*movSpeed+rand(ij.xy)*10.), cos(iTime*movSpeed+rand(ij.yx)*10.) )/CELLS/2.;
	return cellorigin(ij) + clamp(offset, 0., 1./CELLS);
}

float voronoi(vec2 p) {
	vec2 ij = cell(p);
	
	vec2 nearest = ij;
	float nearestdist = 999.;
	for (float i = -1.; i <= 1.; i++) {
	for (float j = -1.; j <= 1.; j++) {
		vec2 ijneighbor = ij.xy + vec2(i,j);
		float ijcenterdist = length(p - cellcenter(ijneighbor));
		if (ijcenterdist  < nearestdist) {
			nearest = ijneighbor;
			nearestdist = ijcenterdist;
		}
	}}
	return nearestdist*CELLS;
}

float map(vec3 p) {
	p += voronoi(p.xy/6.)/30.;
	return length(p) - 3.;
}

vec3 normal(vec3 p) {
	vec2 e = vec2(0.001, 0.);
	return normalize(vec3(
		map(p+e.xyy)-map(p-e.xyy),
		map(p+e.yxy)-map(p-e.yxy),
		map(p+e.yyx)-map(p-e.yyx)));
}

vec3 lightdir = normalize(vec3(.5,-.5,1.));
float lightAt(vec3 p) {
	return dot(-lightdir, normal(p));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

	vec2 uv = ( 2.*fragCoord.xy-iResolution.xy ) / iResolution.y;
	uv.y /= 1.2;
	uv.x *= 1. + uv.y/5.;
	
	vec3 eye = vec3(0.,0.,-5.);
	vec3 raydir = normalize(vec3(uv.x, uv.y, 1.));
	
	vec3 p = eye;
	int hit = -1;
	
	for (int i = 0; i < 50; i++) {
		float d = map(p);
		if (d < 0.001) {
			hit = i;
			break;
		}
		p += d * raydir;
	}

	float light =  lightAt(p);
	float texture = voronoi(p.xy*2.) * lightAt(p)/2.5;
	texture += voronoi(p.xy/10.+11.)*0.5;
	texture /= voronoi(p.xy/50.+20.)*2.0;
	vec3 color = mix(vec3(0.0,0.0,0.0), vec3(0.3,0.4,0.5), uv.y);
	if (hit > -1) {
	     color = mix(vec3(.0,.0,.2), vec3(.4,.9,1.), texture) * (1. - float(hit)/100.) * lightAt(p);
	} 
	
	
	fragColor = vec4(color, 1.0);

}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}