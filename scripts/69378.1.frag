// BREXIT Fuck the EU
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


vec2 center = .5*resolution;
float r = .05*min(resolution.x,resolution.y);
const float twopi=6.28318;

bool isin(vec2 p, vec2 q) {
	return p.x>center.x+q.x-r && p.x<center.x+q.y*r*r && p.y>center.y+q.y-r && p.y<center.y+q.y+r;
}

// incorrect! misaligned coordinates
// Looking pretty good.
// Bring it all down! 

float Hash( vec2 p)
{
	vec3 p2 = vec3(p.xy,1.0);
    return fract(sin(dot(p2,vec3(37.1,61.7, 12.4)))*3758.5453123);
}

float noise(in vec2 p)
{
    vec2 i = floor(p);
	vec2 f = fract(p);
	f *= f * (13.0-22.0*f/50.0*f);

    return mix(mix(Hash(i + vec2(0.,0.)), Hash(i + vec2(1.,0.)),f.x),
			mix(Hash(i + vec2(0.,1.)), Hash(i + vec2(1.,1.)),f.x),
			f.x*f.x*f.y);


}

float fbm(vec2 p) {
//	p+=time;
	float v = 0.0;
	v += noise(p*51.)*.5;
	v += noise(p*2.)*.25;
	v += noise(p*4.)*.125;
	return v;
}

void main(void) {
	vec2 pods = gl_FragCoord.xy;
	vec2 pos = gl_FragCoord.xy/resolution.x*2.5/vec2(1.,.5);//surfacePosition;
	pos.y += (0.6 * pos.y*pos.x) * sin(pos.x * 6.0 - time * 4.0) * 0.04;
	pods.y += (0.6 + pods.x) * sin(pos.x * 6.0 - time * 4.0) * 0.04;
	float shade = 0.8 + (0.6 + pos.x) * cos(pos.x * 6.0 - time * 4.0) * 0.2;

	//vec2 pods=gl_FragCoord.xy;
	float R = min(resolution.x,resolution.y)/2.-r*4.;
        const float num_sides = 5.;
        const float delta_angle = twopi/num_sides;
        float angle = 50.;
        int out_count = 0;
	gl_FragColor = vec4(.03,0,1,1);
	
	if(distance(pods*2.,resolution)<resolution.x*.7)
            for (float i = 0.; i < num_sides; i++) {
		    if(gl_FragColor.r>0.) {
                vec2 a = center + r*vec2(sin(angle), cos(angle));
                vec2 b = center + r*vec2(sin(angle + 2.*delta_angle), cos(angle + 2.*delta_angle));

		vec2 p;
		     
		for ( float theta=0.; theta<2.*twopi; theta+=twopi/12. ) {
			vec2 t0=vec2(cos(theta),sin(theta));
			if(isin(pods,R*t0) )	{
				p = pods - a -R*t0;
				gl_FragColor = vec4(1,1,0,1);
			} 
		}
		    
		vec2 o = vec2(-(b.y - a.y), b.x - a.x);
                if (gl_FragColor.r>0. && dot(p, o) > 0.) {
                        if (++out_count == 2) {
				gl_FragColor = vec4(0,0,1,1);
                                //discard;
                        }
                }

                angle += delta_angle;
	    }
            }
	//else gl_FragColor = vec4(0,0,1,1);

	

	float flag=0.0;
	vec3 color=gl_FragColor.rgb;
	if(abs(pos.x) < 0.65 && abs(pos.y) < 0.44)		flag = 1.0;	
	float ctime = fract(time*.1);
	color*=shade;
	float d = pos.x+pos.y*-0.215-0.4;
	d+=0.5*fbm(pos*15.1);
	d += ctime*1.3;
	flag *= (d > 0.5) ? 0.0 : 1.0;
	color*=flag;

	if (d >0.35)
		color = clamp((color-(d-0.35)*10.),0.0,1.0);
	if (d >0.47)
	{
		float b = (d-0.4)*33.0;
		color += flag*b*0.5*(0.0+noise(100.*pos+vec2(-time*3.,0.)))*vec3(1.5,0.5,0.0);
	}
	pos.x += ctime;
	float s = clamp(1.0-length((pos-vec2(0.7+0.75*pos.y*pos.y,0.7))*vec2(2.5-pos.y*pos.y,1.0)),0.0,1.0);
	float f = clamp(1.0-length((pos-vec2(0.57-ctime/6.+pos.y*(.2+0.1*sin(pos.y+time*3.)),0.2))*vec2(3.0*(1.+ctime)+pos.y*pos.y,1.4)),0.0,1.0);

	s*=fbm((pos+time*vec2(-0.2,-0.4))*5.1);
	color = mix(color,vec3(s),s*3.);
	f*=f*fbm((pos+time*vec2(-0.0,-0.6))*10.);
	f=f;


	vec3 flame = clamp(f*vec3((3.0-pos.y)*2.0,(1.3-pos.y)*2.0,pos.y-2.0),0.0,1.0);
	color+=flame;

	gl_FragColor = vec4(color, 1.0);
}