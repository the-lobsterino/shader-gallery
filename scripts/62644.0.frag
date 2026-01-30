/*
 * Original shader from: https://www.shadertoy.com/view/ldfGzM
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// Copyright (c) 2014 Andrew Baldwin (baldand)
// License = Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) (http://creativecommons.org/licenses/by-sa/4.0/)

#define SHADOW
#define AO

float rnd(vec2 n)
{
  return fract(sin(dot(n.xy, vec2(12.345,67.891)))*12345.6789);
}

float rnd2(vec3 n)
{
  return fract(sin(dot(n.xyz, vec3(12.345,67.891,40.123)))*12345.6789);
}


float saw(float t)
{
	return abs(fract(t*.5)*2.-1.)*2.-1.;
}

float obj(vec3 pos, vec3 opos)
{
	pos *= vec3(1.,.5,1.);
	vec3 coord = floor(pos);
	coord = vec3(coord.x,0.,coord.z);
	vec3 f = fract(pos);
	vec3 diff = vec3(1.,0.,0.);
	float tl = rnd(coord.xz);
	float ltl = length(pos-coord);
	float tr = rnd(coord.xz+diff.xz);
	float ltr = length(pos-coord-diff);
	float bl = rnd(coord.xz+diff.yx);
	float lbl = length(pos-coord-diff.yyx);
	float br = rnd(coord.xz+diff.xx);
	float lbr = length(pos-coord-diff.xyx);
	float b = .25*(ltl+ltr+lbl+lbr)-0.;
    f = f*f*(3.0-2.0*f);
	float off = .5*mix(mix(tl,tr,f.x),mix(bl,br,f.x),f.z);
	b = min(min(ltl-off,ltr-off),min(lbl-off,lbr-off));
	
	vec3 opos1 = opos*10.;
	vec3 fopos = floor(opos1);
	b = max(b,-.1*length(opos1-.5-fopos)+.05);
	vec3 opos2 = opos*13.21873;
	fopos = floor(opos2);
	b = max(b,-length(opos2-.5-fopos)/13.21873+.05);
	
	return b;
}

float height(vec3 pos) 
{
	return -10.*sin(.06*((pos.x+.5)))*sin(.05*((pos.z+.5)))-30.*sin(.01*(pos.x+.5))*sin(.01*(pos.z+.5));
}

float gridheight(vec3 pos)
{
	return -10.*sin(.06*floor((pos.x+.5)))*sin(.05*floor((pos.z+.5)))-30.*sin(.01*floor(pos.x+.5))*sin(.01*floor(pos.z+.5));
}

vec3 map(vec3 pos, float time)
{
	vec3 floorpos = pos;
	floorpos.y -= height(pos);
	vec3 res = vec3(floorpos.y+1.,0.,0.0);
	if (floorpos.y<3.) {
		vec3 opos = pos;
		pos.y -= gridheight(pos);
		float b = obj(pos,opos);
		float b2 = 0.;
		b = max(b,b2);
		if (b<res.x) {
			res.x = b;
			res.y = 1.;
		}
	} else {
		res.x = max(floorpos.y-10000.,1.);
		res.y = 4.;
	}
	res.z = floorpos.y;
	return res;
}

vec3 normal(vec3 pos, float time)
{
	vec3 eps = vec3(0.001,0.,0.);
	float dx = map(pos+eps.xyy,time).x;
	float dy = map(pos+eps.yxy,time).x;
	float dz = map(pos+eps.yyx,time).x;
	float mdx = map(pos-eps.xyy,time).x;
	float mdy = map(pos-eps.yxy,time).x;
	float mdz = map(pos-eps.yyx,time).x;
	return normalize(vec3(dx-mdx,dy-mdy,dz-mdz));
}

vec3 model(vec3 rayOrigin, vec3 rayDirection,float time)
{
	float t = 0.;
	vec3 p;
	float d = 2.;
	bool nothit = true;
	vec3 r;
	float scatter = 0.;
    
    vec3 sundir = normalize(vec3(cos(0.1),sin(0.1),0.4));
    vec3 skycol = vec3(0.13,.2,.6); 
	float sun = clamp(dot(sundir,rayDirection),0.0,1.0);
    skycol = 0.75*mix(vec3(.3,.3,.1),skycol,.95+.05*sun)+vec3(1.0,0.8,0.7)*pow(sun,16.0);
    
	for (int i=0;i<2000;i++) {
		if (nothit) {
			t += min(d*.5,10.);
			p = rayOrigin + t * rayDirection;
			r = map(p,time);
            scatter += d*5.*clamp(-p.y+2.-r.z,0.,1.)
                     + d*.2*clamp(p.y+5.+r.z-10.,0.,1.)
                	 + d*.5
                	 + d*1.*clamp(
                         0.01*r.z*(sin((p.x+r.z)*.05))
                        + (sin( (p.y+r.z*.5)*.1)) * (sin(r.z*.3))
                         ,0.0,10.0)*clamp(p.y-150.+r.z,0.0,5.0);
			d = r.x;
			nothit = d>t*.001 && t<100000.;
		}
	}
	t += d*.5;
	p = rayOrigin + t * rayDirection;
	vec3 n = normal(p,time);
	float lh = abs(fract(iTime*.1)*2.-1.);
	lh = 79.*lh*lh*(3.-2.*lh);
	vec3 lightpos = p+sundir;
	vec3 lightdist = lightpos - p;
	float light = 2.+dot(lightdist,n)*1./length(lightdist);
#ifdef AO
	// AO
	float at = 0.4;
	float dsum = d;
	vec3 ap;
	for (int i=0;i<4;i++) {
		ap = p + at * n;
		dsum += map(ap,time).x/(at*at);
		at += 0.1;
	}
	float ao = clamp(dsum*.1,0.,1.);
	light = light*ao;
#endif
#ifdef SHADOW
	// March for shadow
	vec3 s;
	float st;
	float sd=0.;
	float sh=1.;
	st=.3;//+.5*rnd2(p+.0123+fract(iTime*.11298923));
	vec3 shadowRay = normalize(sundir);
	nothit = true;
	for (int i=0;i<10;i++) {
		if (nothit) {
			st += sd*.5;
			s = p + st * shadowRay;
			sd = map(s,time).x;
			sh = min(sh,sd);
			nothit = sd>0.00001;
		}
	}
	light = 5.0*light * clamp(sh,0.1,1.);
#endif
	vec3 m;
	m=.5+.2*abs(fract(p)*2.-1.);
	m=mix(vec3(.05,.15,.03),vec3(.25,.1,.03),rnd(floor(p.xz*.5)));
	if (r.y==0.) {
		m=vec3(.08,0.05,0.01);
	} else if (r.y==2.) {
		m=.3+vec3(m.x+m.y+m.z)*.333;
	} else if (r.y==3.) {
		m=vec3(1.,0.,0.);
	} else if (r.y==4.) {
		m=skycol;
	}
	vec3 c = vec3(clamp(1.*light,0.,10.))*vec3(m)+vec3(scatter*.001);
	return c; 
}

vec3 camera(in vec2 sensorCoordinate, in vec3 cameraPosition, in vec3 cameraLookingAt, in vec3 cameraUp)
{
	vec2 uv = 1.-sensorCoordinate;
	vec3 sensorPosition = cameraPosition;
	vec3 direction = normalize(cameraLookingAt - sensorPosition);
	vec3 lensPosition = sensorPosition + 2.*direction;
	const vec2 lensSize = vec2(1.);
    vec2 sensorSize = vec2(iResolution.x/iResolution.y,1.0);
	vec2 offset = sensorSize * (uv - 0.5);
	vec3 right = cross(cameraUp,direction);
	vec3 rayOrigin = sensorPosition + offset.y*cameraUp + offset.x*right;
	vec3 rayDirection = normalize(lensPosition - rayOrigin);
	vec3 colour = vec3(0.);
	colour = 2.*max(model(rayOrigin, rayDirection,iTime),vec3(0.));
	colour = colour/(1.+colour);
    return colour;
}
		
vec3 world(vec2 fragCoord)
{
	// Position camera with interaction
	float anim = saw(iTime*.1);
	float rotspeed = .75+10.*iMouse.x/iResolution.x;
	float radius = (1.+anim+iMouse.y/iResolution.y)*10.;//10.+5.*sin(iTime*.2);
    float speed = 0.5;
    float time = speed*iTime;
	vec3 base = vec3(time*3.71,0.,time*5.);
    float up = 0.;
    if (iMouse.z>1.) up = 4.0*iMouse.y/iResolution.y-2.0;
	vec3 cameraTarget = vec3(0.,0.,0.)+base+vec3(sin(rotspeed)*cos(up),sin(up),cos(rotspeed)*cos(up));
	vec3 cameraPos = vec3(0.0)+base;//radius*sin(rotspeed),0.,radius*cos(rotspeed))+base;
	float h = height(cameraPos)+2.;
	cameraTarget.y += h;
	cameraPos.y += h;
	vec3 cameraUp = vec3(0.,1.,0.);
	vec2 uv = fragCoord.xy / iResolution.xy;
	return camera(uv,cameraPos,cameraTarget,cameraUp);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	fragColor = vec4(world(fragCoord),1.);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}