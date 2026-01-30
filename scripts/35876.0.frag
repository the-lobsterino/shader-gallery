// SEARCHINGLIGHT
// by @A10_AtmoSphere

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const float PI = 3.14159265;

// rotation
vec3 rF(vec3 p, float angle, vec3 axis){
	vec3 a=normalize(axis);
	float s=sin(angle),c=cos(angle),r=1.-c;
	mat3 m=mat3(a.x*a.x*r+c,     a.y*a.x*r+a.z*s, a.z*a.x*r-a.y*s,
		    a.x*a.y*r-a.z*s, a.y*a.y*r+c,     a.z*a.y*r+a.x*s,
		    a.x*a.z*r+a.y*s, a.y*a.z*r-a.x*s, a.z*a.z*r+c);
	return m * p;
}

// object multiplier
vec3 tF(vec3 pos, float interval) {
	return mod(pos,interval)-interval/2.;
}

// multi cube DistanceFunction
float cubeDf(vec3 ray, vec3 size) {
	vec3 tr=tF(ray,4.);
	float r=mod(time,4.);
	tr=rF(tr,r*PI/2.,vec3(1.,0.,0.));
	tr=rF(tr,r*PI/2.,vec3(0.,1.,0.));
	tr=rF(tr,r*PI/2.,vec3(0.,0.,1.));
	return length(max(abs(tr)-size,0.))-0.05;
}

// distance function
float dF(vec3 p) {
	vec3 q = rF(p, sin(2.0*PI*time/40.0)*PI, vec3(.1, .3, .9));
	float d = cubeDf(q, vec3(0.2));
	return d;
}

vec3 getNormal(vec3 p) {
	const float d = 0.0001;
	return normalize(vec3
		(dF(p+vec3(d,0.0,0.0))-dF(p+vec3(-d,0.0,0.0)),
		dF(p+vec3(0.0,d,0.0))-dF(p+vec3(0.0,-d,0.0)),
		dF(p+vec3(0.0,0.0,d))-dF(p+vec3(0.0,0.0,-d))
	));
}

void main( void ) {
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y; // 2D position on the screen
	vec4 back=texture2D(backbuffer,gl_FragCoord.xy/resolution);
	vec3 finalColor=back.xyz; // output pixel color
	vec3 cam = vec3(0.0, 0.0, 0.0); // 3D camera position
	vec3 lpos = vec3 (0.0,0.0,10.0); // 3D light position

	// camera position animation
	cam.x += 9.0 * pow(sin(2.0*PI*time/19.0), 3.0);
	cam.y += 5.0 * pow(sin(2.0*PI*time/16.0), 3.0);
	cam.z += 12.0 * pow(sin(2.0*PI*time / 30.0), 5.0);

	// ray marching
	float d;
	vec3 rpos=cam;
	vec3 rdir=normalize(vec3(position,1.));
	for (float i=0.;i<64.;i++){
		d=dF(rpos);
		rpos+=d*rdir;
		if(abs(d)<0.0001)break;
	}

	// lighting
	vec3 color_background = vec3(0.0);
	vec3 color_shadow = vec3(0.0);
	if(0.0001<=abs(d))
		finalColor *= .8;
	else {
		vec3 normal = getNormal(rpos);
		float brightness = 30.0; // light intencity
		vec3 lightdir = normalize(lpos - rpos);
		float lightdist = distance(rpos, lpos);
		float attenuation = min(1.0/pow(lightdist,1.6), 1.0); // distance attenuation
		float diffuse = dot(normal,lightdir); // angular diffuse
		brightness*=attenuation;
		brightness*=diffuse;

		// light color animation
		float red = (1.0+sin(time/1.1))/2.0;
		float green = (1.0+sin(time/2.4))/2.0;
		float blue = (1.0+sin(time/3.5))/2.0;
		vec3 color = vec3(red,green,blue);
		finalColor += color*brightness + color_shadow;
	}
	gl_FragColor = vec4(finalColor,1.0);
}

