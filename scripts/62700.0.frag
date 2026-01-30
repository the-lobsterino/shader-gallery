#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.0);



#define EPS 0.001

float rand(vec2 p) {
	return fract(sin(p.x*12.9898+p.y*78.233)*43758.543);
}

float noise(vec2 p) {
	vec2 i = floor(p);
	vec2 f = fract(p);
	
	vec2 o = vec2(0.,1.);
	float a = rand(i+o.xx);
	float b = rand(i+o.yx);
	float c = rand(i+o.xy);
	float d = rand(i+o.yy);
	
	return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}

float fractNoise(vec2 p) {
	float r = noise(p);
	for (float i = 1.; i < 7.; i++) {
		r += noise(p*pow(2., i)) / pow(i, 2.5);
	}
	return r;
}

float artifacts(vec3 p) {
	p = vec3(p.x,p.y-2.5,mod(p.z,4.6)-2.3);
	//p = vec3(p.x,p.y-1.,p.z);
	p.x =p.x+p.x*sin(iTime*0.3)+p.y*sin(iTime*0.5);
	p.y /= 0.2;
	p.x /= 0.2;
	return length(p) - 1.2;
}

float terrain(vec3 p) {
	return p.y - fractNoise(p.xz/1.8)*1.2;
}

float map(vec3 p) {
	return min(
		terrain(p),
		artifacts(p));
}

vec3 normal(vec3 p) {
	vec2 e = vec2(EPS, 0.);
	return normalize(vec3(
		map(p+e.xyy)-map(p-e.xyy),
		map(p+e.yxy)-map(p-e.yxy),
		map(p+e.yyx)-map(p-e.yyx)
		));
}

vec3 lightdir = normalize(vec3(.5,-5.,-2.));
vec3 terrainColor(vec3 p, float hit) {
	return mix(
		vec3(.0,.2,.0),
		vec3(.3,.8,.6),
		dot(normal(p), -lightdir) - hit/100.);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

	vec2 uv = ( 2. * fragCoord.xy - iResolution.xy ) / iResolution.y * 5.;
	uv += (sin(uv.x*10.+iTime/4.)+cos(uv.y*5.+iTime/4.))/50.;
	
	vec3 eye = vec3(0.,3.,iTime*0.1);
	vec3 p = eye;
	vec3 phit = eye;
	vec3 raydir = normalize(vec3(uv.x, uv.y-2.5, 4.));
	float hit = -1.;
	float reflectionHit = -1.;
	
	for (float i = 0.; i < 100.; i++) {
		float d = (hit > -1.) ? terrain(p) : map(p);
		if (d < EPS) {
			if (hit == -1.) {
				hit = i;
				phit = p;
				vec3 n = normal(p);
				raydir = raydir - 2.*dot(raydir,n)*n;
				if (terrain(p) < EPS) {
					break;
				}
			} else {
				reflectionHit = i;
				break;
			}
		}
		p += d * raydir * .7;
	}
	
	
	vec3 color;
	if (hit > 0.) {
		if (artifacts(phit) < EPS) {
			color = mix(
				vec3(.7,.2,.1),
				vec3(.9,.8,.6),
				dot(normal(phit), -lightdir) - hit/100.);
			color += clamp(terrainColor(p, hit)/2., 0.1, .5) * length(terrainColor(p, hit))/3. * 5.;
		} else {
			color = terrainColor(p, hit);
		}
	}
	color -= smoothstep(0.7,1.,p.y)/5.;
	color -= pow(length(p.z-eye.z), 0.2)/10.;
	color /= clamp(length(p.z-eye.z)/1.5, .5, 1.5);
	color = clamp(color, vec3(0.), vec3(1.));
	color += vec3(.02,.02,.15);
	color += vec3(.2,.4,.8)*clamp(uv.y/8.-.5,0.,.3);
	color = vec3(pow(color.x, .9), pow(color.y, .9), pow(color.z, .9));
	

	fragColor = vec4(color, 1.0 );

}


void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}