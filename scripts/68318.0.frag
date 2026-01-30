#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define R resolution
#define T time*10.
#define S smoothstep


float rnd(vec3 p) {
    return fract(sin(dot(p, vec3(12.345, 67.89, 412.12))) * 42123.45) * 2.0 - 1.0;
}
// perlin noise function.
float PR(vec3 p) {
    vec3 u = floor(p),
         v = fract(p),
         s = S(0., 1., v);
    
    float a = rnd(u),
          b = rnd(u + vec3(1., 0., 0.)),
          c = rnd(u + vec3(0., 1., 0.)),
          d = rnd(u + vec3(1., 1., 0.)),
          e = rnd(u + vec3(0., 0., 1.)),
          f = rnd(u + vec3(1., 0., 1.)),
          g = rnd(u + vec3(0., 1., 1.)),
          h = rnd(u + vec3(1., 1., 1.));
    
    return mix(mix(mix(a, b, s.x), mix(c, d, s.x), s.y),
               mix(mix(e, f, s.x), mix(g, h, s.x), s.y),
               s.z);
}

float hd(vec2 p) {										// hex functions
    return max(dot(abs(p),normalize(vec2(1.,1.73))),abs(p.x)); 
}

vec4 hx(vec2 p) {
    vec2 r = vec2(1.,1.73),
         hr = r*.5,
         GA = mod(p,r)-hr,
         GB = mod(p-hr,r)-hr,
         G = dot(GA,GA)<dot(GB,GB) ? GA : GB; 
    return vec4(atan(G.x,G.y),0.5-hd(G),(p-G));
}

void main() {
    vec2 U = (2.*gl_FragCoord.xy-R.xy)/max(R.x,R.y);				// set up coords

    vec3 lp = vec3(0.),
         ro = vec3(-3.21,13.,-12.);

    vec3 cf = normalize(lp-ro),							// set camera/ray
    	 cp = vec3(0.,1.,0.),
    	 cr = normalize(cross(cp, cf)),
    	 cu = normalize(cross(cf, cr)),
    	 c = ro + cf * .95,
         i = c + U.x * cr + U.y * cu,
         rd = i-ro;

    vec3 C = vec3(0.),
         p = vec3(0.);

    vec4 t = vec4(0.),
         d = vec4(0.);

    float pr;
    for (int i = 0; i<128;i++)							// marching
    {
        p = ro + d.x * rd;
        
        p.xz*= mat2(cos(T*.16+vec4(0,11,33,0)));		//@Fabrice
        vec4 H = hx(p.xz*.25) * 1.;                     // map
        float PR = PR(vec3(H.zw*.4,T*1.25))*1.75,
              Hmap = .12*(p.y-PR)/1.;
        pr = PR;
        t = vec4(Hmap,PR,H.z,H.y);

        d.yzw = t.yzw;
        if(t.x<.0001*d.x||d.x>50.) break;
        d.x += t.x;
    }

	vec3 M = .5 + .45*cos(2.*pr + 
                           vec3(3, 1.25, 1.25));	 	// mate and color
    if(d.x<50.) {
        C += M*S(.04,.05,d.w);
        C += vec3(1.)*S(.2,.21,d.w);
    }
    gl_FragColor = vec4(pow(C, vec3(0.4545)),1.);					// gamma out
}
